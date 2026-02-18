export interface Project {
    id: string;
    year: string;
    quarter: string;
    projectName: string;
    projectLeads: string[] | null;
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
}