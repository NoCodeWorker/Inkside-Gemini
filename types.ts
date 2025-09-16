import type { User } from 'firebase/auth';
import type { Timestamp } from 'firebase/firestore';

export enum TattooStyle {
  TSHIRT_DESIGN = 'TSHIRT_DESIGN',
  REALISM = 'REALISM',
  TRADITIONAL = 'TRADITIONAL',
  NEO_TRADITIONAL = 'NEO_TRADITIONAL',
  JAPANESE = 'JAPANESE',
  TRIBAL = 'TRIBAL',
  BLACKWORK = 'BLACKWORK',
  GEOMETRIC = 'GEOMETRIC',
  WATERCOLOR = 'WATERCOLOR',
  MINIMALIST = 'MINIMALIST',
  SKETCH = 'SKETCH',
  ANIME_MANGA = 'ANIME_MANGA',
  BIOMECHANICAL = 'BIOMECHANICAL',
  LETTERING = 'LETTERING',
}

export enum ColorChoice {
  BLACK_AND_GREY = 'BLACK_AND_GREY',
  FULL_COLOR = 'FULL_COLOR',
  ACCENT_COLOR = 'ACCENT_COLOR',
}

export interface UserProfile {
  email: string;
  credits: number;
}

export interface SavedDesign {
  id: string;
  imageUrl: string;
  prompt: string;
  style: TattooStyle;
  createdAt: Timestamp;
}