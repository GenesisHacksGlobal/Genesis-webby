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

export function ScrollOpacity({
  opacityRange = [0, 1],
  inputRange = [0, 1],
  className,
  style,
  ...props
}) {
  const { scrollProgress } = useScrollAnimationContext();
  const opacity = useTransform(scrollProgress, inputRange, opacityRange);
  return (
    <motion.div
      className={className}
      style={{ opacity, willChange: 'opacity', ...style }}
      {...props}
    />
  );
}

export function ScrollRotate({
  rotateRange = [0, 360],
  inputRange = [0, 1],
  className,
  style,
  ...props
}) {
  const { scrollProgress } = useScrollAnimationContext();
  const rotate = useTransform(scrollProgress, inputRange, rotateRange);
  return (
    <motion.div
      className={className}
      style={{ rotate, willChange: 'transform', ...style }}
      {...props}
    />
  );
}

export function ScrollBlur({
  blurRange = [12, 0],
  inputRange = [0, 1],
  className,
  style,
  ...props
}) {
  const { scrollProgress } = useScrollAnimationContext();
  const blur = useTransform(scrollProgress, inputRange, blurRange);
  const filter = useTransform(blur, (v) => `blur(${v}px)`);
  return (
    <motion.div
      className={className}
      style={{ filter, willChange: 'filter', ...style }}
      {...props}
    />
  );
}

export function ScrollClipPath({
  clipRange = ['inset(100% 0 0 0)', 'inset(0% 0 0 0)'],
  inputRange = [0, 1],
  className,
  style,
  ...props
}) {
  const { scrollProgress } = useScrollAnimationContext();
  const clipPath = useTransform(scrollProgress, inputRange, clipRange);
  return (
    <motion.div
      className={className}
      style={{ clipPath, willChange: 'clip-path', ...style }}
      {...props}
    />
  );
}

export function ScrollLetterSpacing({
  spacingRange = ['0.5em', '-0.02em'],
  inputRange = [0, 1],
  className,
  style,
  ...props
}) {
  const { scrollProgress } = useScrollAnimationContext();
  const letterSpacing = useTransform(scrollProgress, inputRange, spacingRange);
  return (
    <motion.div
      className={className}
      style={{ letterSpacing, willChange: 'letter-spacing', ...style }}
      {...props}
    />
  );
}
