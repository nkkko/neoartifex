'use client';

import { ReactNode } from 'react';
import { motion, Variants } from 'framer-motion';

type AnimatedElementProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
};

// Fade In animation
export const FadeIn = ({ children, delay = 0, className = '' }: AnimatedElementProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Slide up and fade in
export const SlideUp = ({ children, delay = 0, className = '' }: AnimatedElementProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.6, 
        delay,
        ease: [0.22, 1, 0.36, 1] // Custom easing for more organic motion
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Staggered children animation
type StaggerContainerProps = {
  children: ReactNode;
  staggerDelay?: number;
  containerDelay?: number;
  className?: string;
};

export const StaggerContainer = ({ 
  children, 
  staggerDelay = 0.1, 
  containerDelay = 0,
  className = '' 
}: StaggerContainerProps) => {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: containerDelay,
      }
    }
  };
  
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const StaggerItem = ({ children, className = '' }: { children: ReactNode, className?: string }) => {
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };
  
  return (
    <motion.div
      variants={itemVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Subtle scale animation on hover - good for cards and buttons
export const ScaleOnHover = ({ children, className = '' }: AnimatedElementProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Text reveal animation
export const TextReveal = ({ children, delay = 0, className = '' }: AnimatedElementProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.4, 
        delay,
        ease: "easeOut"
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Scroll-triggered animation (appears when scrolled into view)
export const ScrollReveal = ({ children, className = '' }: AnimatedElementProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};