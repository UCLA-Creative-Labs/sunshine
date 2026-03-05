'use client';

import { use, useEffect, useRef, useState } from 'react';
import { FaGithub, FaEye, FaEyeSlash, FaCheck, FaExclamationTriangle, FaTrash } from 'react-icons/fa';
import { useAuth } from '@/lib/hooks/useAuth';
import { useUserRole } from '@/lib/hooks/useUserRole';
import { useGitHubIntegration } from '@/lib/hooks/useGitHubIntegration';
import { getProjectById, updateProjectSettings, uploadProjectLogo } from '@/lib/supabase/projectService';
import { Project } from '@/types/project';

interface SettingsField {
  key: keyof Pick<Project, 'githubUrl' | 'figmaUrl' | 'notionUrl'>;
  label: string;
  placeholder: string;
}

const LINK_FIELDS: SettingsField[] = [
  { key: 'githubUrl', label: 'GitHub URL', placeholder: 'https://github.com/org/repo' },
  { key: 'figmaUrl', label: 'Figma URL', placeholder: 'https://figma.com/file/...' },
  { key: 'notionUrl', label: 'Notion URL', placeholder: 'https://notion.so/...' },
];

export default function SettingsPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = use(params);
  const { userId, isLoading: authLoading, error: authError } = useAuth();
  const { canPostEvents, isLoading: roleLoading } = useUserRole(projectId, userId);

  // Determine if user is project lead based on canPostEvents permission
  const isProjectLead = canPostEvents;

  const [project, setProject] = useState<Project | null>(null);
  const [projectLoading, setProjectLoading] = useState(true);

  const [githubUrl, setGithubUrl] = useState('');
  const [figmaUrl, setFigmaUrl] = useState('');
  const [notionUrl, setNotionUrl] = useState('');

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // GitHub integration state
  const [showPATInput, setShowPATInput] = useState(false);
  const [patValue, setPatValue] = useState('');
  const [showPAT, setShowPAT] = useState(false);
  const [patSaving, setPatSaving] = useState(false);
  const [patError, setPatError] = useState<string | null>(null);
  const [patSuccess, setPatSuccess] = useState<string | null>(null);

  const {
    patStatus,
    isLoading: patStatusLoading,
    savePAT,
    removePAT,
    refreshStatus,
  } = useGitHubIntegration(projectId);

  useEffect(() => {
    if (!projectId) return;
    const load = async () => {
      setProjectLoading(true);
      const data = await getProjectById(projectId);
      setProject(data);
      if (data) {
        setGithubUrl(data.githubUrl ?? '');
        setFigmaUrl(data.figmaUrl ?? '');
        setNotionUrl(data.notionUrl ?? '');
        setLogoPreview(data.logoUrl ?? null);
      }
      setProjectLoading(false);
    };
    load();
  }, [projectId]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveStatus('idle');

    let logoUrl = project?.logoUrl ?? null;

    if (logoFile) {
      const uploaded = await uploadProjectLogo(projectId, logoFile);
      if (uploaded) logoUrl = uploaded;
    }

    const updated = await updateProjectSettings(projectId, {
      githubUrl: githubUrl || null,
      figmaUrl: figmaUrl || null,
      notionUrl: notionUrl || null,
      logoUrl,
    });

    setSaving(false);
    setSaveStatus(updated ? 'success' : 'error');

    if (updated) {
      setProject(updated);
      // Refresh GitHub integration status in case githubUrl changed
      refreshStatus();
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const handleSavePAT = async () => {
    if (!patValue.trim()) {
      setPatError('Please enter a valid GitHub Personal Access Token');
      return;
    }

    setPatSaving(true);
    setPatError(null);
    setPatSuccess(null);

    const result = await savePAT(patValue);

    setPatSaving(false);

    if (result.success) {
      setPatSuccess('GitHub token saved successfully!');
      setPatValue('');
      setShowPATInput(false);
      setTimeout(() => setPatSuccess(null), 3000);
    } else {
      setPatError(result.error ?? 'Failed to save token');
    }
  };

  const handleRemovePAT = async () => {
    if (!confirm('Are you sure you want to remove the GitHub integration? You will need to re-add the token to view PRs and issues.')) {
      return;
    }

    setPatSaving(true);
    setPatError(null);

    const result = await removePAT();

    setPatSaving(false);

    if (result.success) {
      setPatSuccess('GitHub token removed');
      setTimeout(() => setPatSuccess(null), 3000);
    } else {
      setPatError(result.error ?? 'Failed to remove token');
    }
  };

  if (authLoading || projectLoading || roleLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-sm text-black/50">Loading...</p>
      </div>
    );
  }

  if (authError || !userId) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-sm text-red-500">Please sign in to view this page</p>
      </div>
    );
  }

  return (
    <>
      <section className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-black">Settings</h1>
        <p className="text-sm text-black/50">Manage your project details and integrations</p>
      </section>

      <div className="mt-8 space-y-8 max-w-2xl">

        {/* Logo */}
        <div className="rounded-2xl border border-[#D4D7E5] bg-white p-6 md:p-8 space-y-4">
          <h2 className="text-xl font-semibold text-black">Project Logo</h2>
          <div className="flex items-center gap-6">
            {logoPreview && (
              <div className="h-20 w-20 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logoPreview}
                  alt="Project logo"
                  className="h-full w-full object-contain"
                />
              </div>
            )}
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 rounded-lg border border-[#D4D7E5] text-sm font-medium text-black hover:bg-gray-50 transition-colors"
              >
                Upload image
              </button>
              {logoPreview && logoPreview !== (project?.logoUrl ?? null) && (
                <p className="text-xs text-black/50">New logo selected - save to apply</p>
              )}
              <p className="text-xs text-black/40">PNG, JPG, SVG up to 5 MB</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleLogoChange}
            />
          </div>
        </div>

        {/* Links */}
        <div className="rounded-2xl border border-[#D4D7E5] bg-white p-6 md:p-8 space-y-5">
          <h2 className="text-xl font-semibold text-black">Project Links</h2>
          {LINK_FIELDS.map((field) => {
            const value = field.key === 'githubUrl' ? githubUrl : field.key === 'figmaUrl' ? figmaUrl : notionUrl;
            const setter = field.key === 'githubUrl' ? setGithubUrl : field.key === 'figmaUrl' ? setFigmaUrl : setNotionUrl;
            return (
              <div key={field.key} className="space-y-1.5">
                <label className="block text-sm font-medium text-black/70">{field.label}</label>
                <input
                  type="url"
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full rounded-lg border border-[#D4D7E5] px-3 py-2 text-sm text-black placeholder:text-black/30 focus:outline-none focus:ring-2 focus:ring-[#3F86FF]/40"
                />
              </div>
            );
          })}
        </div>

        {/* GitHub Integration */}
        <div className="rounded-2xl border border-[#D4D7E5] bg-white p-6 md:p-8 space-y-5">
          <div className="flex items-center gap-3">
            <FaGithub className="h-6 w-6" />
            <h2 className="text-xl font-semibold text-black">GitHub Integration</h2>
          </div>

          {patStatusLoading ? (
            <p className="text-sm text-black/50">Loading GitHub status...</p>
          ) : patStatus?.hasPAT ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-green-600">
                <FaCheck className="h-4 w-4" />
                <span>Repository connected</span>
              </div>

              {patStatus.githubUrl && (
                <p className="text-sm text-black/70">
                  Connected to:{' '}
                  <a
                    href={patStatus.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#3F86FF] hover:underline"
                  >
                    {patStatus.githubUrl}
                  </a>
                </p>
              )}

              {patStatus.updatedAt && (
                <p className="text-xs text-black/50">
                  Token last updated: {new Date(patStatus.updatedAt).toLocaleDateString()}
                </p>
              )}

              {isProjectLead && (
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowPATInput(!showPATInput)}
                    className="px-4 py-2 rounded-lg border border-[#D4D7E5] text-sm font-medium text-black hover:bg-gray-50 transition-colors"
                  >
                    Update token
                  </button>
                  <button
                    type="button"
                    onClick={handleRemovePAT}
                    disabled={patSaving}
                    className="px-4 py-2 rounded-lg border border-red-200 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                  >
                    <FaTrash className="inline mr-2 h-3 w-3" />
                    Remove
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-black/70">
                Connect your GitHub repository to view pull requests and issues in your project dashboard.
              </p>

              {isProjectLead ? (
                <>
                  {!patStatus?.githubUrl && (
                    <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
                      <FaExclamationTriangle className="h-4 w-4" />
                      <span>Please set a GitHub URL in the Project Links section above first.</span>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => setShowPATInput(true)}
                    disabled={!patStatus?.githubUrl}
                    className="px-4 py-2 rounded-lg bg-[#24292e] text-white text-sm font-medium hover:bg-[#1a1e22] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaGithub className="inline mr-2 h-4 w-4" />
                    Connect GitHub Repository
                  </button>
                </>
              ) : (
                <p className="text-sm text-black/50">
                  Only project leads can configure the GitHub integration.
                </p>
              )}
            </div>
          )}

          {/* PAT Input Form */}
          {showPATInput && isProjectLead && (
            <div className="mt-4 pt-4 border-t border-[#D4D7E5] space-y-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-black/70">
                  GitHub Personal Access Token
                </label>
                <div className="relative">
                  <input
                    type={showPAT ? 'text' : 'password'}
                    value={patValue}
                    onChange={(e) => setPatValue(e.target.value)}
                    placeholder="ghp_xxxxxxxxxxxx"
                    className="w-full rounded-lg border border-[#D4D7E5] px-3 py-2 pr-10 text-sm text-black placeholder:text-black/30 focus:outline-none focus:ring-2 focus:ring-[#3F86FF]/40"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPAT(!showPAT)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-black/40 hover:text-black/70"
                  >
                    {showPAT ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-xs text-black/50">
                  Create a token with <code className="bg-gray-100 px-1 rounded">repo</code> scope at{' '}
                  <a
                    href="https://github.com/settings/tokens/new"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#3F86FF] hover:underline"
                  >
                    GitHub Settings
                  </a>
                </p>
              </div>

              {patError && <p className="text-sm text-red-500">{patError}</p>}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleSavePAT}
                  disabled={patSaving || !patValue.trim()}
                  className="px-4 py-2 rounded-lg bg-[#3F86FF] text-white text-sm font-semibold hover:bg-[#2d74ee] disabled:opacity-50 transition-colors"
                >
                  {patSaving ? 'Saving...' : 'Save token'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPATInput(false);
                    setPatValue('');
                    setPatError(null);
                  }}
                  className="px-4 py-2 rounded-lg border border-[#D4D7E5] text-sm font-medium text-black hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {patSuccess && <p className="text-sm text-green-600">{patSuccess}</p>}
        </div>

        {/* Save */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2.5 rounded-lg bg-[#3F86FF] text-white text-sm font-semibold hover:bg-[#2d74ee] disabled:opacity-50 transition-colors"
          >
            {saving ? 'Saving...' : 'Save changes'}
          </button>
          {saveStatus === 'success' && (
            <p className="text-sm text-green-600">Changes saved!</p>
          )}
          {saveStatus === 'error' && (
            <p className="text-sm text-red-500">Failed to save. Please try again.</p>
          )}
        </div>
      </div>
    </>
  );
}
