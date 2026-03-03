// Controls Component
const Controls = ({ searchQuery, onSearchChange, filters, onFilterChange, viewMode, onViewModeChange }) => {
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
        <button
          className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
          title="Grid View"
          onClick={() => onViewModeChange('grid')}
        >⊞</button>
        <button
          className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
          title="List View"
          onClick={() => onViewModeChange('list')}
        >☰</button>
      </div>
    </div>
  );
};
export default Controls;