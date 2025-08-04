"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function LoadingOverlay({ show = false, text = "Loading..." }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed top-[80px] bottom-[60px] left-0 right-0 z-40 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg
              viewBox="0 0 100 100"
              className="absolute w-full h-full"
              fill="none"
            >
              <motion.polygon
                points="50,10 90,50 90,90 10,90 10,50"
                stroke="#1e2d4d"
                strokeWidth="4"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  duration: 2,
                  ease: "easeInOut",
                }}
              />
            </svg>

            <div className="absolute w-20 h-20 rounded overflow-hidden">
              <Image
                src="/Logo-Bela.svg"
                alt="Bela Nepal Logo"
                fill
                className="object-contain"
              />
            </div>
          </div>

          <p className="mt-4 text-lg font-semibold text-gray-800">{text}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
