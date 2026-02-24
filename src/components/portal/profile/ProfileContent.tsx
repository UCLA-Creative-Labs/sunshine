/**
 * ProfileContent Component - Main Profile Page Container
 * 
 * This is the main orchestrator component that:
 * - Manages all state (profile data, projects, form inputs, modals)
 * - Handles data fetching from Supabase profiles table
 * - Calculates unlocked achievements based on level/points
 * - Coordinates between ProfileSection and UserProjectsList
 * - Handles all user interactions (image upload, bio editing, project CRUD)
 * 
 * State Management:
 * - Profile data (name, bio, image, level, points)
 * - Projects list
 * - Project modal state
 * - Form inputs for project creation/editing
 */

'use client';

import React, { useState, useEffect } from 'react';
import { profileService } from '@/lib/supabase/profileService';
import ProjectCard from '@/components/portal/directory/ProjectCard';
import ProjectModal from '@/components/portal/directory/ProjectModal';

import { Profile } from './types';
import { ACHIEVEMENT_THRESHOLDS, ACHIEVEMENT_CONFIG } from './constants';
import ProfileSection from './ProfileSection';

const ProfileContent = () => {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [roles, setRoles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [bio, setBio] = useState('');
    const [isEditingBio, setIsEditingBio] = useState(false);
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [projects, setProjects] = useState<any[]>([]);
    const [selectedProject, setSelectedProject] = useState<any>(null);

    // Fetch current user profile from Supabase
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const profileData = await profileService.getCurrentProfile();
                
                // Transform Supabase profile to match UI expectations
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
                
                const userRoles = await profileService.getUserRoles(profileData.id);
                setRoles(userRoles);
                
                // Fetch user projects
                try {
                    const userProjects = await profileService.getUserProjects(profileData.id);
                    if (userProjects && userProjects.length > 0) {
                        const formattedProjects = userProjects.map((p: any) => {
                            const getColor = (name: string) => {
                                const colors = ['#FFB6C1', '#ADD8E6', '#DDA0DD', '#F0E68C', '#98FB98', '#FFE4B5', '#E0BBE4', '#B4E7CE'];
                                let hash = 0;
                                for (let i = 0; i < name.length; i++) {
                                    hash = name.charCodeAt(i) + ((hash << 5) - hash);
                                }
                                return colors[Math.abs(hash) % colors.length];
                            };

                            const getInitials = (name: string) => {
                                return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
                            };

                            return {
                                ...p.projects,
                                name: p.projects.projectName,
                                description: p.projects.projectDescription,
                                leads: (p.projects.projectLeads || []).map((lead: string) => ({
                                    initials: getInitials(lead),
                                    color: getColor(lead),
                                    name: lead
                                })),
                                memberCount: (p.projects.projectMembers || []).length,
                                quarter: `${p.projects.quarter} ${p.projects.year}`
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

    // Calculate unlocked achievements based on level and points
    const getUnlockedAchievements = () => {
        if (!profile) return [];
        
        return ACHIEVEMENT_CONFIG.filter(achievement => {
            const threshold = ACHIEVEMENT_THRESHOLDS[achievement.type];
            return profile.level >= threshold.level || profile.points >= threshold.points;
        });
    };

    const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // TODO: Upload to Supabase Storage when storage is set up
        // For now, just use local file preview
        const reader = new FileReader();
        reader.onloadend = () => {
            const result = reader.result as string;
            setProfileImage(result);
        };
        reader.readAsDataURL(file);
    };

    const handleBioUpdate = async () => {
        if (!profile) return;
        
        try {
            // TODO: Update bio in profiles table when bio field is added
            // await profileService.updateProfile(profile.id, { bio });
            setProfile({ ...profile, bio });
            setIsEditingBio(false);
        } catch (error) {
            console.error('Error updating bio:', error);
        }
    };

    if (loading) {
        return (
            <div className="p-8 text-black">
                <div className="text-center">Loading profile...</div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="p-8 text-black">
                <div className="text-center">Error loading profile</div>
            </div>
        );
    }

    const unlockedAchievements = getUnlockedAchievements();
    const displayImage = profileImage || profile.profile_image_url;

    return (
        <div className="bg-gray-100 min-h-full w-full">
            <div className="w-full px-8 py-8 text-black">
                <ProfileSection
                    profile={profile}
                    profileImage={displayImage}
                    bio={bio}
                    isEditingBio={isEditingBio}
                    achievements={unlockedAchievements}
                    roles={roles}
                    onImageChange={handleProfileImageChange}
                    onBioChange={setBio}
                    onEditBioStart={() => setIsEditingBio(true)}
                    onEditBioEnd={handleBioUpdate}
                />

                {/* My Projects Section */}
                <div className="bg-white rounded-lg p-6">
                    <h2 className="text-2xl font-bold text-black mb-4">My Projects</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {projects.map((project) => (
                            <ProjectCard
                                key={project.id}
                                project={project}
                                onClick={setSelectedProject}
                            />
                        ))}
                    </div>
                    {projects.length === 0 && (
                        <p className="text-gray-500 text-center py-8">No projects yet</p>
                    )}
                </div>

                {selectedProject && (
                    <ProjectModal
                        project={selectedProject}
                        onClose={() => setSelectedProject(null)}
                    />
                )}
            </div>
        </div>
    );
};

export default ProfileContent;
