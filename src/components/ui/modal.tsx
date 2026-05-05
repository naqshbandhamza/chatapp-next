'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          style={{zIndex:"9999"}}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
           style={{zIndex:"9999"}}
            className="bg-white text-black rounded-2xl p-6 shadow-2xl max-w-md w-full mx-4"
            initial={{ scale: 0.9, opacity: 0,y:-500 }}
            animate={{ scale: 1, opacity: 1,y:0 }}
            exit={{ scale: 0.9, opacity: 0,y:-500 }}
            // transition={{
            //     duration: 0.4,
            //     ease: [0.42, 0, 0.58, 1] 
            //   }}
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
