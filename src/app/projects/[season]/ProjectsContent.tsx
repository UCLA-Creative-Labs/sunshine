//import '../../styles/ProjectsContent.scss';

import React from 'react';

export default function ProjectsContent({
    title,
    description,
    projGraphic,
    instaGraphic,
    teamGraphic,
    projectLeads,
    projectMembers,
    url,
}) {
    return (
        <div className="project-card border rounded-lg shadow-md p-5 mb-6">
            <h2 className="text-2xl font-bold mb-4">{title}</h2>
            <img src={projGraphic} alt={title} className="w-full h-auto mb-4" />
            <p className="mb-2 text-lg">{description}</p>
            <p className="mb-2"><strong>Project Leads:</strong> {projectLeads}</p>
            <p className="mb-4"><strong>Team Members:</strong> {projectMembers}</p>
            <div className="flex space-x-4 mb-4">
                <img src={instaGraphic} alt="Instagram Graphic" className="w-20 h-20 object-cover" />
                <img src={teamGraphic} alt="Team Graphic" className="w-20 h-20 object-cover" />
            </div>
            <a href={url} className="text-blue-500 underline hover:text-blue-700" target="_blank" rel="noopener noreferrer">
                View Project Details
            </a>
        </div>
    );
}
