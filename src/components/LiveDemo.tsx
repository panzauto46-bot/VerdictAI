import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, CheckCircle2, Users, Shield, Zap } from 'lucide-react';

export default function LiveDemo() {
  const [step, setStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const steps = [
    { label: 'Dispute Submitted', icon: Users, color: 'text-zinc-200' },
    { label: 'LLM-A Evaluating Rubric', icon: Brain, color: 'text-zinc-200' },
    { label: 'LLM-B Evaluating Rubric', icon: Brain, color: 'text-zinc-200' },
    { label: 'LLM-C Evaluating Rubric', icon: Brain, color: 'text-zinc-200' },
    { label: 'Equivalent Outcome Reached', icon: Shield, color: 'text-zinc-100' },
    { label: 'Verdict Finalized On-Chain', icon: CheckCircle2, color: 'text-white' },
  ];

  const startDemo = () => {
    setIsRunning(true);
    setStep(0);
  };

  useEffect(() => {
    if (!isRunning) return;

    if (step < steps.length - 1) {
      const timer = setTimeout(() => {
        setStep((currentStep) => currentStep + 1);
      }, 1500);
      return () => clearTimeout(timer);
    }

    setIsRunning(false);
  }, [step, isRunning, steps.length]);

  return (
    <section id="demo" className="relative z-10 bg-black/40 py-16 sm:py-20 lg:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">See AI Consensus in Action</h2>
          <p className="text-base sm:text-lg text-zinc-200">
            Watch how independent validators analyze with the same rubric and converge on an equivalent result
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-zinc-800 bg-zinc-950/75 p-4 sm:p-6 lg:p-8 backdrop-blur-sm"
        >
          {/* Demo Visualization */}
          <div className="relative h-56 sm:h-64 mb-8">
            {/* Center Node */}
            <div className="absolute top-1/2 left-1/2 z-10 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-xl bg-white shadow-lg shadow-white/10">
              <Zap className="h-10 w-10 text-black" />
            </div>

            {/* Validator Nodes */}
            {[0, 1, 2, 3, 4].map((i) => {
              const angle = (i * 72 - 90) * (Math.PI / 180);
              const radius = 100;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;
              const isActive = isRunning && step >= 1 && step <= 4;
              const isComplete = step > 4;

              return (
                <motion.div
                  key={i}
                  initial={{ scale: 0.8, opacity: 0.5 }}
                  animate={{
                    scale: isActive || isComplete ? 1 : 0.8,
                    opacity: isActive || isComplete ? 1 : 0.5,
                  }}
                  className="absolute top-1/2 left-1/2"
                  style={{
                    transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                  }}
                >
                  <div
                    className={`w-14 h-14 rounded-lg flex items-center justify-center transition-colors ${
                      isComplete
                        ? 'border-2 border-white bg-white/10'
                        : isActive
                          ? 'border-2 border-zinc-200 bg-zinc-100/10'
                          : 'border-2 border-zinc-700 bg-zinc-900/50'
                    }`}
                  >
                    <Brain
                      className={`w-6 h-6 ${
                        isComplete
                          ? 'text-white'
                          : isActive
                            ? 'text-zinc-200 animate-pulse'
                            : 'text-zinc-300'
                      }`}
                    />
                  </div>
                  <div className="text-center mt-2">
                    <span
                      className={`text-xs ${isComplete ? 'text-white' : isActive ? 'text-zinc-200' : 'text-zinc-300'}`}
                    >
                      LLM-{String.fromCharCode(65 + i)}
                    </span>
                  </div>
                </motion.div>
              );
            })}

            {/* Connection Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {[0, 1, 2, 3, 4].map((i) => {
                const angle = (i * 72 - 90) * (Math.PI / 180);
                const radius = 100;
                const x = Math.cos(angle) * radius + 200;
                const y = Math.sin(angle) * radius + 128;
                const isActive = isRunning && step >= 1;

                return (
                  <line
                    key={i}
                    x1="200"
                    y1="128"
                    x2={x}
                    y2={y}
                    stroke={isActive ? '#ffffff' : '#3f3f46'}
                    strokeWidth="2"
                    strokeDasharray={isActive ? '0' : '5,5'}
                    className="transition-all duration-500"
                  />
                );
              })}
            </svg>
          </div>

          {/* Progress Steps */}
          <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
            <AnimatePresence mode="wait">
              {steps.slice(0, step + 1).map((currentStep, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs sm:text-sm ${
                    i === step ? 'border border-zinc-200 bg-white/10' : 'bg-zinc-900/70'
                  }`}
                >
                  <currentStep.icon className={`w-4 h-4 ${currentStep.color}`} />
                  <span className="text-white">{currentStep.label}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Result */}
          <AnimatePresence>
            {step === 5 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-zinc-600 bg-zinc-900 p-4 text-center"
              >
                <CheckCircle2 className="mx-auto mb-2 h-8 w-8 text-white" />
                <div className="font-semibold text-white">Consensus: Party A wins (87% confidence)</div>
                <div className="text-sm text-zinc-200">5/5 validators reached equivalent outcome | Auto on-chain enforcement triggered</div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Start Button */}
          {!isRunning && step === 0 && (
            <button
              onClick={startDemo}
              className="mt-4 w-full rounded-lg bg-white px-6 py-3 font-semibold text-black transition-all hover:bg-zinc-200"
            >
              Run Demo
            </button>
          )}

          {step > 0 && !isRunning && (
            <button
              onClick={() => {
                setStep(0);
                startDemo();
              }}
              className="mt-4 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-6 py-3 font-medium text-white transition-all hover:bg-zinc-800"
            >
              Run Again
            </button>
          )}
        </motion.div>
      </div>
    </section>
  );
}
