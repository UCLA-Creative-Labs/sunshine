import '../../../styles/ProjectsContent.scss';

import React from 'react';

export default function ProjectsContent({
    title,
    description,
    instaGraphic,
    projectLeads,
    projectMembers,
    url,
}) {
    return (
        <a href={url} rel="noopener noreferrer" className="projects-card">
            <img src={instaGraphic} alt={`${title} Insta Graphic`} className="graphic" />
            <div className='about-proj'>
                <h2 className="text-2xl font-bold mb-4">{title}</h2>
                <p className="mb-2"><strong>Project Leads:</strong> {projectLeads}</p>
                <p className="mb-4"><strong>Team Members:</strong> {projectMembers}</p>
                <p className="mb-2 text-lg"><strong>Description: </strong>{description}</p>
                <div className="flex space-x-4 mb-4">
                </div>
            </div>
        </a>
    );
}
