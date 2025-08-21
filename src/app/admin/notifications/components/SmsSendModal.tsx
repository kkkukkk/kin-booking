'use client';

import { useState, useEffect } from 'react';
import Modal from '@/components/Modal';
import Button from '@/components/base/Button';
import Input from '@/components/base/Input';
import Textarea from '@/components/base/Textarea';
import Select from '@/components/base/Select';
import CheckBox from '@/components/base/CheckBox';
import { useSendSms, useSendEventSms } from '@/hooks/api/useSms';
import { SmsTemplate } from '@/types/model/sms';
import { Theme } from '@/types/ui/theme';

interface SmsSendModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  templates: SmsTemplate[];
  theme: Theme;
}

const SmsSendModal = ({ 
  isOpen, 
  onClose, 
  onSuccess, 
  templates, 
  theme 
}: SmsSendModalProps) => {
  const [formData, setFormData] = useState({
    targetType: 'all',
    customPhoneNumbers: '',
    message: '',
    templateId: '',
    scheduledAt: '',
    useTemplate: false
  });

  const [targetType, setTargetType] = useState<'all' | 'event' | 'custom'>('all');
  const [selectedEventId, setSelectedEventId] = useState<string>('');

  // SMS 발송 훅들
  const sendSmsMutation = useSendSms();
  const sendEventSmsMutation = useSendEventSms();

  useEffect(() => {
    // 초기화
    setTargetType('all');
    setSelectedEventId('');
    setFormData(prev => ({ ...prev, targetType: 'all' }));
  }, []);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTemplateSelect = (templateId: string) => {
    if (templateId) {
      const template = templates.find(t => t.id === templateId);
      if (template) {
        setFormData(prev => ({ 
          ...prev, 
          message: template.content,
          templateId 
        }));
      }
    }
  };

  const handleSubmit = async () => {
    if (!formData.message.trim()) {
      alert('메시지 내용을 입력해주세요.');
      return;
    }

    try {
      if (targetType === 'event' && selectedEventId) {
        // 공연별 SMS 발송
        await sendEventSmsMutation.mutateAsync({
          eventId: selectedEventId,
          targetType: formData.targetType as 'all' | 'confirmed' | 'pending' | 'custom',
          customPhoneNumbers: formData.customPhoneNumbers ? 
            formData.customPhoneNumbers.split(',').map(p => p.trim()) : 
            undefined,
          message: formData.message,
          templateId: formData.templateId || undefined,
          scheduledAt: formData.scheduledAt || undefined
        });
      } else {
        // 일반 SMS 발송 (직접 전화번호 입력)
        if (!formData.customPhoneNumbers.trim()) {
          alert('전화번호를 입력해주세요.');
          return;
        }

        const phoneNumbers = formData.customPhoneNumbers
          .split(',')
          .map(p => p.trim())
          .filter(p => p);

        for (const phoneNumber of phoneNumbers) {
          await sendSmsMutation.mutateAsync({
            phoneNumber,
            message: formData.message,
            templateId: formData.templateId || undefined,
            scheduledAt: formData.scheduledAt || undefined
          });
        }
      }

      onSuccess();
    } catch (error) {
      console.error('SMS 발송 실패:', error);
      alert('SMS 발송에 실패했습니다.');
    }
  };

  const isLoading = sendSmsMutation.isPending || sendEventSmsMutation.isPending;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-full min-w-[320px] md:min-w-[675px] max-w-sm md:max-w-4xl space-y-4">
        {/* 제목 */}
        <h2 className="text-xl font-semibold mb-4">
          SMS 발송
        </h2>

        {/* 2단 레이아웃 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 왼쪽: 발송 대상 관련 */}
          <div className="space-y-4">
            {/* 발송 대상 선택 */}
            <div>
              <label className="block text-sm font-medium mb-2">발송 대상</label>
              <Select
                theme={theme}
                value={targetType}
                onChange={(value) => setTargetType(value as 'all' | 'event' | 'custom')}
                options={[
                  { value: 'all', label: '전체 사용자' },
                  { value: 'event', label: '공연별 선택' },
                  { value: 'custom', label: '직접 입력' }
                ]}
              />
            </div>

            {/* 공연별 선택 시 공연 선택 - 고정 높이로 공간 확보 */}
            <div className="h-20 transition-all duration-300">
              {targetType === 'event' ? (
                <div className="space-y-2">
                  <label className="block text-sm font-medium mb-2">공연 선택</label>
                  <Select
                    theme={theme}
                    value={selectedEventId}
                    onChange={(value) => setSelectedEventId(value)}
                    options={[
                      { value: '', label: '공연을 선택하세요' },
                      { value: 'event_1', label: '뮤지컬 햄릿' },
                      { value: 'event_2', label: '콘서트 클래식' }
                    ]}
                  />
                </div>
              ) : (
                <div className="h-16 opacity-0 pointer-events-none">
                  {/* 투명한 공간으로 높이 유지 */}
                </div>
              )}
            </div>

            {/* 공연별 선택 시 세부 대상 선택 - 고정 높이로 공간 확보 */}
            <div className="h-20 transition-all duration-300">
              {targetType === 'event' && selectedEventId ? (
                <div className="space-y-2">
                  <label className="block text-sm font-medium mb-2">세부 대상</label>
                  <Select
                    theme={theme}
                    value={formData.targetType}
                    onChange={(value) => handleInputChange('targetType', value)}
                    options={[
                      { value: 'all', label: '전체 예매자' },
                      { value: 'confirmed', label: '확정된 예매자만' },
                      { value: 'pending', label: '대기중인 예매자만' },
                      { value: 'custom', label: '직접 선택' }
                    ]}
                  />
                </div>
              ) : (
                <div className="h-16 opacity-0 pointer-events-none">
                  {/* 투명한 공간으로 높이 유지 */}
                </div>
              )}
            </div>

            {/* 전화번호 입력 - 고정 높이로 공간 확보 */}
            <div className="h-32 transition-all duration-300">
              {(targetType === 'custom' || (targetType === 'event' && formData.targetType === 'custom')) ? (
                <div className="space-y-2">
                  <label className="block text-sm font-medium mb-2">
                    전화번호 {targetType === 'custom' && <span className="text-red-500">*</span>}
                  </label>
                  <Textarea
                    theme={theme}
                    value={formData.customPhoneNumbers}
                    onChange={(e) => handleInputChange('customPhoneNumbers', e.target.value)}
                    placeholder="전화번호를 입력하세요. 여러 개는 쉼표(,)로 구분"
                    rows={3}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    예: 010-1234-5678, 010-9876-5432
                  </p>
                </div>
              ) : (
                <div className="h-28 opacity-0 pointer-events-none">
                  {/* 투명한 공간으로 높이 유지 */}
                </div>
              )}
            </div>

            {/* 예약 발송 */}
            <div>
              <label className="block text-sm font-medium mb-2">예약 발송 (선택사항)</label>
              <Input
                theme={theme}
                type="datetime-local"
                value={formData.scheduledAt}
                onChange={(e) => handleInputChange('scheduledAt', e.target.value)}
                placeholder="예약 발송 시간을 선택하세요"
              />
              <p className="text-xs text-gray-500 mt-1">
                비워두면 즉시 발송됩니다
              </p>
            </div>
          </div>

          {/* 오른쪽: 메시지 관련 */}
          <div className="space-y-4">
            {/* 템플릿 사용 여부 */}
            {templates.length > 0 && (
              <div>
                <div className="flex items-center space-x-2">
                  <CheckBox
                    checked={formData.useTemplate}
                    onChange={(checked) => {
                      handleInputChange('useTemplate', checked);
                      if (!checked) {
                        handleInputChange('templateId', '');
                        handleInputChange('message', '');
                      }
                    }}
                  />
                  <span className="text-sm font-medium">템플릿 사용</span>
                </div>
              </div>
            )}

            {/* 템플릿 선택 */}
            {formData.useTemplate && templates.length > 0 && (
              <div>
                <label className="block text-sm font-medium mb-2">템플릿 선택</label>
                <Select
                  theme={theme}
                  value={formData.templateId}
                  onChange={(value) => handleTemplateSelect(value)}
                  options={[
                    { value: '', label: '템플릿을 선택하세요' },
                    ...templates.map(template => ({
                      value: template.id,
                      label: `${template.name} - ${template.description || ''}`
                    }))
                  ]}
                />
              </div>
            )}

            {/* 메시지 내용 */}
            <div>
              <label className="block text-sm font-medium mb-2">
                메시지 내용 <span className="text-red-500">*</span>
              </label>
              <Textarea
                theme={theme}
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                placeholder="발송할 메시지를 입력하세요"
                rows={8}
              />
              <p className="text-xs text-gray-500 mt-1">
                현재 {formData.message.length}자 / SMS 기준 90자, LMS 기준 2000자
              </p>
            </div>
          </div>
        </div>

        {/* 액션 버튼들 */}
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
          <Button
            theme={theme}
            onClick={onClose}
            disabled={isLoading}
          >
            취소
          </Button>
          <Button
            theme={theme}
            onClick={handleSubmit}
            disabled={isLoading || !formData.message.trim()}
          >
            {isLoading ? '발송 중...' : 'SMS 발송'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default SmsSendModal;
