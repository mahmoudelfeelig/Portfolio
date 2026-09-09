export const transition = {
  duration: 0.42,
  ease: [0.2, 0.8, 0.2, 1] as const,
};

export const sectionVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition },
};

export const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};
