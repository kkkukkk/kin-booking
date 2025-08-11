'use client'

import React, { useEffect, useState, useCallback } from 'react';
import Modal from '@/components/Modal';
import QRCode from 'qrcode';
import Button from '@/components/base/Button';
import Image from 'next/image';
import { useCreateEntrySession } from '@/hooks/api/useEntry';

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
  eventId, 
  userId, 
  reservationId 
}: TicketQRModalProps) => {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [entryId, setEntryId] = useState<string>('');

  const { mutate: createEntrySession, isPending } = useCreateEntrySession();

  // 입장 세션 생성 함수
  const generateEntrySession = useCallback(async () => {
    if (!isOpen || ticketNumbers.length === 0) return;

    setIsGenerating(true);
    
    try {
      // 입장 세션 생성
      createEntrySession({
        eventId,
        userId,
        reservationId
      }, {
        onSuccess: (data) => {
          setEntryId(data.id);
          generateQRCode(data.id);
        },
        onError: () => {
          setIsGenerating(false);
        }
      });
    } catch (error) {
      console.error('입장 세션 생성 실패:', error);
      setIsGenerating(false);
    }
  }, [isOpen, ticketNumbers, eventId, userId, reservationId, createEntrySession]);

  // QR 코드 생성 함수 (UUID 기반)
  const generateQRCode = useCallback(async (sessionId: string) => {
    try {
      const baseUrl = typeof window !== 'undefined' 
        ? window.location.origin
        : 'https://kin-booking.vercel.app';
      
      // UUID 기반으로 변경
      const qrData = `${baseUrl}/admin/entry-check?entry=${sessionId}`;
      
      const dataUrl = await QRCode.toDataURL(qrData, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      setQrCodeDataUrl(dataUrl);
      setIsGenerating(false);
    } catch (error) {
      console.error('QR코드 생성 실패:', error);
      setIsGenerating(false);
    }
  }, []);

  // useEffect 수정
  useEffect(() => {
    if (isOpen && ticketNumbers.length > 0) {
      generateEntrySession();
    }
  }, [isOpen, generateEntrySession]);

  // 모달 닫힐 때 상태 초기화
  useEffect(() => {
    if (!isOpen) {
      setQrCodeDataUrl('');
      setEntryId('');
      setIsGenerating(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <Modal onClose={onClose}>
      <div className="text-center space-y-4 flex flex-col items-center">
        <h3 className="text-lg font-bold">입장 QR코드</h3>
        
        {isGenerating ? (
          <div className="flex flex-col items-center space-y-3">
            <p className="text-sm text-gray-600">입장 세션을 생성하는 중...</p>
          </div>
        ) : qrCodeDataUrl ? (
          <>
            <div className="flex justify-center">
              <Image 
                src={qrCodeDataUrl} 
                alt="입장 QR코드" 
                width={200}
                height={200}
                className="border-2 border-gray-200 rounded-lg"
              />
            </div>
            
            <div className="space-y-3 text-sm">
              <div className="w-full">
                <p className="text-left">공연: {eventName}</p>
                <p className="mt-1 text-left">티켓: {ticketNumbers.length}장</p>
                <p className="mt-1 text-xs text-gray-400">
                  입장 시 스태프에게 QR코드를 보여주세요!
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  세션 ID: {entryId.slice(0, 8)}...
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center text-gray-500">
            <p>QR 코드를 생성할 수 없습니다.</p>
          </div>
        )}
        
        <Button
          theme="dark"
          onClick={onClose}
          padding='px-4 py-1.5'
          fontSize='text-sm'
          className="transition-colors"
          disabled={isGenerating}
        >
          닫기
        </Button>
      </div>
    </Modal>
  );
};

export default TicketQRModal;