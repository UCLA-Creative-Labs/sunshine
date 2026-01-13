import React from 'react';
import './ProjectModal.css';

const ProjectModal = ({ project, onClose }) => {
    if (!project) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>×</button>

                <div className="modal-header">
                    {project.logoUrl && (
                        <img src={project.logoUrl} alt={project.name} className="modal-logo" />
                    )}
                    <div className="modal-title-section">
                        <h2 className="modal-title">{project.name}</h2>
                        <span className="modal-quarter">{project.quarter}</span>
                    </div>
                </div>

                <div className="modal-body">
                    <div className="modal-section">
                        <h3>Description</h3>
                        <p>{project.description || 'No description available.'}</p>
                    </div>

                    {project.leads && project.leads.length > 0 && (
                        <div className="modal-section">
                            <h3>Project Leads</h3>
                            <div className="modal-people-list">
                                {project.leads.map((lead, index) => (
                                    <div key={index} className="modal-person">
                                        <div
                                            className="modal-avatar"
                                            style={{ backgroundColor: lead.color }}
                                        >
                                            {lead.initials}
                                        </div>
                                        <span>{lead.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {project.projectManagers && project.projectManagers.length > 0 && (
                        <div className="modal-section">
                            <h3>Project Managers</h3>
                            <div className="modal-people-tags">
                                {project.projectManagers.map((pm, index) => (
                                    <span key={index} className="modal-tag">{pm}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    {project.projectMembers && project.projectMembers.length > 0 && (
                        <div className="modal-section">
                            <h3>Team Members ({project.projectMembers.length})</h3>
                            <div className="modal-people-tags">
                                {project.projectMembers.map((member, index) => (
                                    <span key={index} className="modal-tag">{member}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="modal-links">
                        {project.prototypeUrl && (
                            <a href={project.prototypeUrl} target="_blank" rel="noopener noreferrer" className="modal-link">
                                🔗 Prototype
                            </a>
                        )}
                        {project.demoDayUrl && (
                            <a href={project.demoDayUrl} target="_blank" rel="noopener noreferrer" className="modal-link">
                                🎬 Demo Day
                            </a>
                        )}
                        {project.instaPostUrl && (
                            <a href={project.instaPostUrl} target="_blank" rel="noopener noreferrer" className="modal-link">
                                📸 Instagram
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectModal;
