export const motion = {
  duration: { fast: 180, normal: 420, slow: 720, cinematic: 1200 },
  ease: {
    standard: 'cubic-bezier(.22, 1, .36, 1)',
    exit: 'cubic-bezier(.4, 0, 1, 1)',
    linear: 'linear',
  },
} as const;

export type MotionToken = keyof typeof motion.duration;
