export interface Message {
  id: number;
  title: string;
  content: string;
  sender: string;
  date: string;
  priority: "High" | "Medium" | "Low";
  isRead: boolean;
}
