export interface Project {
    id: number;
    year: string;
    quarter: string;
    projectName: string;
    projectLeads: string[];
    projectDescription: string;
    projectManagers: string[];
    projectMembers: string[];
    logoUrl?: string;
    prototypeUrl?: string;
    demoDayUrl?: string;
    instaPostUrl?: string;
}
