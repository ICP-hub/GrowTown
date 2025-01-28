import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const CollectionCardSkeleton = () => {
  return (
    <div className="relative w-[280px] h-[380px] group transform transition-transform duration-300 ease-out">
      {/* Glow effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-b from-[#3D9635] to-[#50B248] rounded-xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>

      <div className="relative h-full backdrop-blur-sm bg-gradient-to-b from-[#29292C]/95 via-[#1a1a1a]/95 to-black/95 rounded-xl border border-white/10 shadow-lg shadow-black/20 overflow-hidden transition-all duration-300">
        <div className="relative h-[220px] w-full overflow-hidden rounded-lg border border-white/5">
          {/* Image skeleton */}
          <Skeleton width={280} height={220} className="rounded-lg" />

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          {/* Centered plus button skeleton */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-0 p-3 rounded-full bg-[#50B248] text-white shadow-lg transform opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out hover:bg-[#3D9635] hover:scale-110">
            <Skeleton circle width={40} height={40} />
          </div>

          {/* Delete button skeleton */}
          <div className="absolute top-3 right-3 p-2 rounded-full bg-black/30 backdrop-blur-sm border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-500/20 hover:border-red-500/30">
            <Skeleton circle width={32} height={32} />
          </div>
        </div>

        <div className="p-5">
          {/* Title skeleton */}
          <Skeleton width={200} height={25} className="mb-2" />

          {/* Subtitle skeleton */}
          <Skeleton width={150} height={20} className="mb-2" />

          {/* Info skeleton */}
          <div className="flex items-center gap-2 mt-4">
            <Skeleton width={90} height={20} className="rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionCardSkeleton;
