export interface User {
  id: string;
  username?: string;
  first_name: string;
  language_code?: string;
  created_at: Date;
}

export interface Guild {
  id: string;
  name: string;
  settings: Record<string, any>;
  created_at: Date;
}

export interface Command {
  name: string;
  description: string;
  category: string;
  usage?: string;
}
