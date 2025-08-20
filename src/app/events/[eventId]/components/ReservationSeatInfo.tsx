import clsx from 'clsx';

interface ReservationSeatInfoProps {
  seatCapacity: number;
  reservedQuantity: number;
  remainingQuantity: number;
  theme: string;
}

const ReservationSeatInfo = ({
  seatCapacity,
  reservedQuantity,
  remainingQuantity,
  theme
}: ReservationSeatInfoProps) => {
  const isSoldOut = remainingQuantity === 0;
  return (
    <div>
      <p className="text-sm opacity-70 mb-2">좌석 현황</p>
      <div className={clsx(
        "p-3 rounded-lg border",
        theme === "normal"
          ? "bg-gray-50 border-gray-200"
          : "bg-gray-800 border-gray-700"
      )}>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm">총 좌석</span>
          <span className="font-semibold">{seatCapacity}석</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm">예약된 좌석</span>
          <span className="font-semibold">{reservedQuantity}석</span>
        </div>
        <div className={clsx("border-t pt-2", theme === "normal" ? "border-gray-200" : "border-gray-700")}>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">잔여 좌석</span>
            {!isSoldOut ? (
              <span className={clsx(
                "font-bold text-lg",
                theme === "normal" ? "text-green-600" : "text-green-400"
              )}>
                {remainingQuantity}석
              </span>
            ) : (
              <span className={clsx(
                "font-bold text-lg",
                theme === "normal" ? "text-red-600" : "text-red-400"
              )}>
                매진
              </span>
            )}
          </div>
        </div>
        {!isSoldOut && (
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={clsx(
                  "h-2 rounded-full transition-all duration-300",
                  theme === "normal"
                    ? "bg-green-500"
                    : theme === "dark"
                    ? "bg-green-400"
                    : "bg-gradient-to-r from-[#10b9ab] via-[#22c581] via-[#3dafec] via-[#70ffb8] to-[#50ea7c] animate-pulse"
                )}
                style={{
                  width: `${(reservedQuantity / seatCapacity) * 100}%`
                }}
              ></div>
            </div>
            <p className="text-xs text-center mt-1 opacity-70">
              예매율 {Math.round((reservedQuantity / seatCapacity) * 100)}%
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReservationSeatInfo; 