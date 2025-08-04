'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useTeamMembers } from '@/hooks/api/useTeamMembers';
import { TeamMemberViewDto } from '@/types/dto/teamMember';
import TeamMemberCard from '@/components/user/TeamMemberCard';
import { ArrowLeftIcon } from '@/components/icon/ArrowIcons';
import Button from '@/components/base/Button';

const AboutClient = () => {
  const router = useRouter();
  const { data: teamMembers, isLoading } = useTeamMembers();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 뒤로가기 버튼 */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Button
            onClick={handleGoBack}
            theme="dark"
            className="flex items-center gap-2 text-sm"
            padding="px-2 py-1"
          >
            <ArrowLeftIcon />
          </Button>
        </motion.div>

        {/* 헤더 섹션 */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
            About Us
          </h1>
          <p className="text-base md:text-lg text-gray-300">
            공연을 사랑하는 우리 팀을 소개합니다
          </p>
        </motion.div>

        {/* KIN 팀 소개 */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-green-400 text-center">KIN</h2>
          <div className="bg-gray-800/50 rounded-lg p-6 md:p-8 border border-gray-700">
            <p className="text-sm md:text-base text-gray-300 leading-relaxed text-left">
              KIN은 대학교 동아리에서 함께 활동했던 친구들이 모여 만든 공연팀입니다. 
              공연을 사랑하는 마음으로 시작했던 우리는, 
              수많은 공연을 함께하며 공연 문화의 매력을 깊이 경험했습니다.
              <br /><br />
              대학 시절 함께 공연을 해오면서 느꼈던 설렘과 감동을 바탕으로, 
              더 많은 사람들과 공연을 나누고 싶다는 열정을 가지고 
              우리만의 특별한 팀워크로 공연 문화를 이어가고 있습니다.
            </p>
          </div>
        </motion.div>

        {/* 팀원 목록 */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-green-400 text-center">Team Members</h2>
          
          <div className="bg-gray-800/50 rounded-lg p-4 md:p-6 border border-gray-700">
            {isLoading ? (
              <div className="text-center py-6">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-green-400"></div>
                <p className="text-sm text-gray-400 mt-3">팀원 정보를 불러오는 중...</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4gap-4 md:gap-6">
                {teamMembers?.map((member: TeamMemberViewDto, index: number) => (
                  <TeamMemberCard 
                    key={member.id}
                    member={member}
                    index={index}
                  />
                ))}
              </div>
            )}
            
            {!isLoading && (!teamMembers || teamMembers.length === 0) && (
              <div className="text-center py-6">
                <p className="text-sm text-gray-400">팀원 정보가 없습니다.</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* 연락처 */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-green-400 text-center">Contact</h2>
            <div className="bg-gray-800/50 rounded-lg p-6 md:p-8 border border-gray-700">
                <p className="text-sm md:text-base text-gray-300 mb-3 md:mb-4">
                문의사항이 있으시면 언제든 연락주세요.
                </p>
                <a 
                href="mailto:gfjg12@naver.com" 
                className="inline-block bg-green-500 hover:bg-green-600 text-white font-semibold py-2 md:py-3 px-4 md:px-6 rounded-lg transition-colors text-sm md:text-base"
                >
                gfjg12@naver.com
                </a>
            </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutClient; 