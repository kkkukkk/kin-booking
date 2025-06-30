'use client'

import { JSX, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { consent, textContainer, textContainerItem } from "@/types/ui/motionVariants";
import Modal from "@/components/Modal";
import PersonalInfo from "@/app/register/components/terms/PersonalInfo";
import TermsOfService from "@/app/register/components/terms/TermsOfService";
import Marketing from "@/app/register/components/terms/Marketing";
import ConsentItem from "@/components/consent/ConsentItem"

interface ConsentProps {
	key: string;
	personalChecked: boolean;
	onChangePersonal: (checked: boolean) => void;
	termsChecked: boolean;
	onChangeTerms: (checked: boolean) => void;
	marketingChecked: boolean;
	onChangeMarketing: (checked: boolean) => void;
}

type DetailType = 'personal' | 'terms' | 'marketing';

const messages = [
	"안녕하세요!",
	"저희는 공연팀 KIN 입니다.",
	"함께하시기 전 확인할 내용이 있어요! ✅",
];

const Consent = ({
	personalChecked,
	onChangePersonal,
	termsChecked,
	onChangeTerms,
	marketingChecked,
	onChangeMarketing
}: ConsentProps) => {
	const [showDetail, setShowDetail] = useState<DetailType | null>(null);

	const handleClose = () => setShowDetail(null);

	const handleCancel = (detail: DetailType) => {
		if (detail === 'personal') onChangePersonal(false);
		if (detail === 'terms') onChangeTerms(false);
		if (detail === 'marketing') onChangeMarketing(false);
		handleClose();
	}

	const handleConfirm = (detail: DetailType) => {
		if (detail === 'personal') onChangePersonal(true);
		if (detail === 'terms') onChangeTerms(true);
		if (detail === 'marketing') onChangeMarketing(true);
		handleClose();
	};

	const getDetailComponent = (detail: DetailType): JSX.Element => {
		const props = {
			onClose: () => handleCancel(detail),
			onConfirm: () => handleConfirm(detail),
		};

		switch (detail) {
			case 'personal':
				return <PersonalInfo {...props} />;
			case 'terms':
				return <TermsOfService {...props} />;
			case 'marketing':
				return <Marketing {...props} />;
		}
	};

	return (
		<div className={"relative overflow-hidden"}>
			<motion.div
				variants={textContainer}
				initial="hidden"
				animate="visible"
				className="flex flex-col space-y-2 text-base md:text-xl"
			>
				{messages.map((msg, idx) => (
					<motion.p key={idx} variants={textContainerItem}>
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
					checked={personalChecked}
					label="개인정보 수집 및 이용 동의"
					onClickDetail={() => setShowDetail("personal")}
					required
				/>
				<ConsentItem
					checked={termsChecked}
					label="서비스 이용 약관 동의"
					onClickDetail={() => setShowDetail("terms")}
					required
				/>
				<ConsentItem
					checked={marketingChecked}
					label="공연 관련 소식 수신 동의 (선택)"
					onClickDetail={() => setShowDetail("marketing")}
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
};

export default Consent;