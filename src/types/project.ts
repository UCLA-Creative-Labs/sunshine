export interface Project {
    id: number;
    year: string;
    quarter: string;
    projectName: string;
    projectLeads: string[];
    projectDescription: string;
    projectManagers: string[] | null;
    projectMembers: string[] | null;
    logoUrl?: string | null;
    githubUrl?: string | null;
    figmaUrl?: string | null;
    notionUrl?: string | null;
    prototypeUrl?: string;
    demoDayUrl?: string;
    instaPostUrl?: string;
    // GitHub integration fields
    github_pat_encrypted?: string | null;
    github_pat_updated_at?: string | null;
}
