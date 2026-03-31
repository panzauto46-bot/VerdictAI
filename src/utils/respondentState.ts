export const DEFAULT_RESPONDENT_CLAIM = 'No response has been submitted yet.';

const EMPTY_RESPONDENT_CLAIMS = new Set([
  DEFAULT_RESPONDENT_CLAIM,
  'No response yet',
]);

export function hasRespondentSubmission(claim: string): boolean {
  const normalizedClaim = claim.trim();
  return normalizedClaim.length > 0 && !EMPTY_RESPONDENT_CLAIMS.has(normalizedClaim);
}
