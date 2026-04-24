'use client';

import React, { useState, useEffect } from 'react';
import { profileService } from '@/lib/supabase/profileService';
import ProjectModal from '@/components/portal/directory/ProjectModal';

import { Profile } from './types';
import { ACHIEVEMENT_THRESHOLDS, ACHIEVEMENT_CONFIG } from './constants';
import ProfileSection from './ProfileSection';
import { Avatar, pickAvatarColor } from '@/components/portal/ui';

interface ProjectSummary {
    id: string | number;
    name: string;
    description: string;
    leads: { initials: string; color: string; name: string }[];
    memberCount: number;
    quarter: string;
    [key: string]: any;
}

function MiniProjectCard({
    project,
    onClick,
}: {
    project: ProjectSummary;
    onClick: (p: ProjectSummary) => void;
}) {
    return (
        <button
            type="button"
            onClick={() => onClick(project)}
            className="group flex flex-col gap-3 rounded-2xl border-[1.5px] border-ink-200 bg-white p-5 text-left transition-colors hover:border-ink-400"
        >
            <div className="flex items-start justify-between gap-3">
                <h3 className="truncate font-display text-[16px] font-bold leading-tight text-ink-900">
                    {project.name}
                </h3>
                <span className="flex-shrink-0 font-code text-[10px] uppercase tracking-[0.06em] text-ink-400">
                    {project.quarter}
                </span>
            </div>
            <p className="line-clamp-2 text-[13px] leading-relaxed text-ink-600">
                {project.description}
            </p>
            <div className="mt-auto flex items-center justify-between gap-2 border-t border-ink-100 pt-3">
                <div className="flex -space-x-1.5">
                    {project.leads.slice(0, 3).map((lead, i) => (
                        <Avatar
                            key={i}
                            name={lead.name}
                            color={pickAvatarColor(lead.name)}
                            size="xs"
                            className="ring-2 ring-white"
                        />
                    ))}
                </div>
                <span className="font-code text-[10px] uppercase tracking-[0.06em] text-ink-400">
                    {project.memberCount} {project.memberCount === 1 ? 'member' : 'members'}
                </span>
            </div>
        </button>
    );
}

