export interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  price: string;
  originalPrice?: string;
  emoji: string;
  category: string;
  features: string[];
  popular?: boolean;
  color: string;
}

export const courses: Course[] = [
  {
    id: '1',
    title: 'Akashic Foundation Course',
    description: 'Begin your sacred journey into the Akashic Records. Learn foundational concepts, opening meditations, and basic channeling techniques to access cosmic wisdom.',
    duration: '4 Weeks',
    level: 'Beginner',
    price: '₹4,999',
    originalPrice: '₹7,999',
    emoji: '✨',
    category: 'Foundation',
    features: ['8 Live Sessions', 'Study Workbook', 'Guided Meditations', 'Certificate', 'Community Access', 'Lifetime Recordings'],
    color: 'from-violet-500 to-purple-600',
  },
  {
    id: '2',
    title: 'Intermediate Reading Mastery',
    description: 'Deepen your reading practice with advanced techniques for soul contract exploration, karmic patterns, and multidimensional channeling for self and others.',
    duration: '6 Weeks',
    level: 'Intermediate',
    price: '₹7,999',
    originalPrice: '₹12,999',
    emoji: '🌙',
    category: 'Mastery',
    features: ['12 Live Sessions', 'Practice Partner Sessions', 'Case Studies', 'Certificate', 'Group Mentorship', 'Resource Library'],
    popular: true,
    color: 'from-indigo-500 to-violet-600',
  },
  {
    id: '3',
    title: 'Advanced Soul Mapping',
    description: 'Master the art of comprehensive soul blueprint readings, life purpose mapping, and accessing the higher councils of the Akashic dimension.',
    duration: '8 Weeks',
    level: 'Advanced',
    price: '₹12,999',
    originalPrice: '₹19,999',
    emoji: '🌟',
    category: 'Advanced',
    features: ['16 Live Sessions', '1:1 Mentorship Calls', 'Client Practice', 'Advanced Certificate', 'Priority Support', 'Business Module'],
    color: 'from-purple-600 to-pink-600',
  },
  {
    id: '4',
    title: 'Healing & Energy Clearance',
    description: 'Learn powerful Akashic-based healing techniques to clear karmic imprints, release energy blocks, and restore soul alignment for yourself and your clients.',
    duration: '3 Weeks',
    level: 'All Levels',
    price: '₹3,999',
    originalPrice: '₹5,999',
    emoji: '💫',
    category: 'Healing',
    features: ['6 Live Sessions', 'Healing Scripts', 'Clearance Protocols', 'Certificate', 'Practice Community', 'Monthly Support Call'],
    color: 'from-teal-500 to-cyan-600',
  },
  {
    id: '5',
    title: 'Past Life Regression',
    description: 'Explore your soul\'s journey across lifetimes. Understand recurring patterns, discover hidden talents, and heal ancestral wounds through guided regression.',
    duration: '5 Weeks',
    level: 'Intermediate',
    price: '₹9,999',
    originalPrice: '₹14,999',
    emoji: '🔮',
    category: 'Regression',
    features: ['10 Live Sessions', 'Personal Regression', 'Case Studies', 'Certificate', 'Peer Group Sessions', 'Integration Coaching'],
    color: 'from-rose-500 to-purple-600',
  },
  {
    id: '6',
    title: 'Akashic Channel Opening',
    description: 'A gentle, supportive program designed to safely open your Akashic channel through breath work, sacred prayers, and consciousness expansion practices.',
    duration: '2 Weeks',
    level: 'Beginner',
    price: '₹2,999',
    originalPrice: '₹4,499',
    emoji: '🌸',
    category: 'Awakening',
    features: ['4 Live Sessions', 'Opening Prayer Booklet', 'Daily Practices', 'Certificate', 'Beginner Community', 'Email Support'],
    color: 'from-amber-500 to-orange-500',
  },
];