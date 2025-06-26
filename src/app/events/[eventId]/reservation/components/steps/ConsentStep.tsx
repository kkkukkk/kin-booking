'use client'
import { JSX, useState } from "react";
import Seat from "@/app/events/[eventId]/reservation/components/steps/terms/Seat";
import Cancel from "@/app/events/[eventId]/reservation/components/steps/terms/Cancel";
import { DEFAULT_REFUND_POLICY } from "@/types/refund";
import { AnimatePresence, motion } from "framer-motion";
import { consent, textContainer, textContainerItem } from "@/types/ui/motionVariants";
import ConsentItem from "@/components/consent/ConsentItem";
import Modal from "@/components/Modal";

interface ConsentStepProps {
	key: string;
	seatChecked: boolean;
	onChangeSeat: (checked: boolean) => void;
	cancelChecked: boolean;
	onChangeCancel: (checked: boolean) => void;
}

type DetailType = 'seat' | 'cancel';

const messages = [
	"안녕하세요! 저희 공연을 찾아주셔서 감사드립니다.",
	"예매를 진행하시기 전에 꼭 확인하실 사항들이 있어요.",
	"불이익이 없도록 아래 안내사항을 꼼꼼히 확인해주세요!"
];

const ConsentStep = ({
	seatChecked,
	onChangeSeat,
	cancelChecked,
	onChangeCancel,
}: ConsentStepProps)  => {
	const [showDetail, setShowDetail] = useState<DetailType | null>(null);

	const handleClose = () => setShowDetail(null);

	const handleCancel = (detail: DetailType) => {
		if (detail === 'seat') onChangeSeat(false);
		if (detail === 'cancel') onChangeCancel(false);
		handleClose();
	}

	const handleConfirm = (detail: DetailType) => {
		if (detail === 'seat') onChangeSeat(true);
		if (detail === 'cancel') onChangeCancel(true);
		handleClose();
	};

	const getDetailComponent = (detail: DetailType): JSX.Element | null => {
		const props = {
			onClose: () => handleCancel(detail),
			onConfirm: () => handleConfirm(detail),
		};

		switch (detail) {
			case 'seat':
				return <Seat {...props} />;
			case 'cancel':
				return <Cancel policy={DEFAULT_REFUND_POLICY} {...props} />;
			default:
				return null;
		}
	};


	return (
		<div className={"relative overflow-hidden"}>
			<motion.div
				variants={textContainer}
				initial="hidden"
				animate="visible"
				className="flex flex-col space-y-3 text-sm md:text-base"
			>
				{messages.map((msg, idx) => (
					<motion.p 
						key={idx} 
						variants={textContainerItem}
						className="whitespace-pre-line break-words"
					>
						{msg}
					</motion.p>
				))}
			</motion.div>

			<motion.div
				variants={consent}
				initial="initial"
				animate="animate"
				className="flex flex-col gap-4 my-8 md:my-10"
			>
				<ConsentItem
					checked={seatChecked}
					label="예매 전 주의사항 안내"
					onClickDetail={() => setShowDetail("seat")}
					required
				/>
				<ConsentItem
					checked={cancelChecked}
					label="예매 취소 / 환불 규정 안내"
					onClickDetail={() => setShowDetail("cancel")}
					required
				/>
			</motion.div>
			<AnimatePresence mode="wait">
				{showDetail && (
					<Modal onClose={handleClose}>
						{getDetailComponent(showDetail)}
					</Modal>
				)}
			</AnimatePresence>
		</div>
	);
}

export default ConsentStep;