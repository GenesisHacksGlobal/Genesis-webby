import * as React from 'react';
import { cn } from '@/lib/utils';
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';

const ScrollAnimationContext = React.createContext(undefined);

export function useScrollAnimationContext() {
  const context = React.useContext(ScrollAnimationContext);
  if (!context) {
    throw new Error(
      'useScrollAnimationContext must be used within a ScrollAnimationContextProvider',
    );
  }
  return context;
}

export function ScrollAnimation({
  spacerClass,
  className,
  children,
  ...props
}) {
  const scrollRef = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: scrollRef,
  });
  const smoothProgress = useSpring(scrollYProgress, {
    damping: 30,
    stiffness: 400,
    restDelta: 0.001,
  });
  const reducedMotion = useReducedMotion();
  const scrollProgress = reducedMotion ? scrollYProgress : smoothProgress;

  return (
    <ScrollAnimationContext.Provider value={{ scrollProgress }}>
      <div ref={scrollRef} className={cn('relative', className)} {...props}>
        {children}
        <div className={cn('w-full h-96', spacerClass)} />
      </div>
    </ScrollAnimationContext.Provider>
  );
}

export function ScrollTranslateY({
  yRange = [0, 384],
  inputRange = [0, 1],
  style,
  className,
  ...props
}) {
  const { scrollProgress } = useScrollAnimationContext();
  const y = useTransform(scrollProgress, inputRange, yRange);
  return (
    <motion.div
      style={{ y, willChange: 'transform', ...style }}
      className={cn('relative origin-top', className)}
      {...props}
    />
  );
}

export function ScrollTranslateX({
  xRange = [0, 100],
  inputRange = [0, 1],
  style,
  className,
  ...props
}) {
  const { scrollProgress } = useScrollAnimationContext();
  const x = useTransform(scrollProgress, inputRange, xRange);
  return (
    <motion.div
      style={{ x, willChange: 'transform', ...style }}
      className={cn('relative origin-top', className)}
      {...props}
    />
  );
}

export function ScrollScale({
  scaleRange = [1.2, 1],
  inputRange = [0, 1],
  className,
  style,
  ...props
}) {
  const { scrollProgress } = useScrollAnimationContext();
  const scale = useTransform(scrollProgress, inputRange, scaleRange);
  return (
    <motion.div
      className={className}
      style={{ scale, willChange: 'transform', ...style }}
      {...props}
    />
  );
}
