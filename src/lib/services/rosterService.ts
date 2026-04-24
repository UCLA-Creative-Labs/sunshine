import { supabase } from '../supabase/client';
import type { AvatarColor } from '@/components/portal/ui';
import { pickAvatarColor } from '@/components/portal/ui';

/**
 * Roster service — shared data fetchers for the public-portal Members page
 * and Directory page. Returns data already shaped to match the UI-layer types
 * in those pages so the components stay presentational.
 */

type InternalTeam =
    | 'presidents'
    | 'senior-advisor'
    | 'projects'
    | 'tech'
    | 'marketing'
    | 'finance'
    | 'design'
    | 'alumni';

export interface Member {
    id: string;
    name: string;
    initials?: string;
    avatarColor: AvatarColor;
    gradYear?: string;
    major?: string;
}

export interface InternalRow {
    member: Member;
    team: InternalTeam;
    title: string;
    isDirector: boolean;
}

export type ProjectPosition = 'lead' | 'pm' | 'member';

export interface ProjectMemberRow {
    member: Member;
    position: ProjectPosition;
    expertise: never[];
}

export interface ProjectGroup {
    id: string;
    name: string;
    initial: string;
    logoColor: AvatarColor;
    quarter: string;
    members: ProjectMemberRow[];
}

export interface DirectoryPerson {
    name: string;
    initials?: string;
    color: AccentColor;
}

type AccentColor = AvatarColor;

export interface DirectoryProject {
    id: string;
    name: string;
    initial: string;
    description: string;
    quarter: string;
    startedAt: number;
    logoColor: AccentColor;
    status: 'active' | 'archived';
    members: DirectoryPerson[];
    overflow: number;
    leads: DirectoryPerson[];
    otherMembers: DirectoryPerson[];
    githubUrl?: string | null;
    figmaUrl?: string | null;
    demoUrl?: string | null;
}

function profileToMember(
    p: {
        id: string;
        first_name: string | null;
        last_name: string | null;
        display_name?: string | null;
        major?: string | null;
        grad_year?: number | null;
    } | null,
): Member | null {
    if (!p) return null;
    const name =
        p.display_name?.trim() ||
        `${p.first_name ?? ''} ${p.last_name ?? ''}`.trim() ||
        'Unknown';
    return {
        id: p.id,
        name,
        avatarColor: pickAvatarColor(name),
        gradYear: p.grad_year != null ? String(p.grad_year) : undefined,
        major: p.major ?? undefined,
    };
}

function roleNameToTeam(roleName: string | null | undefined): InternalTeam {
    const n = (roleName ?? '').toLowerCase();
    if (n.includes('president')) return 'presidents';
    if (n.includes('advisor')) return 'senior-advisor';
    if (n.includes('project')) return 'projects';
    if (n.includes('tech') || n.includes('engineer')) return 'tech';
    if (n.includes('market') || n.includes('outreach')) return 'marketing';
    if (n.includes('finance') || n.includes('treasur')) return 'finance';
    if (n.includes('design') || n.includes('creative')) return 'design';
    if (n.includes('alum')) return 'alumni';
    return 'projects';
}

function roleNameToDirector(roleName: string | null | undefined): boolean {
    const n = (roleName ?? '').toLowerCase();
    return (
        n.includes('director') ||
        n.includes('head') ||
        n.includes('lead') ||
        n.includes('president') ||
        n.includes('advisor')
    );
}

function rbacRoleToPosition(roleName: string | null | undefined): ProjectPosition {
    const n = (roleName ?? '').toLowerCase();
    if (n.includes('lead')) return 'lead';
    if (n.includes('manager') || n === 'pm' || n.includes('product')) return 'pm';
    return 'member';
}

function initialFromName(name: string): string {
    const first = name.trim().charAt(0);
    return (first || '?').toUpperCase();
}

function quarterLabel(year: string | null | undefined, quarter: string | null | undefined): string {
    const yr = typeof year === 'string' ? year.slice(-2) : '';
    const q = typeof quarter === 'string' ? quarter : '';
    return `${q} ${yr}`.trim() || 'unscheduled';
}

function currentAcademicYearString(): string {
    const now = new Date();
    const year = now.getMonth() >= 8 ? now.getFullYear() : now.getFullYear() - 1;
    return String(year);
}

function isProjectActive(year: string | null | undefined): boolean {
    if (!year) return true;
    const current = currentAcademicYearString();
    return year === current || year.startsWith(current.slice(-2));
}

