export const formatEmail = (email: string): string => {
  // remove trailing white spaces in email
  if (!email) return email;
  const trimmed = email.trim();

  if (!trimmed) return trimmed;
  // remove any other spaces
  const removedSpaces = trimmed.replace(/\s/g, '');

  if (!removedSpaces) return removedSpaces;

  // convert to lowercase
  return removedSpaces.toLowerCase();
};

export const capitalize = (str: string): string => {
  if (!str) return str;
  return str
    .trim()
    .toLowerCase()
    .replace('_', ' ')
    .replace(/^\w/, (c) => c.toUpperCase());
};

export const formatFileName = (fileName: string): string => {
  if (!fileName) return fileName;
  return fileName.replace(/ /g, '-');
};

