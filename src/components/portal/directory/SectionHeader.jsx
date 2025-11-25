const SectionHeader = ({ title, description }) => {
  return (
    <div className="section-header">
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
};
export default SectionHeader;