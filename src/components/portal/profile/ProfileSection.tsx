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
    roles?: any[];
    onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBioChange: (value: string) => void;
    onEditBioStart: () => void;
    onEditBioEnd: () => void;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({
    profile,
    profileImage,
    bio,
    isEditingBio,
    achievements,
    roles = [],
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
        <div className="bg-white rounded-lg p-6 mb-6">
            <div className="flex gap-6">
                {/* Profile Picture */}
                <div className="relative flex-shrink-0">
                    <div className="w-56 h-56 bg-gray-400 rounded-lg flex items-center justify-center overflow-hidden">
                        {profileImage ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={profileImage}
                                alt="Profile picture"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="relative flex items-center justify-center w-full h-full">
                                <svg width="140" height="140" viewBox="0 0 140 140" className="absolute">
                                    <path
                                        d="M70 20 L82 60 L122 60 L88 85 L100 125 L70 100 L40 125 L52 85 L18 60 L58 60 Z"
                                        fill="#DDA0DD"
                                    />
                                </svg>
                                <div className="relative z-10 flex flex-col items-center mt-4">
                                    <div className="flex gap-2 mb-1.5">
                                        <div className="w-2.5 h-2.5 bg-black rounded-full"></div>
                                        <div className="w-2.5 h-2.5 bg-black rounded-full"></div>
                                    </div>
                                    <svg width="16" height="8" viewBox="0 0 16 8" className="mt-1">
                                        <path d="M2 6 Q8 2 14 6" stroke="black" strokeWidth="2" fill="none" strokeLinecap="round"/>
                                    </svg>
                                </div>
                            </div>
                        )}
                    </div>
                    <label className="absolute -top-2 -right-2 w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer border-4 border-white">
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
                            className="w-5 h-5"
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
                <div className="flex-1 border-2 border-gray-300 rounded-lg p-6">
                    <h1 className="text-3xl font-bold text-black mb-1">
                        {profile.first_name} {profile.last_name}
                    </h1>
                    <p className="text-base text-gray-600 mb-1">
                        @{profile.username}
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                        Joined {formatDate(profile.joined_date)}
                    </p>

                    {/* Roles */}
                    {roles.length > 0 && (
                        <div className="mb-4">
                            <p className="text-sm font-medium text-black mb-2">Roles:</p>
                            <div className="flex flex-wrap gap-2">
                                {roles.map((role, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                                    >
                                        {role.context}: {role.roles.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Bio */}
                    <div className="mb-4">
                        <div className="flex items-center gap-2 mb-1">
                            <label className="text-sm font-medium text-black">
                                Bio:
                            </label>
                            <div className="flex-1 border-b border-gray-400"></div>
                        </div>
                        {isEditingBio ? (
                            <textarea
                                value={bio}
                                onChange={(e) => onBioChange(e.target.value)}
                                onBlur={onEditBioEnd}
                                placeholder="Add your bio..."
                                className="w-full text-sm text-black border-none outline-none resize-none bg-transparent placeholder-gray-400 mt-1"
                                rows={2}
                                autoFocus
                            />
                        ) : bio ? (
                            <div
                                onClick={onEditBioStart}
                                className="text-sm text-black cursor-pointer mt-1"
                            >
                                {bio}
                            </div>
                        ) : (
                            <div
                                onClick={onEditBioStart}
                                className="text-sm text-gray-400 cursor-pointer hover:text-gray-600 mt-1"
                            >
                                click to add bio
                            </div>
                        )}
                    </div>

                    {/* Achievements */}
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 rounded-full bg-purple-300"></div>
                            <div className="w-12 h-12 rounded-full bg-gray-700"></div>
                            <div className="w-12 h-12 rounded-full bg-yellow-600"></div>
                            <div className="w-12 h-12 rounded-full bg-gray-600"></div>
                        </div>
                        <button className="text-xs text-black hover:underline">
                            see all achievements &gt;
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileSection;
