const query = async (query: string): Promise<any | undefined> => {
  const res = await fetch(`https://graphql.contentful.com/content/v1/spaces/${process.env.SPACE_ID}/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.CONTENTFUL_ACCESS_TOKEN}`,
    },
    body: JSON.stringify({query}),
  });
  return await res.json();
}

export interface Person {
  name: string;
  class: number;
  roles: string[];
  image: string;
  link?: string;
}

export const teamMemberQuery = `{
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

export const fetchTeam = async (): Promise<any[] | undefined> => {
  const {data} = await query(teamMemberQuery);
  return data?.teamMembersCollection?.items ?? [];
};

export interface Project {
  title: string;
  pleads: string[];
  quarter: string;
  img: string;
  description: string;
}

export const projectsQuery = `{
  projectsCollection {
    items {
      projectTitle
      projectLeads
      projectQuarter
      photo {
        url
      }
      description {
        json
      }
    }
  }
}`;

export const fetchProjects = async (): Promise<any[] | undefined> => {
  const {data} = await query(projectsQuery);
  return data?.projectsCollection?.items ?? [];
};