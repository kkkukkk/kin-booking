import ThemeDiv from '@/components/base/ThemeDiv';
import { SmsStats } from '@/types/model/sms';
import { Theme } from '@/types/ui/theme';

interface SmsStatsCardsProps {
  stats: SmsStats;
  theme: Theme;
}

const SmsStatsCards = ({ stats, theme }: SmsStatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 총 발송 건수 */}
      <ThemeDiv className="p-4 rounded-lg" isChildren>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">총 발송</p>
            <p className="text-2xl font-bold">{stats.totalSent.toLocaleString()}</p>
          </div>
          <div className="p-2 bg-blue-100 rounded-full">
            <span className="text-blue-600 text-xl">SMS</span>
          </div>
        </div>
      </ThemeDiv>

      {/* 전달률 */}
      <ThemeDiv className="p-4 rounded-lg" isChildren>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">전달률</p>
            <p className="text-2xl font-bold">{stats.deliveryRate}%</p>
          </div>
          <div className="p-2 bg-green-100 rounded-full">
            <span className="text-green-600 text-xl">OK</span>
          </div>
        </div>
      </ThemeDiv>

      {/* 오늘 발송 */}
      <ThemeDiv className="p-4 rounded-lg" isChildren>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">오늘 발송</p>
            <p className="text-2xl font-bold">{stats.todaySent.toLocaleString()}</p>
          </div>
          <div className="p-2 bg-yellow-100 rounded-full">
            <span className="text-yellow-600 text-xl">TODAY</span>
          </div>
        </div>
      </ThemeDiv>

      {/* 이번 달 발송 */}
      <ThemeDiv className="p-4 rounded-lg" isChildren>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">이번 달</p>
            <p className="text-2xl font-bold">{stats.thisMonthSent.toLocaleString()}</p>
          </div>
          <div className="p-2 bg-purple-100 rounded-full">
            <span className="text-purple-600 text-xl">STATS</span>
          </div>
        </div>
      </ThemeDiv>
    </div>
  );
};

export default SmsStatsCards;