const ProfileContent = () => {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [roles, setRoles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [bio, setBio] = useState('');
    const [isEditingBio, setIsEditingBio] = useState(false);
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [projects, setProjects] = useState<ProjectSummary[]>([]);
    const [selectedProject, setSelectedProject] = useState<ProjectSummary | null>(null);
    const [major, setMajor] = useState('');
    const [gradYear, setGradYear] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const profileData = await profileService.getCurrentProfile();
                setUserId(profileData.id);

                const transformedProfile: Profile = {
                    id: profileData.id,
                    first_name: profileData.display_name || profileData.email.split('@')[0],
                    last_name: '',
                    username: profileData.email.split('@')[0],
                    bio: null,
                    profile_image_url: null,
                    level: 1,
                    points: 0,
                    joined_date: profileData.created_at,
                };

                setProfile(transformedProfile);
                setBio(transformedProfile.bio || '');
                setMajor(profileData.major ?? '');
                setGradYear(profileData.grad_year != null ? String(profileData.grad_year) : '');

                const userRoles = await profileService.getUserRoles(profileData.id);
                setRoles(userRoles);

                try {
                    const userProjects = await profileService.getUserProjects(profileData.id);
                    if (userProjects && userProjects.length > 0) {
                        const formattedProjects: ProjectSummary[] = userProjects.map((p: any) => {
                            const getInitials = (name: string) =>
                                name
                                    .split(' ')
                                    .map((n: string) => n[0])
                                    .slice(0, 2)
                                    .join('')
                                    .toUpperCase();

                            return {
                                ...p.projects,
                                name: p.projects.projectName,
                                description: p.projects.projectDescription ?? '',
                                leads: (p.projects.projectLeads || []).map((lead: string) => ({
                                    initials: getInitials(lead),
                                    color: '',
                                    name: lead,
                                })),
                                memberCount: (p.projects.projectMembers || []).length,
                                quarter: `${p.projects.quarter ?? ''} ${String(p.projects.year ?? '').slice(-2)}`.trim(),
                            };
                        });
                        setProjects(formattedProjects);
                    }
                } catch (projectError) {
                    console.error('Error fetching projects:', projectError);
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const getUnlockedAchievements = () => {
        if (!profile) return [];
        return ACHIEVEMENT_CONFIG.filter((achievement) => {
            const threshold = ACHIEVEMENT_THRESHOLDS[achievement.type];
            return profile.level >= threshold.level || profile.points >= threshold.points;
        });
    };

    const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const result = reader.result as string;
            setProfileImage(result);
        };
        reader.readAsDataURL(file);
    };

    const handleBioUpdate = async () => {
        if (!profile) return;
        setProfile({ ...profile, bio });
        setIsEditingBio(false);
    };

    const handleMajorChange = async (value: string) => {
        setMajor(value);
        if (!userId) return;
        try {
            await profileService.updateProfile(userId, { major: value || null });
        } catch (err) {
            console.error('Failed to save major:', err);
        }
    };

    const handleGradYearChange = async (value: string) => {
        setGradYear(value);
        if (!userId) return;
        const numeric = value ? parseInt(value, 10) : null;
        try {
            await profileService.updateProfile(userId, { grad_year: numeric });
        } catch (err) {
            console.error('Failed to save grad year:', err);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <p className="font-accent italic text-[14px] text-ink-400">loading profile…</p>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="flex items-center justify-center py-12">
                <p className="text-sm text-cl-danger-700">Failed to load profile</p>
            </div>
        );
    }

    const unlockedAchievements = getUnlockedAchievements();
    const displayImage = profileImage || profile.profile_image_url;

    return (
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-5 py-6 md:px-8 md:py-10">
            <section className="flex flex-col gap-1">
                <span className="font-code text-[11px] uppercase tracking-[0.08em] text-ink-400">
                    your profile
                </span>
                <h1 className="font-display text-[32px] font-bold leading-tight tracking-[-0.01em] text-ink-900 md:text-[40px]">
                    Profile
                </h1>
            </section>

            <ProfileSection
                profile={profile}
                profileImage={displayImage}
                bio={bio}
                isEditingBio={isEditingBio}
                achievements={unlockedAchievements}
                roles={roles}
                major={major}
                gradYear={gradYear}
                onMajorChange={handleMajorChange}
                onGradYearChange={handleGradYearChange}
                onImageChange={handleProfileImageChange}
                onBioChange={setBio}
                onEditBioStart={() => setIsEditingBio(true)}
                onEditBioEnd={handleBioUpdate}
            />

            <section className="rounded-2xl border-[1.5px] border-ink-200 bg-white p-6 md:p-8">
                <div className="mb-5 flex items-baseline gap-2">
                    <span className="font-code text-[11px] uppercase tracking-[0.08em] text-ink-400">
                        my projects
                    </span>
                    <span className="font-code text-[10px] uppercase tracking-[0.06em] text-ink-400">
                        · {projects.length}
                    </span>
                </div>
                {projects.length === 0 ? (
                    <div className="rounded-2xl border-[1.5px] border-dashed border-ink-300 bg-transparent px-5 py-10 text-center">
                        <p className="font-accent italic text-[15px] text-ink-400">
                            no projects yet —
                        </p>
                        <p className="mt-1 text-[14px] text-ink-600">
                            join a team and they&rsquo;ll appear here
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {projects.map((project) => (
                            <MiniProjectCard
                                key={project.id}
                                project={project}
                                onClick={setSelectedProject}
                            />
                        ))}
                    </div>
                )}
            </section>

            {selectedProject && (
                <ProjectModal
                    project={selectedProject}
                    onClose={() => setSelectedProject(null)}
                />
            )}
        </div>
    );
};

export default ProfileContent;
