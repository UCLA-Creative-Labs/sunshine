"use client";

interface ProjectLayoutProps {
  children: React.ReactNode;
  params: Promise<{ projectId: string }>;
}

export default function ProjectLayout({ children }: ProjectLayoutProps) {
  return <>{children}</>;
}
