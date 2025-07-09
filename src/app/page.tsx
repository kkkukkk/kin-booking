'use client';

import { useEffect } from "react";
import Card from "@/components/Card";
import { useSession } from "@/hooks/useSession";
import AnimatedText from "@/components/base/AnimatedText";
import Button from "@/components/base/Button";
import {useRouter} from "next/navigation";
import { useTutorial } from "@/hooks/useTutorial";
import TutorialOverlay from "@/components/tutorial/TutorialOverlay";
import { mainPageTutorialSteps } from "@/data/tutorialSteps";

const Home = ()=> {
    const { session } = useSession();
    const router = useRouter();
    
    const { 
        isTutorialOpen, 
        hasSeenTutorial, 
        openTutorial, 
        completeTutorial, 
        dontShowAgain 
    } = useTutorial('main-page-tutorial-seen');

    // 첫 방문 시 튜토리얼 자동 열기
    useEffect(() => {
        if (!hasSeenTutorial) {
            const timer = setTimeout(() => {
                openTutorial();
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [hasSeenTutorial, openTutorial]);

    return (
        <>
            <Card>
                <div className={'text-lg'}>
                    {
                        session?.user?.user_metadata?.display_name && <AnimatedText text={`안녕하세요, ${session.user.user_metadata.display_name} 님!`} fontSize={"text-base md:text-xl"} />
                    }
                    {
                        <>
                            <br/>
                            <AnimatedText text={"서비스 준비 중 입니다."} delay={0.8} fontSize={"text-base md:text-xl"} />
                            <br/>
                            <AnimatedText text={"나중에 만나요!"} delay={1.6} fontSize={"text-base md:text-xl"} />
                            <br/>
                            <Button
                                onClick={() => router.push('/events')}
                                theme={"dark"}
                                padding={'px-2 py-1'}
                            >{"공연 목록"}</Button>
                            <Button
                                onClick={() => router.push('/my')}
                                theme={"dark"}
                                padding={'px-2 py-1'}
                            >{"마이페이지"}</Button>
                        </>
                    }
                </div>
            </Card>
            
            {/* 튜토리얼 오버레이 */}
            <TutorialOverlay
                steps={mainPageTutorialSteps}
                isOpen={isTutorialOpen}
                onComplete={completeTutorial}
            />
        </>
    );
}

export default Home;