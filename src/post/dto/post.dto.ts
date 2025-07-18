import { HashTag } from '@prisma/client';

export type BrandMetaType = string;
export type CrewMetaType = string;

export interface UserDto {
  id?: string;
  email?: string;
  username?: string;
  bio?: string;
  imageUrl?: string;
  website?: string;
  backgroundUrl?: string;
  role?: string;
  followerCount?: number;
  followingCount?: number;
  avatarUrl?: string;
}

export interface CrewDto {
  id: string;
  name: string;
  avatarUrl?: string;
  profileImage?: string;
  coverImage?: string;
  memberCount?: number;
  description?: string;
  tags?: string[];
  links?: Array<{ title: string; url: string }>;
  ownerId?: string;
  followers?: any[];
  members?: any[];
  upcomingEvent?: { title: string; date: string };
}

export interface PostDto {
  id: string | number;
  title: string;
  content?: string;
  hashtags?: (HashTag & {
    postId: string;
    hashTagId: string;
  })[];
  author?: UserDto;
  createdAt?: string;
  crewName?: string;
  likes?: number;
  comments?: number;
  image?: string;
  date?: string;
  views?: number;
  tags?: string[];
  crew?: CrewDto[];
  likeCount?: number;
  commentCount?: number;
  type?: string;
  brandMetaType?: BrandMetaType;
  crewMetaType?: CrewMetaType;
  subtitle?: string;
  imageUrl?: string;
}
