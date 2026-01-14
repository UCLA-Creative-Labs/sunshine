/**
 * ProfileSection Component
 * 
 * Contains the main profile display section including:
 * - Profile picture with edit functionality (upload/change image)
 * - User information (name, username, level badge, joined date)
 * - Bio section (editable text area)
 * - Achievements display (shows unlocked achievements or empty state)
 */

import React from 'react';
import { Profile, Achievement } from './types';

interface ProfileSectionProps {
    profile: Profile;
    profileImage: string | null;
    bio: string;
    isEditingBio: boolean;
    achievements: Achievement[];
    onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBioChange: (value: string) => void;
    onEditBioStart: () => void;
    onEditBioEnd: () => void;
}

const AchievementIcon: React.FC<{ icon: 'medal' | 'shirt' | 'clock' | 'trophy'; iconColor: string }> = ({ icon, iconColor }) => {
    switch (icon) {
        case 'medal':
            return (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" style={{ color: iconColor }}>
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/>
                </svg>
            );
        case 'shirt':
            return (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ color: iconColor }}>
                    <path d="M6 3H18L17 5H7L6 3ZM19 6H5C5 8 7 9 7 10V20C7 21.1 7.9 22 9 22H15C16.1 22 17 21.1 17 20V10C17 9 19 8 19 6Z" fill="currentColor"/>
                </svg>
            );
        case 'clock':
            return (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ color: iconColor }}>
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
                    <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
            );
        case 'trophy':
            return (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ color: iconColor }}>
                    <path d="M19 5H17V3H7V5H5C3.9 5 3 5.9 3 7V8C3 10.55 4.92 12.63 7.39 12.94C8.02 14.44 9.37 15.57 11 15.9V19H7V21H17V19H13V15.9C14.63 15.57 15.98 14.44 16.61 12.94C19.08 12.63 21 10.55 21 8V7C21 5.9 20.1 5 19 5ZM5 8V7H7V10.82C5.84 10.4 5 9.3 5 8ZM19 8C19 9.3 18.16 10.4 17 10.82V7H19V8Z" fill="currentColor"/>
                </svg>
            );
        default:
            return null;
    }
};

const ProfileSection: React.FC<ProfileSectionProps> = ({
    profile,
    profileImage,
    bio,
    isEditingBio,
    achievements,
    onImageChange,
    onBioChange,
    onEditBioStart,
    onEditBioEnd,
}) => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    };

    return (
        <div className="bg-white rounded-lg border-2 border-gray-800 p-8 mb-8">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Profile Picture */}
                <div className="relative">
                    <div className="w-48 h-48 md:w-64 md:h-64 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                        {profileImage ? (
                            <img
                                src={profileImage}
                                alt="Profile picture"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="relative flex items-center justify-center">
                                <svg width="120" height="120" viewBox="0 0 120 120" className="absolute">
                                    <path
                                        d="M60 10 L70 45 L105 45 L75 65 L85 100 L60 80 L35 100 L45 65 L15 45 L50 45 Z"
                                        fill="#DDA0DD"
                                    />
                                </svg>
                                <div className="relative z-10 flex flex-col items-center mt-2">
                                    <div className="flex gap-1.5 mb-1">
                                        <div className="w-2 h-2 bg-black rounded-full"></div>
                                        <div className="w-2 h-2 bg-black rounded-full"></div>
                                    </div>
                                    <svg width="12" height="6" viewBox="0 0 12 6" className="mt-0.5">
                                        <path d="M1 5 Q6 1 11 5" stroke="black" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                                    </svg>
                                </div>
                            </div>
                        )}
                    </div>
                    <label className="absolute top-2 right-2 w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors cursor-pointer">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={onImageChange}
                            className="hidden"
                        />
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="white"
                            className="w-4 h-4"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                            />
                        </svg>
                    </label>
                </div>

                {/* User Information */}
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-4xl font-bold text-black">
                            {profile.first_name} {profile.last_name}
                        </h1>
                        <span className="bg-purple-600 text-white px-3 py-1 rounded-md text-sm font-semibold">
                            LEVEL {profile.level}
                        </span>
                    </div>
                    <p className="text-lg text-gray-700 mb-2">
                        @{profile.username}
                    </p>
                    <p className="text-base text-gray-600 mb-6">
                        Joined {formatDate(profile.joined_date)}
                    </p>

                    {/* Bio */}
                    <div className="mb-6">
                        <label className="block text-base font-medium text-black mb-2">
                            Bio:
                        </label>
                        {isEditingBio ? (
                            <textarea
                                value={bio}
                                onChange={(e) => onBioChange(e.target.value)}
                                onBlur={onEditBioEnd}
                                placeholder="________________________________________________"
                                className="w-full text-base text-black border-none outline-none resize-none bg-transparent placeholder-gray-400"
                                rows={1}
                                autoFocus
                            />
                        ) : bio ? (
                            <div
                                onClick={onEditBioStart}
                                className="text-base text-black cursor-pointer"
                            >
                                {bio}
                            </div>
                        ) : (
                            <div
                                onClick={onEditBioStart}
                                className="text-base text-gray-400 cursor-pointer hover:text-gray-600"
                            >
                                click to edit
                            </div>
                        )}
                    </div>

                    {/* Achievements */}
                    <div className="flex items-center gap-3 mb-2">
                        {achievements.length > 0 ? (
                            achievements.map((achievement) => (
                                <div
                                    key={achievement.id}
                                    className="w-12 h-12 rounded-full flex items-center justify-center relative"
                                    style={{ backgroundColor: achievement.color }}
                                >
                                    <AchievementIcon icon={achievement.type} iconColor={achievement.iconColor} />
                                </div>
                            ))
                        ) : (
                            <div className="w-full bg-white border-2 border-gray-300 rounded-lg px-4 py-2 text-gray-400 text-sm">
                                no achievements earned yet!
                            </div>
                        )}
                    </div>
                    {achievements.length > 0 && (
                        <button className="text-sm text-black hover:underline">
                            see all achievements &gt;
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfileSection;

