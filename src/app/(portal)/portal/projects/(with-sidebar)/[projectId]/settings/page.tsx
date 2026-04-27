'use client';

import { use, useEffect, useRef, useState } from 'react';
import { FaGithub, FaFigma } from 'react-icons/fa6';
import { SiNotion } from 'react-icons/si';
import { useAuth } from '@/lib/hooks/useAuth';
import {
  getProjectById,
  updateProjectSettings,
  uploadProjectLogo,
} from '@/lib/supabase/projectService';
import { Project } from '@/types/project';
import { Button, Input } from '@/components/portal/ui';

type LinkKey = 'githubUrl' | 'figmaUrl' | 'notionUrl';

interface SettingsField {
  key: LinkKey;
  label: string;
  placeholder: string;
  icon: React.ReactNode;
}

const LINK_FIELDS: SettingsField[] = [
  {
    key: 'githubUrl',
    label: 'GitHub',
    placeholder: 'https://github.com/org/repo',
    icon: <FaGithub className="h-3.5 w-3.5" />,
  },
  {
    key: 'figmaUrl',
    label: 'Figma',
    placeholder: 'https://figma.com/file/...',
    icon: <FaFigma className="h-3.5 w-3.5" />,
  },
  {
    key: 'notionUrl',
    label: 'Notion',
    placeholder: 'https://notion.so/...',
    icon: <SiNotion className="h-3.5 w-3.5" />,
  },
];

function SectionHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-code text-[10px] uppercase tracking-[0.08em] text-ink-400">
        {eyebrow}
      </span>
      <h2 className="font-display text-[20px] font-bold leading-tight text-ink-900">
        {title}
      </h2>
    </div>
  );
}

export default function SettingsPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
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
      setLogoFile(null);
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  if (authLoading || projectLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="font-accent italic text-[14px] text-ink-400">loading…</p>
      </div>
    );
  }

  if (authError || !userId) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-sm text-cl-danger-700">Please sign in to view this page</p>
      </div>
    );
  }

  const linkValueFor = (key: LinkKey): string =>
    key === 'githubUrl' ? githubUrl : key === 'figmaUrl' ? figmaUrl : notionUrl;

  const setLinkValueFor = (key: LinkKey, v: string) => {
    if (key === 'githubUrl') setGithubUrl(v);
    else if (key === 'figmaUrl') setFigmaUrl(v);
    else setNotionUrl(v);
  };

  const logoChanged = logoPreview !== (project?.logoUrl ?? null);

  return (
    <>
      <section className="flex flex-col gap-1">
        <span className="font-code text-[11px] uppercase tracking-[0.08em] text-ink-400">
          project
        </span>
        <h1 className="font-display text-[32px] font-bold leading-tight tracking-[-0.01em] text-ink-900 md:text-[40px]">
          Settings
        </h1>
        <p className="mt-1 text-[14px] text-ink-600">
          Manage project details and external integrations
        </p>
      </section>

      <div className="mt-8 flex max-w-2xl flex-col gap-6">
        <div className="rounded-2xl border border-ink-100 bg-white p-6 md:p-8">
          <SectionHeader eyebrow="branding" title="Project logo" />
          <div className="mt-5 flex items-center gap-6">
            <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border-[1.5px] border-dashed border-ink-300 bg-cream-50">
              {logoPreview ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={logoPreview}
                  alt="Project logo"
                  className="h-full w-full object-contain"
                />
              ) : (
                <span className="font-accent italic text-[12px] text-ink-400">
                  no logo
                </span>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                {logoPreview ? 'Replace logo' : 'Upload image'}
              </Button>
              {logoChanged && (
                <p className="font-code text-[10px] uppercase tracking-[0.06em] text-cl-blue-700">
                  new logo — save to apply
                </p>
              )}
              <p className="font-code text-[10px] uppercase tracking-[0.06em] text-ink-400">
                PNG, JPG, SVG up to 5 MB
              </p>
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

        <div className="rounded-2xl border border-ink-100 bg-white p-6 md:p-8">
          <SectionHeader eyebrow="integrations" title="Project links" />
          <div className="mt-5 flex flex-col gap-5">
            {LINK_FIELDS.map(({ key, label, placeholder, icon }) => (
              <div key={key} className="flex flex-col gap-2">
                <label className="flex items-center gap-2 font-ui text-[13px] font-bold text-ink-900">
                  <span className="text-ink-600">{icon}</span>
                  {label}
                </label>
                <Input
                  type="url"
                  value={linkValueFor(key)}
                  onChange={(e) => setLinkValueFor(key, e.target.value)}
                  placeholder={placeholder}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="primary" size="md" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : 'Save changes'}
          </Button>
          {saveStatus === 'success' && (
            <p className="font-code text-[11px] uppercase tracking-[0.06em] text-cl-lime-700">
              ✓ saved
            </p>
          )}
          {saveStatus === 'error' && (
            <p className="font-code text-[11px] uppercase tracking-[0.06em] text-cl-danger-700">
              failed — try again
            </p>
          )}
        </div>
      </div>
    </>
  );
}
