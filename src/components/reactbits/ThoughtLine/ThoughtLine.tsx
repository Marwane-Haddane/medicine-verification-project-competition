'use client';

import React, { useEffect, useLayoutEffect, useRef, useState, ReactNode, CSSProperties } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowDown01Icon, SparklesIcon, Tick02Icon } from '@hugeicons/core-free-icons';
import './ThoughtLine.css';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

const EMPTY_STEPS: string[] = [];

const fmt = (ds: number) => (ds < 600 ? `${(ds / 10).toFixed(1)}s` : `${Math.floor(ds / 600)}m ${((ds % 600) / 10).toFixed(1)}s`);

export interface ThoughtLineProps {
  label?: string;
  doneLabel?: string;
  renderLabel?: (text: string, working: boolean) => ReactNode;
  glyph?: 'sparkle' | 'dot' | 'none' | ReactNode;
  steps?: string[];
  collapsible?: boolean;
  collapseOnSettle?: boolean;
  color?: string;
  glyphColor?: string;
  fontSize?: number;
  breathPeriod?: number;
  breathDepth?: number;
  shimmer?: boolean;
  shimmerDuration?: number;
  settleDuration?: number;
  settleBlur?: number;
  working?: boolean;
  settleAfter?: number;
  elapsed?: number;
  showTimer?: boolean;
  onSettle?: (seconds: number) => void;
  className?: string;
  style?: CSSProperties;
}

export default function ThoughtLine({
  label = 'Thinking…',
  doneLabel = '',
  renderLabel,
  glyph = 'sparkle',
  steps = EMPTY_STEPS,
  collapsible = true,
  collapseOnSettle = true,
  color = 'currentColor',
  glyphColor = '',
  fontSize = 16,
  breathPeriod = 1.6,
  breathDepth = 0.45,
  shimmer = true,
  shimmerDuration = 1.8,
  settleDuration = 350,
  settleBlur = 2,
  working = true,
  settleAfter = 0,
  elapsed,
  showTimer = true,
  onSettle,
  className = '',
  style
}: ThoughtLineProps) {
  const reduce = useReducedMotion();
  const [autoSettled, setAutoSettled] = useState(false);
  const [open, setOpen] = useState(true);
  const isWorking = working && !autoSettled;
  const isExpanded = open && (!collapseOnSettle || isWorking);
  const doneText = doneLabel || (showTimer ? 'Thought for' : 'Done thinking');

  const timerRef = useRef<HTMLSpanElement>(null);
  const dsRef = useRef(0);
  const settledRef = useRef(false);

  const paint = (ds: number) => {
    dsRef.current = ds;
    if (timerRef.current) timerRef.current.textContent = fmt(ds);
  };

  useIsomorphicLayoutEffect(() => {
    if (elapsed != null) {
      paint(Math.round(elapsed * 10));
      return undefined;
    }
    if (!isWorking) return undefined;
    const startedAt = performance.now();
    paint(0);
    const id = setInterval(() => paint(Math.floor((performance.now() - startedAt) / 100)), 100);
    return () => clearInterval(id);
  }, [isWorking, elapsed]);

  useEffect(() => {
    if (settleAfter > 0 && working) {
      const timer = setTimeout(() => {
        setAutoSettled(true);
      }, settleAfter * 1000);
      return () => clearTimeout(timer);
    }
  }, [settleAfter, working]);

  useEffect(() => {
    if (!isWorking && !settledRef.current) {
      settledRef.current = true;
      onSettle?.(dsRef.current / 10);
    } else if (isWorking) {
      settledRef.current = false;
    }
  }, [isWorking, onSettle]);

  const toggleOpen = () => {
    if (collapsible && steps.length > 0) {
      setOpen((prev) => !prev);
    }
  };

  const renderGlyph = () => {
    if (glyph === 'none') return null;
    if (React.isValidElement(glyph)) return glyph;
    if (glyph === 'dot') return <span className="thought-line__dot" />;
    
    // Default 'sparkle'
    if (isWorking) {
      return <HugeiconsIcon icon={SparklesIcon} size={fontSize * 1.1} />;
    }
    return <HugeiconsIcon icon={Tick02Icon} size={fontSize * 1.1} />;
  };

  const currentText = isWorking ? label : doneText;

  return (
    <div
      className={`thought-line${className ? ` ${className}` : ''}`}
      data-working={isWorking}
      style={{
        '--tl-font': `${fontSize}px`,
        '--tl-color': color,
        '--tl-glyph-color': glyphColor || color,
        '--tl-period': `${breathPeriod}s`,
        '--tl-depth': breathDepth,
        '--tl-shimmer': `${shimmerDuration}s`,
        '--tl-settle': `${settleDuration}ms`,
        '--tl-blur': `${settleBlur}px`,
        ...style
      } as CSSProperties}
    >
      <div
        role={collapsible && steps.length > 0 ? 'button' : undefined}
        tabIndex={collapsible && steps.length > 0 ? 0 : undefined}
        onClick={toggleOpen}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && collapsible && steps.length > 0) {
            e.preventDefault();
            toggleOpen();
          }
        }}
        className="thought-line__head"
        data-interactive={collapsible && steps.length > 0 ? '' : undefined}
      >
        <span className="thought-line__glyph">{renderGlyph()}</span>

        <span className="thought-line__label-wrap">
          {renderLabel ? (
            renderLabel(currentText, isWorking)
          ) : (
            <span
              className={`thought-line__label ${
                shimmer && isWorking && !reduce ? 'thought-line__label--shimmer' : ''
              }`}
            >
              {currentText}
            </span>
          )}

          {showTimer && (
            <span ref={timerRef} className="thought-line__timer" aria-hidden="true">
              0.0s
            </span>
          )}
        </span>

        {collapsible && steps.length > 0 && (
          <HugeiconsIcon
            icon={ArrowDown01Icon}
            size={fontSize * 0.9}
            className={`thought-line__chevron ${isExpanded ? 'thought-line__chevron--open' : ''}`}
          />
        )}
      </div>

      <AnimatePresence>
        {isExpanded && steps.length > 0 && (
          <motion.ul
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: reduce ? 0 : 0.2 }}
            className="thought-line__trace"
          >
            {steps.map((step, idx) => {
              const isLast = idx === steps.length - 1;
              const isStepDone = !isWorking || !isLast;
              return (
                <li
                  key={idx}
                  className={`thought-line__step ${
                    isLast && isWorking ? 'thought-line__step--active' : ''
                  }`}
                >
                  <span className="thought-line__step-icon">
                    {isStepDone ? (
                      <HugeiconsIcon icon={Tick02Icon} size={fontSize * 0.75} className="text-emerald-500" />
                    ) : (
                      <HugeiconsIcon icon={SparklesIcon} size={fontSize * 0.75} className="animate-spin text-teal-600" />
                    )}
                  </span>
                  <span>{step}</span>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
