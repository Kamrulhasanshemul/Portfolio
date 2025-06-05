export interface BlogPost {
  id?: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: BlogCategory;
  tags: string[];
  author: string;
  status: 'draft' | 'published' | 'archived';
  featured_image?: string;
  meta_description?: string;
  reading_time?: number;
  views?: number;
  created_at?: string;
  updated_at?: string;
  published_at?: string;
}

export type BlogCategory = 'personal' | 'travel' | 'tech' | 'journey' | 'tutorial' | 'review';

export interface BlogCategoryConfig {
  label: string;
  color: string;
  icon: string;
  description: string;
}

export const blogCategories: Record<BlogCategory, BlogCategoryConfig> = {
  personal: {
    label: 'Personal',
    color: 'bg-purple-100 text-purple-800',
    icon: 'User',
    description: 'Personal thoughts and experiences'
  },
  travel: {
    label: 'Travel',
    color: 'bg-blue-100 text-blue-800',
    icon: 'MapPin',
    description: 'Travel stories and adventures'
  },
  tech: {
    label: 'Tech',
    color: 'bg-green-100 text-green-800',
    icon: 'Code',
    description: 'Technology insights and tutorials'
  },
  journey: {
    label: 'Journey',
    color: 'bg-orange-100 text-orange-800',
    icon: 'Compass',
    description: 'Life and career journey experiences'
  },
  tutorial: {
    label: 'Tutorial',
    color: 'bg-indigo-100 text-indigo-800',
    icon: 'BookOpen',
    description: 'Step-by-step guides and how-tos'
  },
  review: {
    label: 'Review',
    color: 'bg-pink-100 text-pink-800',
    icon: 'Star',
    description: 'Product and service reviews'
  }
}; 