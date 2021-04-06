export interface Person {
  name: string;
  class: number;
  roles: string[];
  image: string;
  link?: string;
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

export const fetchTeam = async (): Promise<any[] | undefined> => {
  const res = await fetch(`https://graphql.contentful.com/content/v1/spaces/${process.env.SPACE_ID}/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.CONTENTFUL_ACCESS_TOKEN}`,
    },
    body: JSON.stringify({query}),
  });
  const {data} = await res.json();
  return data?.teamMembersCollection?.items ?? [];
};