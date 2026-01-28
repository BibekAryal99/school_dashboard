export interface Setting {
  id: number;
  userId: string;
  notificationsEnabled: boolean;
  theme: "Light" | "Dark" | "Auto";
  language: string;
  privacy: "Public" | "Private";
  twoFactorAuth: boolean;
  lastModified: string;
}
