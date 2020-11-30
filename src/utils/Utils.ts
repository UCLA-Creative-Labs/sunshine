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
      instagram
    }
  }
}`