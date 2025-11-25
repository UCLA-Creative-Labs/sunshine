// Stats Bar Component
const StatsBar = ({ totalProjects, activeCount, archivedCount }) => {
  return (
    <div className="stats-bar">
      <span><strong>{totalProjects} Projects</strong> total</span>
      <span>{activeCount} Active • {archivedCount} Archived</span>
    </div>
  );
};
export default StatsBar;