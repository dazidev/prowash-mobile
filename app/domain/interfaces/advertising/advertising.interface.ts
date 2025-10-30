// Tipos base
export type AdType = 'TEXT' | 'IMAGE' | 'IMAGE_CAROUSEL' | 'VIDEO';

export interface AdItem {
  id: string;                 // UUID
  type: AdType;
  order: number;              // 1..5
  text: string | null;
  image1: string | null;
  image2: string | null;
  image3: string | null;
  image4: string | null;
  image5: string | null;
  video: string | null;
  createdAt: string;          // ISO 8601
  updatedAt: string;          // ISO 8601
}

export interface AdsResponse {
  success: boolean;
  data: AdItem[];
}
