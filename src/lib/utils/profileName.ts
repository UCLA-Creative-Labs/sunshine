import { Profiles } from '../types/database';

type ProfileNameSource = Pick<Profiles, 'email' | 'first_name' | 'last_name'>;

export function getProfileDisplayName(profile?: ProfileNameSource | null): string {
  if (!profile) return 'Unknown';
  const fullName = [profile.first_name, profile.last_name].filter(Boolean).join(' ').trim();
  if (fullName) return fullName;
  return profile.email?.split('@')[0] || 'Unknown';
}

export function getProfileFirstName(profile?: ProfileNameSource | null): string {
  if (!profile) return 'Unknown';
  const firstName = profile.first_name;
  if (firstName) return firstName;
  return profile.email?.split('@')[0] || 'Unknown';
}