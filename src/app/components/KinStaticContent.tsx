"use client";

const KinStaticContent = () => {
  return (
    <div className="flex items-center justify-center w-full">
      {/* K - 회전된 최종 상태: 가운데에서 -20px, 90도 회전 */}
      <div className="absolute text-center" style={{ left: 'calc(50% - 120px)' }}>
        <h3 className="text-8xl md:text-10xl font-bold tracking-wide text-white mb-6 transform rotate-90">K</h3>
      </div>

      {/* I - 회전된 최종 상태: 중앙, 90도 회전 */}
      <div className="absolute text-center">
        <h3 className="text-8xl md:text-10xl font-bold tracking-wide text-white mb-6 transform rotate-90">I</h3>
      </div>

      {/* N - 회전된 최종 상태: 가운데에서 +20px, 90도 회전 */}
      <div className="absolute text-center" style={{ left: 'calc(50% + 120px)' }}>
        <h3 className="text-8xl md:text-10xl font-bold tracking-wide text-white mb-6 transform rotate-90">N</h3>
      </div>
    </div>
  );
};

export default KinStaticContent; 