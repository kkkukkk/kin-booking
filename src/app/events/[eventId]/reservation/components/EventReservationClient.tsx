'use client'

import { useParams, useRouter } from "next/navigation";
import { useEventById } from "@/hooks/api/useEvents";
import { useSpinner } from "@/providers/SpinnerProvider";
import React, { useEffect, useState } from "react";
import { useCreateReservation } from "@/hooks/api/useReservations";
import { useSession } from "@/hooks/useSession";
import useToast from "@/hooks/useToast";
import { useAlert } from "@/providers/AlertProvider";
import ConsentStep from "@/app/events/[eventId]/reservation/components/steps/ConsentStep";
import ConfirmStep from "@/app/events/[eventId]/reservation/components/steps/ConfirmStep";
import { AnimatePresence, motion } from "framer-motion";
import { bottomUp } from "@/types/ui/motionVariants";
import clsx from "clsx";
import Button from "@/components/base/Button";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";


const EventReservationClient = () => {
	const theme = useAppSelector((state: RootState) => state.theme.current);
	const { showToast } = useToast();
	const { showAlert } = useAlert();
	const { session } = useSession();
	const { mutate: createReservation, isPending } = useCreateReservation();
	const { showSpinner, hideSpinner } = useSpinner();
	const steps: ConfirmStep[] = ['consent', 'reservation'];
	const [step, setStep] = useState<'consent' | 'reservation'>('consent');
	const [quantity, setQuantity] = useState(1);

	const [seatChecked, setSeatChecked] = useState(false);
	const [cancelChecked, setCancelChecked] = useState(false);

	const eventId = useParams().eventId as string;
	const router = useRouter();
	const { data, isLoading, error } = useEventById(eventId);

	if (error) throw error;
	if (!data) return null;

	const event = data!;

	const handleClick = async () => {
		if (!session?.user) {
			showToast({ message: '로그인 후 예매가 가능해요!', iconType: 'warning' });
			router.push('/login');
			return;
		}

		const confirmed = await showAlert({
			type: 'confirm',
			title: "공연 예매",
			message: quantity + '매 예매하시겠습니까?',
		});
		if (confirmed) {
			await handleReservation();
		}
	}

	const handleReservation = () => {
		createReservation({
			userId: session.user.id,
			eventId: event.eventId,
			quantity: quantity,
			status: 'pending',
			ticketHolder: session.user.user_metadata.display_name,
		}, {
			onSuccess: () => {
				showToast({ message: '예매가 완료됐어요!', iconType: 'success' });
				router.push('/my/reservations');
			},
			onError: (err) => {
				showToast({ message: err.message || '예매에 실패했어요.', iconType: 'error' });
			}
		});
	};

	const renderStep = () => {
		switch(step) {
			case 'consent':
				return <ConsentStep />;
			case 'confirm':
				return <ConfirmStep />;
		}
	};

	const onNext = () => {
		if (step === 'consent') {
			setStep('confirm');
		}
	}
	const onBack = () => {
		if (step === 'confirm') {
			setStep('consent');
		}
	}

	useEffect(() => {
		if (isLoading || isPending) showSpinner();
		else hideSpinner();
	}, [isLoading, isPending, showSpinner, hideSpinner]);

	return (
		<div>
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
				variants={bottomUp}
				initial="initial"
				animate="animate"
				className={clsx(
					"flex justify-end",
					step === "email" ? "mt-4 md:mt-6" : "mt-8 md:mt-10"
				)}
			>
				<Button
					theme={"dark"}
					width={"w-full"}
					fontSize={"text-md md:text-xl"}
					padding={"px-2 py-1.5"}
					onClick={onBack}
					reverse={theme === "normal"}
					light={theme !== "normal"}
				>
					{step === "select" ? "이전" : "취소"}
				</Button>
				<Button
					theme={"dark"}
					width={"w-full"}
					fontSize={"text-md md:text-xl"}
					padding={"px-2 py-1.5"}
					onClick={onNext}
					reverse={theme === "normal"}
					light={theme !== "normal"}
				>
					{step === "select" ? "예매하기" : "다음"}
				</Button>
			</motion.div>
		</div>
	);
};

export default EventReservationClient;