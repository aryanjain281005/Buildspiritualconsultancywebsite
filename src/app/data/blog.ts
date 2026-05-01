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
    title: 'What Are the Akashic Records? A Beginner\'s Guide',
    excerpt: 'Discover the ancient wisdom behind the cosmic library of the soul — the Akashic Records — and how accessing them can transform your life\'s journey.',
    content: 'The Akashic Records are often described as an energetic database or cosmic library that contains a complete record of every soul\'s journey across all lifetimes, dimensions, and possibilities...',
    author: 'Akaashic Team',
    date: 'April 15, 2024',
    readTime: '7 min read',
    category: 'Fundamentals',
    tags: ['Akashic Records', 'Soul Journey', 'Spiritual Wisdom', 'Beginner Guide'],
    imageUrl: 'https://images.unsplash.com/photo-1769406525627-badf92979131?w=800&q=80',
    featured: true,
  },
  {
    id: '2',
    title: 'How to Prepare for Your First Akaashic Reading',
    excerpt: 'Your first Akaashic reading can be a profound experience. Learn how to prepare yourself mentally, emotionally, and spiritually to receive the deepest wisdom.',
    content: 'Preparing for an Akashic reading is about creating an open, receptive state within yourself. The more grounded and clear you are, the deeper the insights you\'ll receive...',
    author: 'Akaashic Team',
    date: 'March 28, 2024',
    readTime: '5 min read',
    category: 'Guidance',
    tags: ['First Reading', 'Preparation', 'Tips', 'Sessions'],
    imageUrl: 'https://images.unsplash.com/photo-1764272620010-64cb1f370d1b?w=800&q=80',
  },
  {
    id: '3',
    title: 'The Power of Past Life Regression for Healing',
    excerpt: 'Past life regression through the Akashic Records offers a profound pathway to healing recurring patterns, unexplained fears, and deep soul wounds.',
    content: 'Many of us carry wounds, fears, and patterns that seem to have no rational explanation in our current lifetime. Past life regression through the Akashic Records...',
    author: 'Akaashic Team',
    date: 'March 10, 2024',
    readTime: '8 min read',
    category: 'Healing',
    tags: ['Past Lives', 'Regression', 'Healing', 'Karmic Patterns'],
    imageUrl: 'https://images.unsplash.com/photo-1607773709367-06b7a91f7e4a?w=800&q=80',
  },
  {
    id: '4',
    title: '5 Signs You May Need an Energy Clearance',
    excerpt: 'Energy blocks can silently affect your relationships, career, health, and creativity. Discover the common signs and how Akaashic-based clearing can help.',
    content: 'Energy clearance is one of the most transformative services we offer. Many people don\'t realize that energetic imprints from past experiences — and even past lives — can...',
    author: 'Akaashic Team',
    date: 'February 22, 2024',
    readTime: '6 min read',
    category: 'Energy Work',
    tags: ['Energy Clearance', 'Healing', 'Energy Blocks', 'Soul Alignment'],
    imageUrl: 'https://images.unsplash.com/photo-1768569446272-1e62ab6cb976?w=800&q=80',
  },
  {
    id: '5',
    title: 'Understanding Soul Contracts and Life Purpose',
    excerpt: 'Your soul chose this lifetime with specific contracts and agreements. Through Akaashic reading, you can discover your true soul\'s mission and the relationships that shape your destiny.',
    content: 'Soul contracts are agreements made at the soul level before incarnation. These contracts influence our relationships, life challenges, and the lessons we\'re here to learn...',
    author: 'Akaashic Team',
    date: 'February 5, 2024',
    readTime: '9 min read',
    category: 'Soul Journey',
    tags: ['Soul Contracts', 'Life Purpose', 'Soul Mission', 'Relationships'],
    imageUrl: 'https://images.unsplash.com/photo-1612066473428-fb6833a0d855?w=800&q=80',
  },
  {
    id: '6',
    title: 'Meditation Practices to Enhance Your Spiritual Sensitivity',
    excerpt: 'Developing your intuitive abilities requires consistent practice. Explore the meditation techniques used in our courses to open and strengthen your spiritual channels.',
    content: 'Meditation is the foundation of all Akaashic work. Before you can effectively read the records, you need to cultivate a calm, focused, and receptive inner state...',
    author: 'Akaashic Team',
    date: 'January 18, 2024',
    readTime: '6 min read',
    category: 'Practice',
    tags: ['Meditation', 'Intuition', 'Spiritual Practice', 'Development'],
    imageUrl: 'https://images.unsplash.com/photo-1764192114257-ae9ecf97eb6f?w=800&q=80',
  },
];