import ThemeDiv from '@/components/base/ThemeDiv';
import { SmsHistory } from '@/types/model/sms';
import { Theme } from '@/types/ui/theme';
import dayjs from 'dayjs';

interface SmsHistoryTableProps {
    history: SmsHistory[];
    theme: Theme;
}

const SmsHistoryTable = ({ history, theme }: SmsHistoryTableProps) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'delivered':
                return 'text-green-600 bg-green-100';
            case 'sent':
                return 'text-blue-600 bg-blue-100';
            case 'failed':
                return 'text-red-600 bg-red-100';
            case 'pending':
                return 'text-yellow-600 bg-yellow-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'delivered':
                return '전달됨';
            case 'sent':
                return '발송됨';
            case 'failed':
                return '실패';
            case 'pending':
                return '대기중';
            default:
                return status;
        }
    };

    const getMessageTypeText = (type: string) => {
        switch (type) {
            case 'sms':
                return 'SMS';
            case 'lms':
                return 'LMS';
            case 'mms':
                return 'MMS';
            default:
                return type;
        }
    };

    if (history.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-500">아직 발송된 SMS가 없습니다.</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            전화번호
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            메시지
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            유형
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            상태
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            발송일시
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {history.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {item.phoneNumber}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                                <div className="max-w-xs truncate" title={item.message}>
                                    {item.message}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {getMessageTypeText(item.messageType)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                                    {getStatusText(item.status)}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {item.sentAt ? dayjs(item.sentAt).format('YYYY-MM-DD HH:mm') : '-'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SmsHistoryTable;
