import React, { useState } from 'react';
import './CreateProjectModal.css';

// Generate default year in "YY-YY" format based on academic calendar
// Academic year starts in Fall (September), so Jan-Aug = previous year's cycle
const getDefaultYear = () => {
    const now = new Date();
    const calendarYear = now.getFullYear();
    const month = now.getMonth(); // 0-indexed: 0=Jan, 8=Sep
    const startYear = month >= 8 ? calendarYear : calendarYear - 1;
    const startStr = startYear.toString().slice(-2);
    const endStr = (startYear + 1).toString().slice(-2);
    return `${startStr}-${endStr}`;
};

const CreateProjectModal = ({ onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        projectName: '',
        projectDescription: '',
        year: getDefaultYear(),
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

    const handleFieldChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setError('');
    };

    const handleYearStep = (direction) => {
        const currentYearStr = formData.year || '25-26';
        let startYear = parseInt('20' + currentYearStr.split('-')[0]);
        if (isNaN(startYear)) startYear = 2025;

        const newStartYear = direction === 'next' ? startYear + 1 : startYear - 1;
        const startStr = newStartYear.toString().slice(-2);
        const endStr = (newStartYear + 1).toString().slice(-2);
        handleFieldChange('year', `${startStr}-${endStr}`);
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

                    <div className="quarter-year-row">
                        <div className="form-group">
                            <label>
                                Quarter <span className="required">*</span>
                            </label>
                            <div className="quarter-segmented">
                                {['Fall', 'Winter', 'Spring'].map((q) => (
                                    <button
                                        key={q}
                                        type="button"
                                        onClick={() => handleFieldChange('quarter', q)}
                                        className={`quarter-segment-btn ${formData.quarter === q ? 'active' : ''}`}
                                    >
                                        {q}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="form-group">
                            <label>
                                Year <span className="required">*</span>
                            </label>
                            <div className="year-stepper">
                                <button
                                    type="button"
                                    onClick={() => handleYearStep('prev')}
                                    className="year-stepper-btn"
                                >
                                    ‹
                                </button>
                                <span className="year-stepper-value">{formData.year}</span>
                                <button
                                    type="button"
                                    onClick={() => handleYearStep('next')}
                                    className="year-stepper-btn"
                                >
                                    ›
                                </button>
                            </div>
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
