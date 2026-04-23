/**
 * TypeScript Type Definitions
 * 
 * - Project: Project data structure (id, name, description, position, image)
 * - Profile: User profile data (id, name, username, bio, image, level, points, dates)
 * - Achievement: Achievement badge data (id, type, colors, icon info)
 */

export interface Project {
    id: number | string;
    name: string;
    description: string;
    position: string;
    image?: string;
    link?: string;
}

export interface Profile {
    id: string;
    first_name: string;
    last_name: string;
    username: string;
    bio: string | null;
    profile_image_url: string | null;
    level: number;
    points: number;
    joined_date: string;
    github_username?: string | null;
}

export interface Achievement {
    id: number;
    type: 'medal' | 'shirt' | 'clock' | 'trophy';
    color: string;
    icon: string;
    iconColor: string;
}

