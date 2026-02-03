import React, { useState } from 'react';
import './CreateProjectModal.css';

const CreateProjectModal = ({ onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        projectName: '',
        projectDescription: '',
        year: new Date().getFullYear().toString(),
        quarter: 'Winter',
        logoUrl: '',
        prototypeUrl: '',
        demoDayUrl: '',
        instaPostUrl: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate required fields
        if (!formData.projectName.trim()) {
            setError('Project name is required');
            return;
        }
        if (!formData.projectDescription.trim()) {
            setError('Project description is required');
            return;
        }
        if (!formData.year.trim()) {
            setError('Year is required');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            await onSubmit({
                ...formData,
                // Initialize empty arrays for members (to be added later)
                projectLeads: [],
                projectManagers: [],
                projectMembers: []
            });
            onClose();
        } catch (err) {
            setError(err.message || 'Failed to create project');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="create-modal-overlay" onClick={onClose}>
            <div className="create-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="create-modal-header">
                    <h2>Create New Project</h2>
                    <button className="create-modal-close" onClick={onClose}>×</button>
                </div>

                <form className="create-modal-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>
                            Project Name <span className="required">*</span>
                        </label>
                        <input
                            type="text"
                            name="projectName"
                            className="form-input"
                            placeholder="Enter project name"
                            value={formData.projectName}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>
                            Description <span className="required">*</span>
                        </label>
                        <textarea
                            name="projectDescription"
                            className="form-input form-textarea"
                            placeholder="Describe what your project does..."
                            value={formData.projectDescription}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>
                                Year <span className="required">*</span>
                            </label>
                            <input
                                type="text"
                                name="year"
                                className="form-input"
                                placeholder="e.g., 2025"
                                value={formData.year}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>
                                Quarter <span className="required">*</span>
                            </label>
                            <select
                                name="quarter"
                                className="form-input form-select"
                                value={formData.quarter}
                                onChange={handleChange}
                            >
                                <option value="Winter">Winter</option>
                                <option value="Spring">Spring</option>
                                <option value="Summer">Summer</option>
                                <option value="Fall">Fall</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-section-title">Optional Links</div>

                    <div className="form-group">
                        <label>Logo URL</label>
                        <input
                            type="url"
                            name="logoUrl"
                            className="form-input"
                            placeholder="https://example.com/logo.png"
                            value={formData.logoUrl}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Prototype URL</label>
                        <input
                            type="url"
                            name="prototypeUrl"
                            className="form-input"
                            placeholder="https://figma.com/..."
                            value={formData.prototypeUrl}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Demo Day URL</label>
                        <input
                            type="url"
                            name="demoDayUrl"
                            className="form-input"
                            placeholder="https://youtube.com/..."
                            value={formData.demoDayUrl}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Instagram Post URL</label>
                        <input
                            type="url"
                            name="instaPostUrl"
                            className="form-input"
                            placeholder="https://instagram.com/p/..."
                            value={formData.instaPostUrl}
                            onChange={handleChange}
                        />
                    </div>

                    {error && <div className="form-error">{error}</div>}

                    <div className="form-actions">
                        <button type="button" className="btn-cancel" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Creating...' : 'Create Project'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateProjectModal;
