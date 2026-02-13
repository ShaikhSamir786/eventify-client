import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';

export const PageLoadingSkeleton = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.2 }}
    className="p-4 lg:p-8 space-y-6"
  >
    <div className="space-y-2">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-72" />
    </div>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map(i => (
        <Skeleton key={i} className="h-28 rounded-xl" />
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Skeleton className="lg:col-span-2 h-64 rounded-2xl" />
      <Skeleton className="h-64 rounded-2xl" />
    </div>
  </motion.div>
);
