import { motion } from "framer-motion";

export const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl flex flex-col items-center gap-4">
        <div className="relative w-20 h-20">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute inset-0 border-4 border-amber-500 rounded-full"
              initial={{ scale: 1, opacity: 0.25 }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.25, 1, 0.25],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
        <div className="text-center mt-5">
          <h3 className="text-lg font-semibold mb-2">Analyzing Collection</h3>
          <p className="text-primary/50 text-sm">
            Generating whisky embeddings for smart recommendations...
          </p>

          <p className="text-primary/50 text-sm font-medium mt-3">
            This may take a few minutes...
          </p>
        </div>
      </div>
    </div>
  );
};
