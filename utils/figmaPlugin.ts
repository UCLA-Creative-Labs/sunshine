import { fetchProjectTextEntries } from './contentful';

export const getPageTextEntries = async (projectName: string, pageName: string): Promise<any[]> => {
  const projectPagePrefix = `${projectName}_${pageName}`;
  return fetchProjectTextEntries(projectPagePrefix);
};

export const getTextEntry = (textEntries: any[], id: string, placeholder: string): string => {
  return textEntries.find((item) => item?.figmaId.endsWith(`_${id}`)).shortText || placeholder;
};