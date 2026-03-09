import { BotContext } from '../types';

export const isAdmin = async (ctx: BotContext): Promise<boolean> => {
  if (!ctx.chat || !ctx.from) return false;

  try {
    const member = await ctx.getChatMember(ctx.from.id);
    return ['creator', 'administrator'].includes(member.status);
  } catch {
    return false;
  }
};

export const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours}h ${minutes}m ${secs}s`;
};

export const escapeHtml = (text: string): string => {
  return text.replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
};
