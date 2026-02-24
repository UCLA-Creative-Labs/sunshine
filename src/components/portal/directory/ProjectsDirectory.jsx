"use client"

import React, { useState, useEffect, useCallback } from 'react';
import './ProjectsDirectory.css';
import ProjectCard from './ProjectCard';
import ProjectModal from './ProjectModal';
import SectionHeader from './SectionHeader';
import StatsBar from './StatsBar';
import Controls from './Controls';
import Header from './Header';
import FloatingAddButton from './FloatingAddButton';
import CreateProjectModal from './CreateProjectModal';

// Projects Directory Component
const ProjectsDirectory = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    status: 'All Status',
    category: 'All Categories',
    sort: 'Sort: Newest'
  });

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeProjects, setActiveProjects] = useState([]);
  const [archivedProjects, setArchivedProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Helper to generate consistent colors from names
  const getColor = (name) => {
    const colors = ['#FFB6C1', '#ADD8E6', '#DDA0DD', '#F0E68C', '#98FB98', '#FFE4B5', '#E0BBE4', '#B4E7CE'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const { getAllProjects } = await import('@/lib/supabase/projectService');
      const allProjects = await getAllProjects();

      // Transform data to match UI expectations
      const formattedProjects = allProjects.map(p => ({
        ...p,
        name: p.projectName,
        description: p.projectDescription,
        leads: (p.projectLeads || []).map(lead => ({
          initials: getInitials(lead),
          color: getColor(lead),
          name: lead
        })),
        memberCount: (p.projectMembers || []).length,
        quarter: `${p.quarter} ${p.year}`
      }));

      setProjects(formattedProjects);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleCreateProject = async (projectData) => {
    const { createProject } = await import('@/lib/supabase/projectService');
    const { supabase } = await import('@/lib/supabase/client');
    const newProject = await createProject(projectData);

    // Automatically add the creating user as a project lead
    if (newProject) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: leadRole } = await supabase
          .from('roles')
          .select('id')
          .eq('context', 'external')
          .eq('name', 'project lead')
          .single();

        const roleId = leadRole?.id;

        await supabase.from('project_members').insert({
          project_id: newProject.id,
          user_id: user.id,
          rbac_role_id: roleId,
          invited_by: user.id,
          joined_at: new Date().toISOString(),
        });

        if (roleId) {
          await supabase.from('user_context_roles').insert({
            user_id: user.id,
            role_id: roleId,
            context: 'external',
          });
        }
      }
    }

    // Refresh the projects list
    await fetchProjects();
  };

  useEffect(() => {
    // Apply filters and search
    let filtered = [...projects];

    // 1. Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        (p.name || '').toLowerCase().includes(query) ||
        (p.description || '').toLowerCase().includes(query)
      );
    }

    // 2. Status Filter (Active/Archived) -> This might conflict with the sectioning, 
    // but if user selects "Active", we should only show Active projects.
    // However, the logic below separates them anyway. 
    // If "Active" is selected, we could clear the archived list or vice versa.
    // Let's handle this after separation.

    // 3. Category Filter
    if (filters.category !== 'All Categories') {
      // Assuming there isn't a category field yet, we might skip this or use a dummy field
      // If 'category' existed on project: filtered = filtered.filter(p => p.category === filters.category);
    }

    // 4. Sort
    if (filters.sort === 'Sort: Newest') {
      // Already loosely sorted by our Active/Archive logic, but let's be strict if needed
      // For now relying on the quarter logic or just fetch order?
      // Let's implement a basic sort if date exists, else ignore
    } else if (filters.sort === 'Sort: A-Z') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (filters.sort === 'Sort: Most Members') {
      filtered.sort((a, b) => b.memberCount - a.memberCount);
    }

    // Determine latest quarter for "Active" separation
    if (filtered.length === 0) {
      setActiveProjects([]);
      setArchivedProjects([]);
      return;
    }

    // Recalculate latest from the *full* set or the *filtered* set? 
    // Usually "Active" means "Current Quarter" regardless of search.
    // So we should find latestQuarter from the FULL `projects` list, to avoid active criteria changing when searching.
    const allQuarters = [...new Set(projects.map(p => p.quarter))];
    const seasonOrder = { 'Winter': 1, 'Spring': 2, 'Summer': 3, 'Fall': 4 };
    const sortQuarters = (a, b) => {
      const [sA, yA] = a.split(' ');
      const [sB, yB] = b.split(' ');
      if (yA !== yB) return parseInt(yB) - parseInt(yA); // Descending year
      return (seasonOrder[sB] || 0) - (seasonOrder[sA] || 0); // Descending season
    };
    allQuarters.sort(sortQuarters);
    const latestQuarter = allQuarters[0];

    let active = filtered.filter(p => p.quarter === latestQuarter);
    let archived = filtered.filter(p => p.quarter !== latestQuarter);

    // Apply Status Filter specifically
    if (filters.status === 'Active') {
      archived = [];
    } else if (filters.status === 'Archived') {
      active = [];
    }

    setActiveProjects(active);
    setArchivedProjects(archived);

  }, [projects, searchQuery, filters]);

  return (
    <div className="container">
      <Header />

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-xl text-gray-500">Loading projects...</div>
        </div>
      ) : (
        <>
          <Controls
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            filters={filters}
            onFilterChange={handleFilterChange}
          />

          <StatsBar
            totalProjects={activeProjects.length + archivedProjects.length}
            activeCount={activeProjects.length}
            archivedCount={archivedProjects.length}
          />

          {/* Active Projects Section */}
          <SectionHeader
            title="Active Projects"
            description="Currently ongoing projects"
          />

          <div className="projects-grid">
            {activeProjects.map((project, index) => (
              <ProjectCard key={index} project={project} onClick={setSelectedProject} />
            ))}
          </div>

          {/* Archive Section */}
          <SectionHeader
            title="Project Archive"
            description="Completed and past projects"
          />

          <div className="projects-grid">
            {archivedProjects.map((project, index) => (
              <ProjectCard key={index} project={project} onClick={setSelectedProject} />
            ))}
          </div>
        </>
      )}

      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}

      <FloatingAddButton onClick={() => setIsCreateModalOpen(true)} />

      {isCreateModalOpen && (
        <CreateProjectModal
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateProject}
        />
      )}
    </div>
  );
};

export default ProjectsDirectory;