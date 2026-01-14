/**
 * Constants and Configuration
 * 
 * Contains all constant values and configuration used in profile components:
 * - ACHIEVEMENT_THRESHOLDS: Level/points required to unlock each achievement
 * - ACHIEVEMENT_CONFIG: Achievement display data (colors, icons, types)
 * - POSITIONS: Available project position options
 */

export const ACHIEVEMENT_THRESHOLDS = {
    medal: { level: 2, points: 50 },      // First achievement at level 2 or 50 points
    shirt: { level: 3, points: 150 },     // Second at level 3 or 150 points
    clock: { level: 4, points: 300 },     // Third at level 4 or 300 points
    trophy: { level: 5, points: 500 },    // Fourth at level 5 or 500 points
};

export const ACHIEVEMENT_CONFIG = [
    { id: 1, type: 'medal' as const, color: '#DDA0DD', icon: 'medal', iconColor: '#FFD700' },
    { id: 2, type: 'shirt' as const, color: '#8B4513', icon: 'shirt', iconColor: '#D2B48C' },
    { id: 3, type: 'clock' as const, color: '#D2B48C', icon: 'clock', iconColor: '#8B4513' },
    { id: 4, type: 'trophy' as const, color: '#555555', icon: 'trophy', iconColor: '#CCCCCC' },
];

export const POSITIONS = ['Design', 'Developer', 'Marketing', 'Other'];

