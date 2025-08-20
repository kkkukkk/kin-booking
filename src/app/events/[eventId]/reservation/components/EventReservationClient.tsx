'use client'

import { useParams, useRouter } from "next/navigation";
import { useEventById } from "@/hooks/api/useEvents";
import { useSpinner } from "@/hooks/useSpinner";
import { useEffect, useState, useRef } from "react";
import { useCreateReservation } from "@/hooks/api/useReservations";
import { useSession } from "@/hooks/useSession";
import useToast from "@/hooks/useToast";
import { useAlert } from "@/providers/AlertProvider";
import ConsentStep from "@/app/events/[eventId]/reservation/components/steps/ConsentStep";
import ConfirmStep from "@/app/events/[eventId]/reservation/components/steps/ConfirmStep";
import PaymentStep from "@/app/events/[eventId]/reservation/components/steps/PaymentStep";
import { AnimatePresence, motion } from "framer-motion";
import { bottomUpDelay, bottomUp } from "@/types/ui/motionVariants";
import clsx from "clsx";
import Button from "@/components/base/Button";
import ProgressBar from "@/components/base/ProgressBar";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { ReservationStep } from "@/types/ui/reservationStep";
import { fetchEventById } from "@/api/events";
import { useActivePaymentAccounts } from "@/hooks/api/usePaymentAccounts";

