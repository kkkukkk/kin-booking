import { motion } from 'framer-motion';
import UserAvatar from './UserAvatar';
import { TeamMemberViewDto } from '@/types/dto/teamMember';
import { TeamRoleEnum, TeamRoleKo } from '@/types/model/teamMember';
import { InstagramIcon, YoutubeIcon } from '@/components/icon/SocialIcons';
import styles from '@/css/module/team-member-card.module.css';

interface TeamMemberCardProps {
  member: TeamMemberViewDto;
  index: number;
}

const TeamMemberCard = ({ member, index }: TeamMemberCardProps) => {
  const getRoleColor = (teamRole: TeamRoleEnum) => {
    switch (teamRole) {
      case TeamRoleEnum.LEADER:
        return 'bg-red-500';
      case TeamRoleEnum.STAFF:
        return 'bg-blue-500';
      case TeamRoleEnum.CREW:
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <motion.div
      className="bg-gray-800/50 rounded-xl p-4 md:p-6 border border-gray-700 h-full flex flex-col shadow-lg hover:shadow-xl transition-all duration-200 hover:border-gray-600"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
    >
      {/* Grid 레이아웃 */}
      <div className={styles.gridAreasTeamCard}>
        {/* 아바타 */}
        <div className={styles.gridAreaAvatar}>
          <UserAvatar
            name={member.name || 'Unknown'}
            size="sm md:md"
          />
        </div>

        {/* 이름 */}
        <div className={styles.gridAreaName}>
          <h3 className="text-base md:text-lg font-semibold text-white truncate">
            {member.displayName || 'Unknown'}
          </h3>
        </div>

        {/* 역할 */}
        <div className={styles.gridAreaRole}>
          <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getRoleColor(member.teamRole)}`}>
            {TeamRoleKo[member.teamRole]}
          </span>
        </div>

        {/* 소셜 링크 */}
        <div className={styles.gridAreaSocial}>
          {(member.instagramLink || member.youtubeLink) && (
            <div className="flex items-center gap-2">
              {member.instagramLink && (
                <a
                  href={member.instagramLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-400 hover:text-pink-300 transition-colors p-1 rounded-full hover:bg-pink-400/10"
                  title="Instagram"
                >
                  <InstagramIcon className="w-5 h-5" />
                </a>
              )}
              {member.youtubeLink && (
                <a
                  href={member.youtubeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-400 hover:text-red-400 transition-colors p-1 rounded-full hover:bg-red-400/10"
                  title="YouTube"
                >
                  <YoutubeIcon className="w-5 h-5" />
                </a>
              )}
            </div>
          )}
        </div>

        {/* 소개 */}
        {member.bio && (
          <div className={styles.gridAreaBio}>
            <div className="h-24 md:h-28 bg-gray-700/30 rounded-lg p-3">
              <p className="text-sm text-gray-300 leading-relaxed line-clamp-4 h-full">
                {member.bio}
              </p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TeamMemberCard; 