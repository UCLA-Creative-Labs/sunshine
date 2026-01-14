const ProjectCard = ({ project, onClick }) => {
  return (
    <div className="project-card" onClick={() => onClick && onClick(project)} style={{ cursor: 'pointer' }}>
      <h3>{project.name}</h3>
      <p className="project-description">{project.description}</p>
      <div className="project-leads">
        <div className="profile-photos">
          {project.leads.map((lead, index) => (
            <div
              key={index}
              className="profile-photo"
              style={{ backgroundColor: lead.color }}
            >
              {lead.initials}
            </div>
          ))}
        </div>
        <span className="member-count">{project.memberCount} members</span>
        <span className="project-date">📅 {project.quarter}</span>
      </div>
    </div>
  );
};

export default ProjectCard;