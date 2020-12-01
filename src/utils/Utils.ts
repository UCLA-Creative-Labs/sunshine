export interface Sheet {
  notification?: string,
  invite?: string,
}

export interface Person {
  name: string;
  class: number;
  roles: string[];
  image?: string;
  link?: string;
}

export const roles_index = [
  'Executive Director', 'Design Director', 'External Director',
  'Projects Director', 'Tech Director', 'Designer', 'Developer',
  'External', 'Projects'];

export function openWindow(url: string): void{
  const win = window.open(url, '_blank');
  if (win != null) win.focus();
}

export const query = `{
  teamMembersCollection {
    items {
      name
      class
      roles
      photo {
        url
      }
      website
      github
      instagram
    }
  }
}`;