import { z } from "zod";

export const settingSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  notificationsEnabled: z.boolean(),
  theme: z.enum(["Light", "Dark", "Auto"]),
  language: z.string().min(2, "Language is required"),
  privacy: z.enum(["Public", "Private"]),
  twoFactorAuth: z.boolean(),
  lastModified: z.string().min(1, "Last modified date is required"),
});

export type SettingFormData = z.infer<typeof settingSchema>;
