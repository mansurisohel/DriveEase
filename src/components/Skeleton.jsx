export const SkeletonCard = () => (
  <div className="bg-white rounded-2xl overflow-hidden border border-gray-100">
    <div className="skeleton h-48 w-full rounded-none" />
    <div className="p-5 space-y-3">
      <div className="flex justify-between">
        <div className="space-y-1.5">
          <div className="skeleton h-5 w-36" />
          <div className="skeleton h-3 w-14" />
        </div>
        <div className="skeleton h-6 w-14" />
      </div>
      <div className="skeleton h-3 w-28" />
      <div className="flex gap-3 border-t border-gray-100 pt-3">
        <div className="skeleton h-3 w-16" />
        <div className="skeleton h-3 w-16" />
        <div className="skeleton h-3 w-16" />
      </div>
      <div className="skeleton h-10 w-full rounded-xl" />
    </div>
  </div>
);

export const SkeletonRow = () => (
  <div className="flex items-center gap-4 p-4 border-b border-gray-100">
    <div className="skeleton w-14 h-10 rounded-xl" />
    <div className="flex-1 space-y-2">
      <div className="skeleton h-4 w-40" />
      <div className="skeleton h-3 w-24" />
    </div>
    <div className="skeleton h-6 w-20 rounded-full" />
    <div className="skeleton h-6 w-16" />
  </div>
);

export const SkeletonStat = () => (
  <div className="bg-white rounded-2xl p-6 border border-gray-100">
    <div className="skeleton h-12 w-12 rounded-xl mb-4" />
    <div className="skeleton h-8 w-20 mb-2" />
    <div className="skeleton h-4 w-28" />
  </div>
);
