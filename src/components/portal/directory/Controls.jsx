// Controls Component
const Controls = ({ searchQuery, onSearchChange, filters, onFilterChange }) => {
  return (
    <div className="controls">
      <input
        type="text"
        className="search-box"
        placeholder="🔍 Search projects..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      
      <div className="filter-group">
        <select
          className="filter-select"
          value={filters.status}
          onChange={(e) => onFilterChange('status', e.target.value)}
        >
          <option>All Status</option>
          <option>Active</option>
          <option>Archived</option>
        </select>
        
        <select
          className="filter-select"
          value={filters.category}
          onChange={(e) => onFilterChange('category', e.target.value)}
        >
          <option>All Categories</option>
          <option>Technology</option>
          <option>Events</option>
          <option>Community</option>
        </select>
        
        <select
          className="filter-select"
          value={filters.sort}
          onChange={(e) => onFilterChange('sort', e.target.value)}
        >
          <option>Sort: Newest</option>
          <option>Sort: Oldest</option>
          <option>Sort: Most Members</option>
          <option>Sort: A-Z</option>
        </select>
      </div>
      
      <div className="view-toggle">
        <button className="view-btn active" title="Grid View">⊞</button>
        <button className="view-btn" title="List View">☰</button>
      </div>
    </div>
  );
};
export default Controls;