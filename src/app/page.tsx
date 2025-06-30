'use client';

import Card from "@/components/Card";
import { useSession } from "@/hooks/useSession";
import AnimatedText from "@/components/base/AnimatedText";
import Button from "@/components/base/Button";
import {useRouter} from "next/navigation";

const Home = ()=> {
    const { session } = useSession();
    const router = useRouter();

    return (
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
                    </>

                }
            </div>
        </Card>
    );
}

export default Home;