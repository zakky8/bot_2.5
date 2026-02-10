export interface User {
    id: string;
    platform: 'discord' | 'telegram';
    platformId: string;
    username: string;
    createdAt: Date;
    updatedAt: Date;
}
