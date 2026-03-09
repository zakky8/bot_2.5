export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const escapeMarkdown = (text: string): string => {
  return text.replace(/([_*[\]()~`>#+=|{}.!-])/g, '\\$1');
};

export const truncate = (str: string, length: number): string => {
  return str.length > length ? str.substring(0, length) + '...' : str;
};
