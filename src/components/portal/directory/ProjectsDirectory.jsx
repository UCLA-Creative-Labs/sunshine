"use client"

import React, { useState } from 'react';
import './ProjectsDirectory.css';
import ProjectCard from './ProjectCard';
import SectionHeader from './SectionHeader';
import StatsBar from './StatsBar';
import Controls from './Controls';
import Header from './Header';
import client from '@/lib/contentfulLib/contentfulClient';

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

  // Sample data - replace with your actual data
  const activeProjects = [
    {
      name: 'Project A',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      leads: [
        { initials: 'JS', color: '#FFB6C1' },
        { initials: 'MK', color: '#ADD8E6' }
      ],
      memberCount: 8,
      quarter: 'Fall 2024'
    },
    {
      name: 'Project B',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      leads: [
        { initials: 'AL', color: '#DDA0DD' },
        { initials: 'RB', color: '#F0E68C' },
        { initials: 'TC', color: '#98FB98' }
      ],
      memberCount: 12,
      quarter: 'Fall 2024'
    },
    {
      name: 'Project C',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      leads: [
        { initials: 'SK', color: '#FFE4B5' }
      ],
      memberCount: 15,
      quarter: 'Fall 2024'
    },
    {
      name: 'Project D',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      leads: [
        { initials: 'DP', color: '#E0BBE4' },
        { initials: 'LN', color: '#FFDAB9' }
      ],
      memberCount: 6,
      quarter: 'Fall 2024'
    }
  ];

  const archivedProjects = [
    {
      name: 'Project E',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      leads: [
        { initials: 'GR', color: '#B4E7CE' },
        { initials: 'MS', color: '#F4C2C2' }
      ],
      memberCount: 15,
      quarter: 'Summer 2024'
    },
    {
      name: 'Project F',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      leads: [
        { initials: 'KL', color: '#C3B1E1' },
        { initials: 'VM', color: '#FFD1DC' },
        { initials: 'BT', color: '#AEC6CF' }
      ],
      memberCount: 7,
      quarter: 'Spring 2024'
    },
    {
      name: 'Project G',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      leads: [
        { initials: 'QZ', color: '#FDFD96' },
        { initials: 'HY', color: '#FFB3BA' }
      ],
      memberCount: 10,
      quarter: 'Spring 2024'
    },
    {
      name: 'Project H',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      leads: [
        { initials: 'XL', color: '#BAFFC9' }
      ],
      memberCount: 5,
      quarter: 'Winter 2024'
    },
    {
      name: 'Project I',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      leads: [
        { initials: 'PR', color: '#FFDFD3' },
        { initials: 'AA', color: '#D4F1F4' }
      ],
      memberCount: 12,
      quarter: 'Winter 2024'
    },
    {
      name: 'Project J',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      leads: [
        { initials: 'CO', color: '#E6E6FA' },
        { initials: 'WT', color: '#FFE4E1' }
      ],
      memberCount: 20,
      quarter: 'Fall 2023'
    }
  ];

  return (
    <div className="container">
      <Header />
      
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
          <ProjectCard key={index} project={project} />
        ))}
      </div>
      
      {/* Archive Section */}
      <SectionHeader
        title="Project Archive"
        description="Completed and past projects"
      />
      
      <div className="projects-grid">
        {archivedProjects.map((project, index) => (
          <ProjectCard key={index} project={project} />
        ))}
      </div>
    </div>
  );
};

export default ProjectsDirectory;