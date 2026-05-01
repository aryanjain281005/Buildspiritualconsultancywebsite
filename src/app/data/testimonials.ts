export interface Testimonial {
  id: string;
  name: string;
  role: string;
  location: string;
  rating: number;
  review: string;
  initials: string;
  color: string;
  date: string;
  service: string;
}

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Priya Sharma',
    role: 'Holistic Wellness Coach',
    location: 'Mumbai, India',
    rating: 5,
    review: 'My Akaashik reading with this team was absolutely life-changing. The clarity I received about my soul\'s purpose was beyond anything I had imagined. I finally understand why I\'ve been going through the struggles I have, and I feel empowered to move forward. Deeply grateful!',
    initials: 'PS',
    color: 'from-purple-400 to-violet-600',
    date: 'March 2024',
    service: 'Personal Reading',
  },
  {
    id: '2',
    name: 'Rahul Mehta',
    role: 'Entrepreneur',
    location: 'Pune, India',
    rating: 5,
    review: 'I enrolled in the Advanced Soul Mapping course and it completely transformed my perspective on life and business. The depth of knowledge and the compassionate guidance I received is unparalleled. Every session felt sacred and powerful. I recommend this to anyone seeking deeper understanding.',
    initials: 'RM',
    color: 'from-indigo-400 to-blue-600',
    date: 'February 2024',
    service: 'Advanced Soul Mapping',
  },
  {
    id: '3',
    name: 'Anita Patel',
    role: 'Yoga Instructor',
    location: 'Ahmedabad, India',
    rating: 5,
    review: 'The healing & energy clearance session helped me release blocks I didn\'t even know I was carrying. The difference was immediate and profound. My relationships improved, my creativity returned, and I feel lighter than I have in years. This work is real and it works.',
    initials: 'AP',
    color: 'from-rose-400 to-pink-600',
    date: 'January 2024',
    service: 'Energy Clearance',
  },
  {
    id: '4',
    name: 'Sanjay Kumar',
    role: 'IT Professional',
    location: 'Bangalore, India',
    rating: 5,
    review: 'As someone who was initially skeptical, I was amazed by the accuracy and depth of my reading. The information revealed about my past lives explained so much about my current relationships and fears. The process was gentle, professional, and deeply insightful. Highly recommended.',
    initials: 'SK',
    color: 'from-teal-400 to-cyan-600',
    date: 'December 2023',
    service: 'Past Life Regression',
  },
  {
    id: '5',
    name: 'Deepa Nair',
    role: 'School Teacher',
    location: 'Kerala, India',
    rating: 5,
    review: 'I took the Foundation Course not knowing what to expect. By the end of week one, I had already made contact with my Akaashik records. The teaching style is patient, thorough, and spiritually guided. The community of students is warm and supportive. Best investment in my growth!',
    initials: 'DN',
    color: 'from-amber-400 to-orange-500',
    date: 'November 2023',
    service: 'Foundation Course',
  },
  {
    id: '6',
    name: 'Vikram Singh',
    role: 'Psychologist',
    location: 'Delhi, India',
    rating: 5,
    review: 'From a professional standpoint, the integration of Akaashik reading with psychological healing is remarkable. I\'ve attended several workshops and readings now. The practitioner\'s ability to hold sacred space while providing clear, actionable insights is a rare gift. My clients have also benefitted.',
    initials: 'VS',
    color: 'from-green-400 to-emerald-600',
    date: 'October 2023',
    service: 'Multiple Sessions',
  },
];
