import { Context } from 'grammy';
import { I18nFlavor } from '@grammyjs/i18n';

export interface SessionData {
  captcha: {
    enabled: boolean;
    mode: 'button' | 'math' | 'text';
    text?: string;
    kickTime?: number;
  };
  locks: {
    all?: boolean;
    media?: boolean;
    stickers?: boolean;
    links?: boolean;
    polls?: boolean;
    invite?: boolean;
    info?: boolean;
    pin?: boolean;
  };
  stickerSet?: string;
  language: string;
  userData: Record<string, unknown>;
}

export type BotContext = Context & I18nFlavor & {
  session: SessionData;
};

export interface Command {
  name: string;
  description: string;
  category: string;
  adminOnly?: boolean;
}
