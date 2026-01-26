export interface AnnouncementType  {
  id: number;
  title: string;
  message: string;
  category: "Exam" | "Event" | "Holiday" | "General" | "Urgent";
  publishedDate: string;
  isPinned: boolean;
};