const EventReservationClient = () => {
	const theme = useAppSelector((state: RootState) => state.theme.current);
	const { showToast } = useToast();
	const { showAlert } = useAlert();
	const { session } = useSession();
	const { mutate: createReservation, isPending } = useCreateReservation();
	const { showSpinner, hideSpinner } = useSpinner();
	const eventId = useParams().eventId as string;
	const router = useRouter();
	const { data, isLoading, error } = useEventById(eventId);

	const steps: ReservationStep[] = ['consent', 'confirm', 'payment'];
	const [step, setStep] = useState<ReservationStep>('consent');
	const [quantity, setQuantity] = useState(1);
	const [ticketHolder, setTicketHolder] = useState('');
	const [didSetDefault, setDidSetDefault] = useState(false);
	const [seatChecked, setSeatChecked] = useState(false);
	const [cancelChecked, setCancelChecked] = useState(false);
	const [isReservationCompleted, setIsReservationCompleted] = useState(false);
	const prevLoadingOrPending = useRef(false);

	// 입금 계좌 정보 조회
	const { data: paymentAccounts = [] } = useActivePaymentAccounts();

	// 예매 완료 상태 복원
	useEffect(() => {
		const savedState = localStorage.getItem(`reservation_${eventId}`);
		if (savedState) {
			try {
				const parsed = JSON.parse(savedState);
				if (parsed.isCompleted && parsed.step === 'payment') {
					setStep('payment');
					setQuantity(parsed.quantity);
					setTicketHolder(parsed.ticketHolder);
					setIsReservationCompleted(true);
				}
			} catch (error) {
				console.error('저장된 예매 상태 복원 실패:', error);
			}
		}
	}, [eventId]);

	useEffect(() => {
		if (
			!didSetDefault &&
			session?.user?.user_metadata?.display_name &&
			ticketHolder === ''
		) {
			setTicketHolder(session.user.user_metadata.display_name);
			setDidSetDefault(true);
		}
	}, [session, ticketHolder, didSetDefault]);

	useEffect(() => {
		const loadingOrPending = isLoading || isPending;
		if (!prevLoadingOrPending.current && loadingOrPending) {
			showSpinner();
		}
		if (prevLoadingOrPending.current && !loadingOrPending) {
			hideSpinner();
		}
		prevLoadingOrPending.current = loadingOrPending;
	}, [isLoading, isPending, showSpinner, hideSpinner]);

	if (error) throw error;
	if (!data) return null;

	const event = data!;

	const handleReservation = async () => {
		if (!session?.user) {
			showToast({ message: '로그인 후 예매가 가능해요!', iconType: 'warning', autoCloseTime: 3000 });
			router.push('/login');
			return;
		}

		// 예매 시점에 좌석 가용성 재확인
		try {
			// 현재 이벤트 정보를 다시 조회하여 최신 좌석 상태 확인
			const currentEventData = await fetchEventById(eventId);
			
			if (!currentEventData) {
				showToast({ message: '이벤트 정보를 찾을 수 없어요.', iconType: 'error', autoCloseTime: 3000 });
				return;
			}

			// 매진 상태 확인
			if (currentEventData.isSoldOut) {
				showToast({ message: '죄송해요. 이미 매진되었어요.', iconType: 'error', autoCloseTime: 3000 });
				router.push(`/events/${eventId}`);
				return;
			}

			// 요청 수량이 잔여 좌석보다 많은지 확인
			if (quantity > currentEventData.remainingQuantity) {
				showToast({ 
					message: `잔여 좌석이 부족해요. (잔여: ${currentEventData.remainingQuantity}석, 요청: ${quantity}석)`, 
					iconType: 'error', 
					autoCloseTime: 3000 
				});
				// 이벤트 정보를 최신으로 업데이트
				router.refresh();
				return;
			}

			// 예매 진행
			createReservation({
				userId: session.user.id,
				eventId: currentEventData.eventId,
				quantity: quantity,
				ticketHolder: ticketHolder,
			}, {
				onSuccess: async () => {
					// 예매 완료 상태 저장
					const reservationState = {
						isCompleted: true,
						step: 'payment',
						quantity,
						ticketHolder,
						timestamp: Date.now()
					};
					localStorage.setItem(`reservation_${eventId}`, JSON.stringify(reservationState));
					setIsReservationCompleted(true);
					
					// 예매 성공 후 payment 단계로 이동
					setStep('payment');
				},
				onError: (err) => {
					showToast({ message: err.message || '예매에 실패했어요.', iconType: 'error', autoCloseTime: 3000 });
				}
			});
		} catch (error) {
			console.error('좌석 가용성 확인 중 오류:', error);
			showToast({ message: '좌석 상태 확인 중 오류가 발생했어요. 다시 시도해주세요.', iconType: 'error', autoCloseTime: 3000 });
		}
	};

	const renderStep = () => {
		switch (step) {
			case 'consent':
				return (
					<ConsentStep
						key="consent"
						seatChecked={seatChecked}
						onChangeSeat={setSeatChecked}
						cancelChecked={cancelChecked}
						onChangeCancel={setCancelChecked}
					/>
				);
			case 'confirm':
				return (
					<ConfirmStep
						key="confirm"
						event={event}
						quantity={quantity}
						onQuantityChange={setQuantity}
						ticketHolder={ticketHolder}
						onTicketHolderChange={setTicketHolder}
					/>
				);
			case 'payment':
				return (
					<PaymentStep
						key="payment"
						event={event}
						quantity={quantity}
						ticketHolder={ticketHolder}
						paymentAccounts={paymentAccounts}
						onGoToMyPage={() => router.push('/my?tab=reservations')}
						eventId={eventId}
					/>
				);
		}
	};

	const onNext = async () => {
		// 예매가 이미 완료된 경우 더 이상 진행 불가
		if (isReservationCompleted) {
			return;
		}

		if (step === 'consent') {
			if (!seatChecked || !cancelChecked) {
				showToast({ message: '안내사항을 모두 확인해주세요.', iconType: 'warning', autoCloseTime: 3000 });
				return;
			}
			setStep('confirm');
		} else if (step === 'confirm') {
			// 수량 검증
			if (quantity > event.remainingQuantity) {
				showToast({ 
					message: `잔여 좌석이 부족해요. (잔여: ${event.remainingQuantity}석, 요청: ${quantity}석)`, 
					iconType: 'warning', 
					autoCloseTime: 3000 
				});
				return;
			}
			
			const confirmed = await showAlert({
				type: 'confirm',
				title: '공연 예매',
				message: `${quantity}매 예매하시겠습니까?`,
			});
			if (confirmed) {
				handleReservation();
			}
		}
	}
	const onBack = () => {
		if (step === 'confirm') {
			setStep('consent');
		} else if (step === 'consent') {
			router.push(`/events/${eventId}`);
		}
	}

	return (
		<div>
			<div className="flex justify-start mb-4">
				{step !== 'payment' && !isReservationCompleted && (
					<Button
						theme={"dark"}
						padding={"px-3 py-1.5"}
						onClick={onBack}
						reverse={theme === "normal"}
						light={theme !== "normal"}
						className="font-semibold"
					>
						{step === "confirm" ? "이전" : "뒤로가기"}
					</Button>
				)}
			</div>

			<ProgressBar
				steps={steps}
				currentStep={steps.indexOf(step)}
				theme={theme}
			/>

			<AnimatePresence mode="wait">
				<motion.div
					key={`${step}Motion`}
					variants={{
						initial: { opacity: 1 },
						animate: { opacity: 1 },
						exit: { opacity: 0, transition: { duration: 0.1 } }
					}}
					initial="initial"
					animate="animate"
					exit="exit"
					className={"mt-1"}
				>
					{renderStep()}
				</motion.div>
			</AnimatePresence>

			<motion.div
				key={`${step}Button`}
				variants={step === "consent" ? bottomUpDelay : bottomUp}
				initial="initial"
				animate="animate"
				className={clsx(
					"flex justify-end",
					step === "confirm" ? "mt-4 md:mt-6" : "mt-8 md:mt-10"
				)}
			>
				{/* payment 단계에서는 다음 버튼을 표시하지 않음 */}
				{step !== 'payment' && (
					<Button
						theme={"dark"}
						width={"w-full"}
						fontSize={"text-md md:text-xl"}
						padding={"px-2 py-1.5"}
						onClick={onNext}
						reverse={theme === "normal"}
						className="font-semibold"
					>
						{step === "confirm" ? "예매하기" : "다음"}
					</Button>
				)}
			</motion.div>
		</div>
	);
};

export default EventReservationClient;