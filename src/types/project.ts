export interface Project {
    id: string;
    year: string;
    quarter: string;
    projectName: string;
    projectLeads: string[] | null;
    projectDescription: string;
    projectManagers: string[] | null;
    projectMembers: string[] | null;
    logoUrl?: string;
    prototypeUrl?: string;
    demoDayUrl?: string;
    instaPostUrl?: string;
}