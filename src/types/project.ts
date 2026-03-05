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
    slack_channel_id?: string | null;
}
