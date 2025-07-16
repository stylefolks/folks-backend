export interface CrewSummaryDto {
  id: string;
  name: string;
  coverImage?: string;
  tags: string[];
  memberCount: number;
  upcomingEvent?: { title: string; date: string };
}
