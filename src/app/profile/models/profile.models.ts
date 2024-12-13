export interface Profile {
  id: number;
  name?: string;
  bio?: string;
  birthdate?: Date;
  pictureUrl?: string;
  location?: string;
  interests?: string[];
  website?: string;
  socialLinks?: { [key: string]: string };
  joinedAt?: Date;
  lastActive?: Date;
  theme?: string;
  userId?: number;
}
