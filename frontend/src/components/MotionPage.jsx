import { motion } from "framer-motion";

export default function MotionPage({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, filter: "blur(2px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: 6, filter: "blur(2px)" }}
      transition={{ duration: 0.25 }}
    >
      {children}
    </motion.div>
  );
}