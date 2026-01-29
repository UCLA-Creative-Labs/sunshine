import { useState } from 'react';

export interface IndividualProjectProps {
  project_name: string;
  project_leads: string[] | null;
  project_description: string | null;
  logo_url?: string | null;
  prototype_url?: string | null;
  demo_day_url?: string | null;
  insta_post_url?: string | null;
};

function joinStrings(strings: string[] | undefined | null): string {
  if (!strings || !Array.isArray(strings)) return "";
  return strings.filter(str => str.trim() !== "").join(", ");
}

const IndividualProjectCard = ({ project_name, project_leads, project_description, logo_url, prototype_url, demo_day_url, insta_post_url }: IndividualProjectProps) => {
  const [isExpanded, expand] = useState(false);

  return (
    <div className="border rounded-lg p-6 shadow-md">
      <div className="flex items-start">
        {logo_url && <img src={logo_url} alt="Project Logo" className="w-16 h-16 mr-4 rounded-lg" />}
        <div className="flex-1">
          <h2 className="text-xl font-bold">
            {project_name}: {joinStrings(project_leads)}
          </h2>
          {!isExpanded ? <p className="mt-2 line-clamp-3 flex-1">{project_description || 'No description available.'}</p> : <p className="mt-2">{project_description || 'No description available.'}</p>}
        </div>
      </div>
      {isExpanded ?
        <div className="flex flex-col md:flex-row mt-6">
          <div className={`mt-4 ${prototype_url ? 'md:w-1/2' : 'w-full'}`}>
            <p>
              <strong>Project Leads:</strong> {joinStrings(project_leads)}
            </p>
            <p>
              <strong>Project Members:</strong> Not available in current schema
            </p>
            <div className="mt-4 flex space-x-4">
              <a
                href={demo_day_url || '#'}
                className="px-4 py-2 border-2 border-black rounded-lg hover:bg-gray-100 transition font-bold"
                target="_blank"
                rel="noopener noreferrer"
              >
                Demo Day Slides
              </a>
              <a
                href={insta_post_url || '#'}
                className="px-4 py-2 border-2 border-black rounded-lg hover:bg-gray-100 transition font-bold"
                target="_blank"
                rel="noopener noreferrer"
              >
                Insta Post
              </a>
            </div>
          </div>
          {prototype_url && (
            <div className="md:w-1/2 mt-6 md:mt-4">
              <iframe src={prototype_url || ''} className="w-full h-96 rounded-lg" />
            </div>
          )}
        </div> : <></>}

      {!isExpanded ? <div className="mt-4 text-gray-600 cursor-pointer text-underline" onClick={() => expand(!isExpanded)}>
        ► See more about this project
      </div> :

        <div className="mt-4 text-gray-600 cursor-pointer text-underline" onClick={() => expand(!isExpanded)}>
          ▲ See less about this project
        </div>}
    </div>
  );
};

export default IndividualProjectCard;