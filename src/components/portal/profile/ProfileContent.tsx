/**
 * ProfileContent Component - Main Profile Page Container
 * 
 * This is the main orchestrator component that:
 * - Manages all state (profile data, projects, form inputs, modals)
 * - Handles data fetching (TODO: connect to Supabase)
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
// import { supabase } from '@/lib/supabase/client';

import { Profile, Project } from './types';
import { ACHIEVEMENT_THRESHOLDS, ACHIEVEMENT_CONFIG } from './constants';
import ProfileSection from './ProfileSection';
import UserProjectsList from './UserProjectsList';

const ProfileContent = () => {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [bio, setBio] = useState('');
    const [isEditingBio, setIsEditingBio] = useState(false);
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [showProjectModal, setShowProjectModal] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    
    // Project form state
    const [projectName, setProjectName] = useState('');
    const [projectDescription, setProjectDescription] = useState('');
    const [selectedPositions, setSelectedPositions] = useState<string[]>([]);
    const [projectImage, setProjectImage] = useState<string | null>(null);
    const [projectLink, setProjectLink] = useState('');
    const [projects, setProjects] = useState<Project[]>([]);

    // TODO: Replace with Supabase fetch when database is set up
    // Initialize with default profile data
    useEffect(() => {
        // Simulate loading
        setTimeout(() => {
            const defaultProfile: Profile = {
                id: 'temp-id',
                first_name: 'First',
                last_name: 'Last',
                username: 'username',
                bio: null,
                profile_image_url: null,
                level: 1,
                points: 0,
                joined_date: new Date().toISOString(),
            };
            setProfile(defaultProfile);
            setLoading(false);
        }, 500);
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

        // TODO: Upload to Supabase Storage when database is set up
        // For now, just use local file preview
        const reader = new FileReader();
        reader.onloadend = () => {
            const result = reader.result as string;
            setProfileImage(result);
            // TODO: Update profile in Supabase when connected
            // await supabase.from('profiles').update({ profile_image_url: result }).eq('id', profile.id);
        };
        reader.readAsDataURL(file);
    };

    const handleBioUpdate = () => {
        // TODO: Update bio in Supabase when database is set up
        // await supabase.from('profiles').update({ bio }).eq('id', profile.id);
        if (profile) {
            setProfile({ ...profile, bio });
        }
        setIsEditingBio(false);
    };

    const handleProjectImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProjectImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const togglePosition = (position: string) => {
        setSelectedPositions(prev =>
            prev.includes(position)
                ? prev.filter(p => p !== position)
                : [...prev, position]
        );
    };

    const openProjectModal = (project?: Project) => {
        if (project) {
            setEditingProject(project);
            setProjectName(project.name);
            setProjectDescription(project.description);
            setSelectedPositions([project.position]);
            setProjectImage(project.image || null);
            setProjectLink(project.link || '');
        } else {
            setEditingProject(null);
            setProjectName('');
            setProjectDescription('');
            setSelectedPositions([]);
            setProjectImage(null);
            setProjectLink('');
        }
        setShowProjectModal(true);
    };

    const closeProjectModal = () => {
        setShowProjectModal(false);
        setEditingProject(null);
        setProjectName('');
        setProjectDescription('');
        setSelectedPositions([]);
        setProjectImage(null);
        setProjectLink('');
    };

    const saveProject = () => {
        if (!projectName.trim()) return;

        // TODO: Save to Supabase when database is set up
        const projectData: Project = {
            id: editingProject?.id || Date.now(),
            name: projectName,
            description: projectDescription,
            position: selectedPositions[0] || 'Other',
            image: projectImage || undefined,
            link: projectLink || undefined,
        };

        if (editingProject) {
            // TODO: Update in Supabase
            // await supabase.from('projects').update(projectData).eq('id', editingProject.id);
            setProjects(prev =>
                prev.map(p => (p.id === editingProject.id ? projectData : p))
            );
        } else {
            // TODO: Insert into Supabase
            // const { data } = await supabase.from('projects').insert(projectData).select().single();
            setProjects(prev => [...prev, projectData]);
        }

        closeProjectModal();
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
                    onImageChange={handleProfileImageChange}
                    onBioChange={setBio}
                    onEditBioStart={() => setIsEditingBio(true)}
                    onEditBioEnd={handleBioUpdate}
                />

                <UserProjectsList
                    projects={projects}
                    showModal={showProjectModal}
                    editingProject={editingProject}
                    projectName={projectName}
                    projectDescription={projectDescription}
                    selectedPositions={selectedPositions}
                    projectImage={projectImage}
                    projectLink={projectLink}
                    onProjectClick={openProjectModal}
                    onAddProjectClick={() => openProjectModal()}
                    onCloseModal={closeProjectModal}
                    onNameChange={setProjectName}
                    onDescriptionChange={setProjectDescription}
                    onPositionToggle={togglePosition}
                    onImageChange={handleProjectImageChange}
                    onLinkChange={setProjectLink}
                    onSave={saveProject}
                />
            </div>
        </div>
    );
};

export default ProfileContent;
