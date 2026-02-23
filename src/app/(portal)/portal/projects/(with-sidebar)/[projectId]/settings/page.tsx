'use client';

import { use, useEffect, useRef, useState } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
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
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  if (authLoading || projectLoading) {
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
                <p className="text-xs text-black/50">New logo selected — save to apply</p>
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
          {LINK_FIELDS.map(({ key, label, placeholder }) => {
            const value = key === 'githubUrl' ? githubUrl : key === 'figmaUrl' ? figmaUrl : notionUrl;
            const setter = key === 'githubUrl' ? setGithubUrl : key === 'figmaUrl' ? setFigmaUrl : setNotionUrl;
            return (
              <div key={key} className="space-y-1.5">
                <label className="block text-sm font-medium text-black/70">{label}</label>
                <input
                  type="url"
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  placeholder={placeholder}
                  className="w-full rounded-lg border border-[#D4D7E5] px-3 py-2 text-sm text-black placeholder:text-black/30 focus:outline-none focus:ring-2 focus:ring-[#3F86FF]/40"
                />
              </div>
            );
          })}
        </div>

        {/* Save */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2.5 rounded-lg bg-[#3F86FF] text-white text-sm font-semibold hover:bg-[#2d74ee] disabled:opacity-50 transition-colors"
          >
            {saving ? 'Saving…' : 'Save changes'}
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
