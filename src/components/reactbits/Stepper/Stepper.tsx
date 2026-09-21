'use client';

import React, { useState, Children, useRef, useLayoutEffect, useEffect, ReactNode, ComponentPropsWithoutRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import './Stepper.css';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export interface StepperProps extends ComponentPropsWithoutRef<'div'> {
  children: ReactNode;
  initialStep?: number;
  currentStep?: number;
  onStepChange?: (step: number) => void;
  onFinalStepCompleted?: () => void;
  stepCircleContainerClassName?: string;
  stepContainerClassName?: string;
  contentClassName?: string;
  footerClassName?: string;
  backButtonProps?: ComponentPropsWithoutRef<'button'>;
  nextButtonProps?: ComponentPropsWithoutRef<'button'>;
  backButtonText?: string;
  nextButtonText?: string;
  disableStepIndicators?: boolean;
  renderStepIndicator?: (props: {
    step: number;
    currentStep: number;
    onStepClick: (step: number) => void;
  }) => ReactNode;
}

export default function Stepper({
  children,
  initialStep = 1,
  currentStep: controlledStep,
  onStepChange = () => {},
  onFinalStepCompleted = () => {},
  stepCircleContainerClassName = '',
  stepContainerClassName = '',
  contentClassName = '',
  footerClassName = '',
  backButtonProps = {},
  nextButtonProps = {},
  backButtonText = 'Back',
  nextButtonText = 'Continue',
  disableStepIndicators = false,
  renderStepIndicator,
  ...rest
}: StepperProps) {
  const [internalStep, setInternalStep] = useState(initialStep);
  const currentStep = controlledStep !== undefined ? controlledStep : internalStep;
  const [direction, setDirection] = useState(0);
  const stepsArray = Children.toArray(children);
  const totalSteps = stepsArray.length;
  const isCompleted = currentStep > totalSteps;
  const isLastStep = currentStep === totalSteps;

  const updateStep = (newStep: number) => {
    if (controlledStep === undefined) {
      setInternalStep(newStep);
    }
    if (newStep > totalSteps) {
      onFinalStepCompleted();
    } else {
      onStepChange(newStep);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setDirection(-1);
      updateStep(currentStep - 1);
    }
  };

  const handleNext = () => {
    if (!isLastStep) {
      setDirection(1);
      updateStep(currentStep + 1);
    }
  };

  const handleComplete = () => {
    setDirection(1);
    updateStep(totalSteps + 1);
  };

  return (
    <div className="outer-container" {...rest}>
      <div className={`step-circle-container ${stepCircleContainerClassName}`}>
        <div className={`step-indicator-row ${stepContainerClassName}`}>
          {stepsArray.map((_, index) => {
            const stepNumber = index + 1;
            const isNotLastStep = index < totalSteps - 1;
            return (
              <React.Fragment key={stepNumber}>
                {renderStepIndicator ? (
                  renderStepIndicator({
                    step: stepNumber,
                    currentStep,
                    onStepClick: clicked => {
                      setDirection(clicked > currentStep ? 1 : -1);
                      updateStep(clicked);
                    }
                  })
                ) : (
                  <StepIndicator
                    step={stepNumber}
                    disableStepIndicators={disableStepIndicators}
                    currentStep={currentStep}
                    onClickStep={clicked => {
                      setDirection(clicked > currentStep ? 1 : -1);
                      updateStep(clicked);
                    }}
                  />
                )}
                {isNotLastStep && <StepConnector isComplete={currentStep > stepNumber} />}
              </React.Fragment>
            );
          })}
        </div>

        <StepContentWrapper
          isCompleted={isCompleted}
          currentStep={currentStep}
          direction={direction}
          className={`step-content-default ${contentClassName}`}
        >
          {stepsArray[currentStep - 1]}
        </StepContentWrapper>

        {!isCompleted && (
          <div className={`footer-container ${footerClassName}`}>
            <div className={`footer-nav ${currentStep !== 1 ? 'spread' : 'end'}`}>
              {currentStep !== 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className={`back-button ${currentStep === 1 ? 'inactive' : ''}`}
                  {...backButtonProps}
                >
                  {backButtonText}
                </button>
              )}
              <button
                type="button"
                onClick={isLastStep ? handleComplete : handleNext}
                className="next-button"
                {...nextButtonProps}
              >
                {isLastStep ? 'Complete' : nextButtonText}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StepContentWrapper({
  isCompleted,
  currentStep,
  direction,
  children,
  className
}: {
  isCompleted: boolean;
  currentStep: number;
  direction: number;
  children: ReactNode;
  className: string;
}) {
  const [parentHeight, setParentHeight] = useState<number | 'auto'>('auto');

  return (
    <motion.div
      className={className}
      style={{ position: 'relative', overflow: 'hidden' }}
      animate={{ height: isCompleted ? 0 : parentHeight }}
      transition={{ type: 'spring', duration: 0.4 }}
    >
      <AnimatePresence initial={false} mode="sync" custom={direction}>
        {!isCompleted && (
          <SlideTransition key={currentStep} direction={direction} onHeightReady={h => setParentHeight(h)}>
            {children}
          </SlideTransition>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function SlideTransition({
  children,
  direction,
  onHeightReady
}: {
  children: ReactNode;
  direction: number;
  onHeightReady: (height: number) => void;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useIsomorphicLayoutEffect(() => {
    if (containerRef.current) {
      onHeightReady(containerRef.current.offsetHeight);
    }
  }, [children, onHeightReady]);

  return (
    <motion.div
      ref={containerRef}
      custom={direction}
      variants={stepVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
      style={{ position: 'relative', width: '100%' }}
    >
      {children}
    </motion.div>
  );
}

const stepVariants = {
  enter: (dir: number) => ({
    x: dir >= 0 ? 30 : -30,
    opacity: 0
  }),
  center: {
    x: 0,
    opacity: 1
  },
  exit: (dir: number) => ({
    x: dir >= 0 ? -30 : 30,
    opacity: 0
  })
};

export function Step({ children }: { children: ReactNode }) {
  return <div className="step-default">{children}</div>;
}

function StepIndicator({
  step,
  currentStep,
  onClickStep,
  disableStepIndicators
}: {
  step: number;
  currentStep: number;
  onClickStep: (step: number) => void;
  disableStepIndicators: boolean;
}) {
  const status = currentStep === step ? 'active' : currentStep > step ? 'complete' : 'inactive';

  const handleClick = () => {
    if (step !== currentStep && !disableStepIndicators) {
      onClickStep(step);
    }
  };

  return (
    <motion.div
      onClick={handleClick}
      className="step-indicator"
      style={disableStepIndicators ? { pointerEvents: 'none', opacity: 0.6 } : {}}
      animate={status}
      initial={false}
    >
      <motion.div
        variants={{
          inactive: { scale: 1, backgroundColor: '#f1f5f9', color: '#64748b' },
          active: { scale: 1.06, backgroundColor: '#0d9488', color: '#ffffff' },
          complete: { scale: 1, backgroundColor: '#0d9488', color: '#ffffff' }
        }}
        transition={{ duration: 0.25 }}
        className="step-indicator-inner font-mono text-xs"
      >
        {status === 'complete' ? (
          <CheckIcon className="check-icon" />
        ) : status === 'active' ? (
          <div className="active-dot" />
        ) : (
          <span className="step-number">{step}</span>
        )}
      </motion.div>
    </motion.div>
  );
}

function StepConnector({ isComplete }: { isComplete: boolean }) {
  const lineVariants = {
    incomplete: { width: 0, backgroundColor: 'transparent' },
    complete: { width: '100%', backgroundColor: '#0d9488' }
  };

  return (
    <div className="step-connector">
      <motion.div
        className="step-connector-inner"
        variants={lineVariants}
        initial={false}
        animate={isComplete ? 'complete' : 'incomplete'}
        transition={{ duration: 0.35 }}
      />
    </div>
  );
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
      <motion.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.05, type: 'tween', ease: 'easeOut', duration: 0.25 }}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}
