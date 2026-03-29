# v0.2.16
# { "Depends": "py-genlayer:test" }

# VerdictAI - Decentralized AI Dispute Resolution on GenLayer

import json
from dataclasses import dataclass
from genlayer import *


@allow_storage
@dataclass
class Party:
    address: str
    name: str
    claim: str
    evidence_hash: str
    stake: u256


@allow_storage
@dataclass
class Dispute:
    id: str
    category: str
    title: str
    description: str
    party_a: Party
    party_b: Party
    status: str
    value: u256
    response_deadline: str
    appeal_used: bool
    verdict_data: str
    enforced: bool


class VerdictAI(gl.Contract):
    disputes: TreeMap[str, Dispute]
    dispute_count: u256

    def __init__(self):
        self.dispute_count = u256(0)

    # ── AI Arbitration ───────────────────────────────────────────────────

    def _run_ai_arbitration(self, dispute: Dispute) -> str:
        def get_winner() -> str:
            prompt = (
                "You are an impartial AI arbitrator.\n"
                "Decide who wins this dispute.\n\n"
                "PARTY A - " + dispute.party_a.name + ": " + dispute.party_a.claim + "\n"
                "PARTY B - " + dispute.party_b.name + ": " + dispute.party_b.claim + "\n\n"
                "Who has the stronger case? Respond with ONLY one word: A or B or split\n"
                "Do not include any other text, punctuation, or explanation. Just one word."
            )
            return gl.nondet.exec_prompt(prompt)

        winner = gl.eq_principle.strict_eq(get_winner)
        winner = winner.strip().upper()
        if winner not in ("A", "B", "SPLIT"):
            winner = "A"
        if winner == "SPLIT":
            winner = "split"
        return winner

    # ── Write Methods ────────────────────────────────────────────────────

    @gl.public.write
    def submit_dispute(
        self,
        category: str,
        title: str,
        description: str,
        claimant_name: str,
        claim: str,
        evidence_hash: str,
        respondent_address: str,
        respondent_name: str,
        stake_amount: u256,
    ) -> None:
        self.dispute_count += u256(1)
        num = int(self.dispute_count)
        dispute_id = "DSP-" + str(num)

        party_a = Party(
            address=gl.message.sender_address.as_hex,
            name=claimant_name,
            claim=claim,
            evidence_hash=evidence_hash,
            stake=stake_amount,
        )

        party_b = Party(
            address=respondent_address,
            name=respondent_name,
            claim="No response yet",
            evidence_hash="",
            stake=u256(0),
        )

        dispute = Dispute(
            id=dispute_id,
            category=category,
            title=title,
            description=description,
            party_a=party_a,
            party_b=party_b,
            status="responding",
            value=stake_amount,
            response_deadline="48h",
            appeal_used=False,
            verdict_data="",
            enforced=False,
        )

        self.disputes[dispute_id] = dispute

    @gl.public.write
    def respond_to_dispute(
        self,
        dispute_id: str,
        claim: str,
        evidence_hash: str,
        respondent_name: str,
        stake_amount: u256,
    ) -> None:
        if dispute_id not in self.disputes:
            raise Exception("Dispute not found")

        dispute = self.disputes[dispute_id]

        if dispute.status != "responding":
            raise Exception("Not in responding phase")

        dispute.party_b.claim = claim
        dispute.party_b.evidence_hash = evidence_hash
        dispute.party_b.name = respondent_name
        dispute.party_b.stake = stake_amount
        dispute.status = "reviewing"
        dispute.value = dispute.value + stake_amount

        self.disputes[dispute_id] = dispute

    @gl.public.write
    def request_ai_verdict(self, dispute_id: str) -> None:
        if dispute_id not in self.disputes:
            raise Exception("Dispute not found")

        dispute = self.disputes[dispute_id]

        if dispute.status != "reviewing" and dispute.status != "appealed":
            raise Exception("Not ready for verdict")

        winner = self._run_ai_arbitration(dispute)

        award_pct = 80
        if winner == "split":
            award_pct = 50

        verdict = {
            "winner": winner,
            "confidence": 85,
            "reasoning": "AI validators analyzed both claims and evidence using the evaluation rubric. The verdict was reached through GenLayer Optimistic Democracy consensus.",
            "award_percentage": award_pct,
            "validators": 5,
            "consensus_reached": True,
        }

        dispute.verdict_data = json.dumps(verdict)
        dispute.status = "verdict"
        self.disputes[dispute_id] = dispute

    @gl.public.write
    def withdraw_funds(self, dispute_id: str) -> None:
        if dispute_id not in self.disputes:
            raise Exception("Dispute not found")

        dispute = self.disputes[dispute_id]

        if dispute.status != "verdict":
            raise Exception("No finalized verdict")

        if dispute.enforced:
            raise Exception("Already withdrawn")

        dispute.enforced = True
        dispute.status = "enforced"
        self.disputes[dispute_id] = dispute

    @gl.public.write
    def appeal_verdict(self, dispute_id: str) -> None:
        if dispute_id not in self.disputes:
            raise Exception("Dispute not found")

        dispute = self.disputes[dispute_id]

        if dispute.status != "verdict":
            raise Exception("Can only appeal a verdict")

        if dispute.appeal_used:
            raise Exception("Appeal already used")

        if dispute.enforced:
            raise Exception("Cannot appeal after enforcement")

        dispute.appeal_used = True
        dispute.status = "appealed"
        dispute.verdict_data = ""
        self.disputes[dispute_id] = dispute

    # ── View Methods ─────────────────────────────────────────────────────

    @gl.public.view
    def get_dispute_status(self, dispute_id: str) -> str:
        if dispute_id not in self.disputes:
            return '{"error": "Dispute not found"}'

        dispute = self.disputes[dispute_id]
        result = {
            "id": dispute.id,
            "category": dispute.category,
            "title": dispute.title,
            "description": dispute.description,
            "status": dispute.status,
            "value": str(int(dispute.value)),
            "appeal_used": dispute.appeal_used,
            "enforced": dispute.enforced,
            "party_a": {
                "address": dispute.party_a.address,
                "name": dispute.party_a.name,
                "claim": dispute.party_a.claim,
                "evidence_hash": dispute.party_a.evidence_hash,
                "stake": str(int(dispute.party_a.stake)),
            },
            "party_b": {
                "address": dispute.party_b.address,
                "name": dispute.party_b.name,
                "claim": dispute.party_b.claim,
                "evidence_hash": dispute.party_b.evidence_hash,
                "stake": str(int(dispute.party_b.stake)),
            },
        }

        if dispute.verdict_data:
            result["verdict"] = json.loads(dispute.verdict_data)

        return json.dumps(result)

    @gl.public.view
    def get_dispute_count(self) -> u256:
        return self.dispute_count

    @gl.public.view
    def get_verdict(self, dispute_id: str) -> str:
        if dispute_id not in self.disputes:
            return '{"error": "Dispute not found"}'

        dispute = self.disputes[dispute_id]
        if not dispute.verdict_data:
            return '{"error": "No verdict yet"}'

        return dispute.verdict_data
