'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Modal from '@/components/Modal';
import Button from '@/components/base/Button';
import { useProcessEntrySession } from '@/hooks/api/useEntry';
import { EntrySessionDto } from '@/types/model/entry';
import QRCode from 'qrcode';
import Spinner from '@/components/spinner/Spinner';

interface TicketQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticketNumbers: number[];
  eventName: string;
  eventId: string;
  userId: string;
  reservationId: string;
}

const TicketQRModal = ({
  isOpen,
  onClose,
  ticketNumbers,
  eventName,
  userId,
  eventId,
  reservationId
}: TicketQRModalProps) => {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{
    action: string;
    message: string;
    session: EntrySessionDto;
  } | null>(null);
  const [error, setError] = useState<string>('');
  const [sessionKey, setSessionKey] = useState<string>('');

  const { mutate: processSession, isPending } = useProcessEntrySession();

  // 모달이 닫힐 때 상태 초기화
  useEffect(() => {
    if (!isOpen) {
      setQrCodeDataUrl('');
      setIsProcessing(false);
      setResult(null);
      setError('');
      setSessionKey('');
    }
  }, [isOpen]);

  // QR 코드 생성 핸들러
  const handleGenerateQR = async () => {
    setIsProcessing(true);
    setError('');
    setResult(null);

    try {

      processSession(
        { eventId, userId, reservationId },
        {
          onSuccess: (data) => {
            setResult(data);
            setSessionKey(data.session.id);

            // QR 코드 생성
            generateQRCode(data.session.id);
          },
          onError: (err) => {
            setError('세션 처리에 실패했습니다.');
            setResult(null);
          },
          onSettled: () => {
            setIsProcessing(false);
          }
        }
      );
    } catch (err) {
      setError('QR 코드 생성 중 오류가 발생했습니다');
      setIsProcessing(false);
    }
  };

  // QR 코드 생성
  const generateQRCode = async (sessionId: string) => {
    try {
      // QR 코드 데이터 생성 (entry-check 페이지로 연결)
      const qrData = `${window.location.origin}/admin/entry-check?entry=${sessionId}`;
      const qrDataUrl = await QRCode.toDataURL(qrData, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      setQrCodeDataUrl(qrDataUrl);
    } catch (err) {
      console.error('QR 코드 생성 실패:', err);
      setError('QR 코드 생성에 실패했습니다.');
    }
  };

  if (!isOpen) return null;

  return (
    <Modal onClose={onClose}>
      <div className="text-center space-y-4 flex flex-col items-center">
        <h3 className="text-lg font-bold">입장 QR코드</h3>

        {/* 초기 상태: QR 생성 버튼 */}
        {!qrCodeDataUrl && !isProcessing && !error && !result && (
          <div className="space-y-4">
            <div className="space-y-2 text-sm text-left">
              <p><strong>공연:</strong> {eventName}</p>
              <p><strong>티켓:</strong> {ticketNumbers.length}장</p>
            </div>
            <p className="text-sm text-gray-600">
              입장을 위해 QR 코드를 생성해주세요
            </p>
            <Button
              theme="dark"
              onClick={handleGenerateQR}
              padding='px-6 py-2'
              fontSize='text-sm'
              className="w-full"
            >
              QR 코드 생성하기
            </Button>
          </div>
        )}

        {/* 로딩 상태 */}
        {isProcessing && (
          <div className="space-y-3">
            <div className="mx-auto">
              <Spinner size={32} />
            </div>
            <p className="text-sm text-gray-600">입장 세션을 처리하고 있습니다...</p>
          </div>
        )}

        {/* 에러 상태 */}
        {error && (
          <div className="space-y-3">
            <div className="text-red-500 text-sm">{error}</div>
            <Button
              theme="dark"
              onClick={handleGenerateQR}
              padding='px-4 py-1.5'
              fontSize='text-sm'
              className="mr-2"
            >
              다시 시도
            </Button>
            <Button
              theme="normal"
              onClick={onClose}
              padding='px-4 py-1.5'
              fontSize='text-sm'
            >
              닫기
            </Button>
          </div>
        )}

        {/* 성공 상태 - QR 코드 표시 */}
        {result && qrCodeDataUrl && (
          <div className="space-y-4">
            <div className="space-y-2 text-sm text-left">
              <p><strong>공연:</strong> {eventName}</p>
              <p><strong>티켓:</strong> {ticketNumbers.length}장</p>
              <p><strong>처리 결과:</strong> {result.message}</p>
              <p><strong>세션 ID:</strong> {sessionKey}</p>
            </div>

            {/* QR 코드 */}
            <div className="border-2 border-gray-200 rounded-lg p-4 bg-white">
              <Image
                src={qrCodeDataUrl}
                alt="입장 QR 코드"
                width={200}
                height={200}
                className="mx-auto"
              />
            </div>

            <Button
              theme="dark"
              onClick={onClose}
              padding='px-4 py-1.5'
              fontSize='text-sm'
              className="transition-colors"
            >
              닫기
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default TicketQRModal;