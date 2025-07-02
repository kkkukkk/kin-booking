'use client'

import { useParams, useRouter } from "next/navigation";
import { useEventById } from "@/hooks/api/useEvents";
import { useSpinner } from "@/hooks/useSpinner";
import React, { useEffect, useState, useRef } from "react";
import { useCreateReservation } from "@/hooks/api/useReservations";
import { useSession } from "@/hooks/useSession";
import useToast from "@/hooks/useToast";
import { useAlert } from "@/providers/AlertProvider";
import ConsentStep from "@/app/events/[eventId]/reservation/components/steps/ConsentStep";
import ConfirmStep from "@/app/events/[eventId]/reservation/components/steps/ConfirmStep";
import { AnimatePresence, motion } from "framer-motion";
import { bottomUpDelay, bottomUp } from "@/types/ui/motionVariants";
import clsx from "clsx";
import Button from "@/components/base/Button";
import ProgressBar from "@/components/base/ProgressBar";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { ReservationStep } from "@/types/ui/reservationStep";
import { ArrowLeftIcon } from "@/components/icon/ArrowIcons";


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
	
	const steps: ReservationStep[] = ['consent', 'confirm'];
	const [step, setStep] = useState<ReservationStep>('consent');
	const [quantity, setQuantity] = useState(1);
	const [ticketHolder, setTicketHolder] = useState('');
	const [seatChecked, setSeatChecked] = useState(false);
	const [cancelChecked, setCancelChecked] = useState(false);
	const prevLoadingOrPending = useRef(false);

	// 세션이 로드되면 ticketHolder 기본값 설정
	useEffect(() => {
		if (session?.user?.user_metadata?.display_name && ticketHolder === '') {
			setTicketHolder(session.user.user_metadata.display_name);
		}
	}, [session, ticketHolder]);

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

	const handleClick = async () => {
		if (!session?.user) {
			showToast({ message: '로그인 후 예매가 가능해요!', iconType: 'warning', autoCloseTime: 3000 });
			router.push('/login');
			return;
		}

		const confirmed = await showAlert({
			type: 'confirm',
			title: "공연 예매",
			message: quantity + '매 예매하시겠습니까?',
		});
		if (confirmed) {
			handleReservation();
		}
	}

	const handleReservation = () => {
		if (!session?.user) return;
		
		createReservation({
			userId: session.user.id,
			eventId: event.eventId,
			quantity: quantity,
			ticketHolder: ticketHolder,
		}, {
			onSuccess: () => {
				showToast({ message: '예매가 완료됐어요!', iconType: 'success', autoCloseTime: 3000 });
				router.push('/my');
			},
			onError: (err) => {
				showToast({ message: err.message || '예매에 실패했어요.', iconType: 'error', autoCloseTime: 3000 });
			}
		});
	};

	const renderStep = () => {
		switch(step) {
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
		}
	};

	const onNext = () => {
		if (step === 'consent') {
			if (!seatChecked || !cancelChecked) {
				showToast({ message: '안내사항을 모두 확인해주세요.', iconType: 'warning', autoCloseTime: 3000 });
				return;
			}
			setStep('confirm');
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
				<Button
					theme={"dark"}
					padding={"px-3 py-1.5"}
					onClick={onBack}
					reverse={theme === "normal"}
					light={theme !== "normal"}
				>
					<span className="mr-1">
						<ArrowLeftIcon />
					</span>
					{step === "confirm" ? "이전" : "뒤로가기"}
				</Button>
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
						initial: {opacity: 1},
						animate: {opacity: 1},
						exit   : {opacity: 0, transition: {duration: 0.1}}
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
				<Button
					theme={"dark"}
					width={"w-full"}
					fontSize={"text-md md:text-xl"}
					padding={"px-2 py-1.5"}
					onClick={onNext}
					reverse={theme === "normal"}
					light={theme !== "normal"}
				>
					{step === "confirm" ? "예매하기" : "다음"}
				</Button>
			</motion.div>
		</div>
	);
};

export default EventReservationClient;