export interface Analytics {
  id: number;
  subject: string;
  averageScore: number;
  strength: string;
  weakness: string;
  overallPerformance: "Excellent" | "Good" | "Average" | "Below Average";
  date: string;
}