/* ──────────────────────────────────────────────────────────────── */

export async function getInternalRoster(): Promise<InternalRow[]> {
    const { data, error } = await supabase
        .from('user_context_roles')
        .select(`
            user_id,
            context,
            roles:roles!inner(id, name, context),
            user:profiles!user_context_roles_user_id_fkey(id, first_name, last_name, display_name, major, grad_year)
        `)
        .eq('context', 'internal');

    if (error) {
        console.error('Error fetching internal roster:', error);
        return [];
    }

    const rows: InternalRow[] = [];
    for (const r of data ?? []) {
        const roles = (r as any).roles as { name: string } | { name: string }[] | null;
        const roleName = Array.isArray(roles) ? roles[0]?.name : roles?.name;
        const profile = (r as any).user as Parameters<typeof profileToMember>[0];
        const member = profileToMember(profile);
        if (!member || !roleName) continue;
        rows.push({
            member,
            team: roleNameToTeam(roleName),
            title: roleName,
            isDirector: roleNameToDirector(roleName),
        });
    }
    return rows;
}

export async function getProjectRosters(): Promise<ProjectGroup[]> {
    const { data, error } = await supabase
        .from('project_members')
        .select(`
            project_id,
            projects:projects!project_members_project_id_fkey(id, projectName, year, quarter),
            user:profiles!project_members_user_id_fkey(id, first_name, last_name, display_name, major, grad_year),
            rbac_role:roles!project_members_rbac_role_id_fkey(id, name)
        `);

    if (error) {
        console.error('Error fetching project rosters:', error);
        return [];
    }

    const byProject = new Map<string, ProjectGroup>();

    for (const r of data ?? []) {
        const proj = (r as any).projects as
            | { id: string | number; projectName: string; year?: string; quarter?: string }
            | null;
        if (!proj) continue;

        const profile = (r as any).user as Parameters<typeof profileToMember>[0];
        const member = profileToMember(profile);
        if (!member) continue;

        const rbacRole = (r as any).rbac_role as { name?: string } | { name?: string }[] | null;
        const roleName = Array.isArray(rbacRole) ? rbacRole[0]?.name : rbacRole?.name;

        const projId = String(proj.id);
        if (!byProject.has(projId)) {
            byProject.set(projId, {
                id: projId,
                name: proj.projectName,
                initial: initialFromName(proj.projectName),
                logoColor: pickAvatarColor(proj.projectName),
                quarter: quarterLabel(proj.year, proj.quarter),
                members: [],
            });
        }

        byProject.get(projId)!.members.push({
            member,
            position: rbacRoleToPosition(roleName),
            expertise: [],
        });
    }

    return Array.from(byProject.values()).filter((g) => g.members.length > 0);
}

export async function getPublicProjectDirectory(): Promise<DirectoryProject[]> {
    const { data, error } = await supabase.from('projects').select('*');

    if (error || !data) {
        console.error('Error fetching project directory:', error);
        return [];
    }

    return data.map((p: any) => {
        const leadNames: string[] = Array.isArray(p.projectLeads) ? p.projectLeads : [];
        const memberNames: string[] = Array.isArray(p.projectMembers) ? p.projectMembers : [];

        const leads: DirectoryPerson[] = leadNames.map((name: string) => ({
            name,
            color: pickAvatarColor(name),
        }));
        const otherMembers: DirectoryPerson[] = memberNames.map((name: string) => ({
            name,
            color: pickAvatarColor(name),
        }));

        const clusterNames = [...leadNames, ...memberNames];
        const shown = clusterNames.slice(0, 3);
        const overflow = Math.max(0, clusterNames.length - shown.length);

        return {
            id: String(p.id),
            name: p.projectName,
            initial: initialFromName(p.projectName),
            description: p.projectDescription ?? '',
            quarter: quarterLabel(p.year, p.quarter),
            startedAt: Number(p.id) || 0,
            logoColor: pickAvatarColor(p.projectName),
            status: isProjectActive(p.year) ? 'active' : 'archived',
            members: shown.map((name: string) => ({
                name,
                color: pickAvatarColor(name),
            })),
            overflow,
            leads,
            otherMembers,
            githubUrl: p.githubUrl ?? null,
            figmaUrl: p.figmaUrl ?? null,
            demoUrl: p.demoDayUrl ?? p.prototypeUrl ?? null,
        };
    });
}
