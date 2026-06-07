export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  tags: string[];
  imageUrl: string;
  featured?: boolean;
}

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Akashic Reading: A Simple Way to Understand Your Life Better',
    excerpt: "In today's fast-moving life, it's normal to feel confused, stuck, or unsure about the path you're on. Akashic Reading is a gentle and insightful way to access your inner wisdom and understand your life on a deeper level.",
    content: 'full',
    author: 'Rekha Bala',
    date: 'June 7, 2026',
    readTime: '5 min read',
    category: 'Akashic Reading',
    tags: ['Akashic Reading', 'Soul Wisdom', 'Healing', 'Clarity'],
    imageUrl: '',
    featured: true,
  },
];
