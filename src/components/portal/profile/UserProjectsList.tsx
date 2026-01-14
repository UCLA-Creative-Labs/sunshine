/**
 * UserProjectsList Component
 * 
 * Contains all project-related UI including:
 * - Projects list display (scrollable horizontal cards)
 * - Individual project cards (with image, name, description, position tag)
 * - "Add Project" card (triggers modal)
 * - Project creation/editing modal (form with name, position, description, image upload)
 * - TODO: connect profile to projects under supabase and display on profile screen 
 * 
 * This component handles all project management UI in one place.
 */

import React from 'react';
import { Project } from './types';
import { POSITIONS } from './constants';

interface UserProjectsListProps {
    projects: Project[];
    showModal: boolean;
    editingProject: Project | null;
    projectName: string;
    projectDescription: string;
    selectedPositions: string[];
    projectImage: string | null;
    projectLink: string;
    onProjectClick: (project: Project) => void;
    onAddProjectClick: () => void;
    onCloseModal: () => void;
    onNameChange: (value: string) => void;
    onDescriptionChange: (value: string) => void;
    onPositionToggle: (position: string) => void;
    onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onLinkChange: (value: string) => void;
    onSave: () => void;
}

const UserProjectsList: React.FC<UserProjectsListProps> = ({
    projects,
    showModal,
    editingProject,
    projectName,
    projectDescription,
    selectedPositions,
    projectImage,
    projectLink,
    onProjectClick,
    onAddProjectClick,
    onCloseModal,
    onNameChange,
    onDescriptionChange,
    onPositionToggle,
    onImageChange,
    onLinkChange,
    onSave,
}) => {
    return (
        <>
            <div className="bg-white rounded-lg border-2 border-gray-800 p-8">
                <h2 className="text-2xl font-bold mb-6 text-black">Projects</h2>
                {/* Not scrollable - use grid layout */}
                {projects.length === 0 ? (
                    // When no projects, just show add card
                    <div className="flex gap-4">
                        <div
                            onClick={onAddProjectClick}
                            className="bg-white rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors cursor-pointer flex flex-col items-center justify-center h-64 w-48"
                        >
                            <div className="text-5xl text-gray-400 mb-2 font-light">+</div>
                            <div className="text-sm text-gray-500">click to add</div>
                        </div>
                    </div>
                ) : (
                    <div className="flex gap-4 flex-wrap">
                        {projects.map((project) => (
                            <div
                                key={project.id}
                                className={`bg-white rounded-lg overflow-hidden border-2 border-gray-300 hover:border-gray-400 transition-colors w-48 ${
                                    projects.length > 1 ? 'cursor-pointer' : ''
                                }`}
                                onClick={projects.length > 1 ? () => onProjectClick(project) : undefined}
                            >
                                <div className="w-full h-32 bg-gray-400 flex items-center justify-center">
                                    {project.image ? (
                                        <img
                                            src={project.image}
                                            alt={`${project.name} thumbnail`}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-500"></div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold text-black mb-1">
                                        {project.name}
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-2">
                                        {project.description || 'description'}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <span className="inline-block bg-purple-600 text-white px-2 py-0.5 rounded text-xs">
                                            {project.position}
                                        </span>
                                        {projects.length === 1 && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onProjectClick(project);
                                                }}
                                                className="text-xs text-gray-600 hover:text-gray-800 underline"
                                            >
                                                view details
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div
                            onClick={onAddProjectClick}
                            className="bg-white rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors cursor-pointer flex flex-col items-center justify-center h-64 w-48"
                        >
                            <div className="text-5xl text-gray-400 mb-2 font-light">+</div>
                            <div className="text-sm text-gray-500">click to add</div>
                        </div>
                    </div>
                )}
            </div>

            {/* Project Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg border-2 border-gray-800 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-8">
                            <h2 className="text-2xl font-bold mb-6 text-black">
                                {editingProject ? 'Edit Project' : 'New Project'}
                            </h2>

                            <div className="mb-6">
                                <label className="block text-base font-medium text-black mb-2">
                                    New Project Name
                                </label>
                                <input
                                    type="text"
                                    value={projectName}
                                    onChange={(e) => onNameChange(e.target.value)}
                                    placeholder="Enter project name"
                                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-800"
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block text-base font-medium text-black mb-2">
                                    Position(s):
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {POSITIONS.map((position) => (
                                        <button
                                            key={position}
                                            onClick={() => onPositionToggle(position)}
                                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                                selectedPositions.includes(position)
                                                    ? 'bg-purple-600 text-white'
                                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                            }`}
                                        >
                                            {position}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block text-base font-medium text-black mb-2">
                                    Description:
                                </label>
                                <textarea
                                    value={projectDescription}
                                    onChange={(e) => onDescriptionChange(e.target.value)}
                                    placeholder="add description"
                                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-800 resize-none"
                                    rows={4}
                                />
                            </div>

                            {/* Images */}
                            <div className="mb-6">
                                <label className="block text-base font-medium text-black mb-2">
                                    Images
                                </label>
                                <label className="block w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors flex items-center justify-center">
                                    {projectImage ? (
                                        <img
                                            src={projectImage}
                                            alt="Project preview"
                                            className="w-full h-full object-cover rounded-lg"
                                        />
                                    ) : (
                                        <div className="text-gray-400 text-2xl">+</div>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={onImageChange}
                                        className="hidden"
                                    />
                                </label>
                            </div>

                            {/* Links */}
                            <div className="mb-6">
                                <label className="block text-base font-medium text-black mb-2">
                                    Link (GitHub, Chrome Web Store, etc.)
                                </label>
                                <input
                                    type="url"
                                    value={projectLink}
                                    onChange={(e) => onLinkChange(e.target.value)}
                                    placeholder="https://github.com/..."
                                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-800"
                                />
                            </div>

                            <div className="flex justify-end gap-4">
                                <button
                                    onClick={onCloseModal}
                                    className="px-6 py-2 border-2 border-gray-800 rounded-lg text-black font-medium hover:bg-gray-100 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={onSave}
                                    disabled={!projectName.trim()}
                                    className="px-6 py-2 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default UserProjectsList;

