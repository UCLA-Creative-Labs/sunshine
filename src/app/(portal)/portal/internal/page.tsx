import { redirect } from 'next/navigation';

export default function InternalPage() {
  redirect('/portal/internal/projects');
}
