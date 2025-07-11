"use client";

import React, { useRef } from "react";
import KinAnimationSection from "@/components/KinAnimationSection";

const TestScrollPage = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="w-screen h-screen overflow-hidden">
      {/* 실제 스크롤 영역 */}
      <div
        ref={scrollContainerRef}
        className="h-full w-full overflow-y-auto snap-y snap-mandatory"
      >
        <div className="h-[300vh]">
          <KinAnimationSection scrollContainerRef={scrollContainerRef} />
        </div>
      </div>
    </div>
  );
};

export default TestScrollPage;