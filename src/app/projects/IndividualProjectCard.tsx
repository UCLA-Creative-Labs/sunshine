import { useState } from 'react';

export interface IndividualProjectProps {
    projectName: string;
    projectLeads: [string];
    projectDescription: string;
    logoUrl: string;
    prototypeUrl: string;
    projectManagers: string[];
    projectMembers: string[];
    demoDayUrl: string;
    instaPostUrl: string;
};

function joinStrings(strings: string[]): string {
    return strings.filter(str => str.trim() !== "").join(", ");
}

const IndividualProjectCard = ({ projectName, projectLeads, projectDescription, logoUrl, prototypeUrl, projectManagers, projectMembers, demoDayUrl, instaPostUrl } : IndividualProjectProps) => {
    const [isExpanded, expand] = useState(false);

    return (
        <div className="border rounded-lg p-6 shadow-md">
          <div className="flex items-start">
            <img src={logoUrl} alt="Project Logo" className="w-16 h-16 mr-4 rounded-lg" />
            <div className="flex-1">
              <h2 className="text-xl font-bold">
                {projectName}: {joinStrings(projectLeads)}
              </h2>
              { !isExpanded ? <p className="mt-2 line-clamp-3 flex-1">{projectDescription}</p> : <p className="mt-2">{projectDescription}</p> }
            </div>
          </div>
          {isExpanded ?
            <div className="flex flex-col md:flex-row mt-6">
                <div className="mt-4">
                    <p>
                    <strong>Project Manager(s):</strong> {joinStrings(projectManagers)}
                    </p>
                    <p>
                    <strong>Project Members:</strong> {joinStrings(projectMembers)}
                    </p>
                    <div className="mt-4 flex space-x-4">
                    <a
                    href={demoDayUrl}
                    className="px-4 py-2 border-2 border-black rounded-lg hover:bg-gray-100 transition font-bold"
                    target="_blank"
                    rel="noopener noreferrer"
                    >
                    Demo Day Slides
                    </a>
                    <a
                    href={instaPostUrl}
                    className="px-4 py-2 border-2 border-black rounded-lg hover:bg-gray-100 transition font-bold"
                    target="_blank"
                    rel="noopener noreferrer"
                    >
                    Insta Post
                    </a>
                </div>
                </div>
                <div className="mt-6 ml-6">
                    <img src={prototypeUrl} alt="Frontend Features" className="w-full rounded-lg" />
                </div>
            </div> : <></> }
    
          { !isExpanded ? <div className="mt-4 text-gray-600 cursor-pointer text-underline" onClick={() => expand(!isExpanded)}>
            ▼ See more about this project
          </div> :
          
          <div className="mt-4 text-gray-600 cursor-pointer text-underline" onClick={() => expand(!isExpanded)}>
            ▲ See less about this project
          </div> }
        </div>
      );
};

export default IndividualProjectCard;