export interface Comment {
  id: string;
  author: string;
  authorAvatar: string;
  authorDescription: string;
  content: string;
  timestamp: Date;
}

export interface Post {
  id: string;
  author: string;
  authorAvatar: string;
  authorDescription: string;
  caption: string;
  timestamp: Date;
  likes: number;
  comments: Comment[];
  imageUrl?: string;
}

const BASE_POSTS: Post[] = [
  {
    id: '1',
    author: 'Sarah Johnson',
    authorAvatar: '/1.jpg',
    authorDescription: 'Product Manager at Tech Corp | Innovation Enthusiast',
    caption:
      "Excited to share that our team just launched a new feature that will revolutionize how users interact with our platform. The journey has been incredible, and I couldn't be more proud of what we've accomplished together.",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    likes: 142,
    comments: [],
    imageUrl: '/1.jpg',
  },
  {
    id: '2',
    author: 'Michael Chen',
    authorAvatar: '/2.jpg',
    authorDescription: 'Software Engineer | Full Stack Developer | Open Source Contributor',
    caption:
      "Just finished reading an amazing book on system design. Key takeaway: scalability isn't just about handling more traffic, it's about building systems that can evolve with your business needs.",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    likes: 89,
    comments: [],
    imageUrl: '/2.jpg',
  },
  {
    id: '3',
    author: 'Emily Rodriguez',
    authorAvatar: '/3.jpg',
    authorDescription: 'UX Designer | Creating delightful user experiences',
    caption:
      'Design tip of the day: Always consider accessibility from the start, not as an afterthought. Your users will thank you for it!',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    likes: 234,
    comments: [],
    imageUrl: '/3.jpg',
  },
  {
    id: '4',
    author: 'David Kim',
    authorAvatar: '/4.jpg',
    authorDescription: 'Tech Lead at StartupXYZ | Mentor | Speaker',
    caption:
      "Had an insightful conversation with my team today about technical debt. It's not always about writing perfect code from day one, but about making conscious decisions and documenting them well.",
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
    likes: 176,
    comments: [],
    imageUrl: '/4.jpg',
  },
  {
    id: '1',
    author: 'Sarah Johnson',
    authorAvatar: '/1.jpg',
    authorDescription: 'Product Manager at Tech Corp | Innovation Enthusiast',
    caption:
      "Excited to share that our team just launched a new feature that will revolutionize how users interact with our platform. The journey has been incredible, and I couldn't be more proud of what we've accomplished together.",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    likes: 142,
    comments: [],
    imageUrl: '/1.jpg',
  },
  {
    id: '2',
    author: 'Michael Chen',
    authorAvatar: '/2.jpg',
    authorDescription: 'Software Engineer | Full Stack Developer | Open Source Contributor',
    caption:
      "Just finished reading an amazing book on system design. Key takeaway: scalability isn't just about handling more traffic, it's about building systems that can evolve with your business needs.",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    likes: 89,
    comments: [],
    imageUrl: '/2.jpg',
  },
  {
    id: '3',
    author: 'Emily Rodriguez',
    authorAvatar: '/3.jpg',
    authorDescription: 'UX Designer | Creating delightful user experiences',
    caption:
      'Design tip of the day: Always consider accessibility from the start, not as an afterthought. Your users will thank you for it!',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    likes: 234,
    comments: [],
    imageUrl: '/3.jpg',
  },
  {
    id: '4',
    author: 'David Kim',
    authorAvatar: '/4.jpg',
    authorDescription: 'Tech Lead at StartupXYZ | Mentor | Speaker',
    caption:
      "Had an insightful conversation with my team today about technical debt. It's not always about writing perfect code from day one, but about making conscious decisions and documenting them well.",
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
    likes: 176,
    comments: [],
    imageUrl: '/4.jpg',
  },
  {
    id: '1',
    author: 'Sarah Johnson',
    authorAvatar: '/1.jpg',
    authorDescription: 'Product Manager at Tech Corp | Innovation Enthusiast',
    caption:
      "Excited to share that our team just launched a new feature that will revolutionize how users interact with our platform. The journey has been incredible, and I couldn't be more proud of what we've accomplished together.",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    likes: 142,
    comments: [],
    imageUrl: '/1.jpg',
  },
  {
    id: '2',
    author: 'Michael Chen',
    authorAvatar: '/2.jpg',
    authorDescription: 'Software Engineer | Full Stack Developer | Open Source Contributor',
    caption:
      "Just finished reading an amazing book on system design. Key takeaway: scalability isn't just about handling more traffic, it's about building systems that can evolve with your business needs.",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    likes: 89,
    comments: [],
    imageUrl: '/2.jpg',
  },
  {
    id: '3',
    author: 'Emily Rodriguez',
    authorAvatar: '/3.jpg',
    authorDescription: 'UX Designer | Creating delightful user experiences',
    caption:
      'Design tip of the day: Always consider accessibility from the start, not as an afterthought. Your users will thank you for it!',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    likes: 234,
    comments: [],
    imageUrl: '/3.jpg',
  },
  {
    id: '4',
    author: 'David Kim',
    authorAvatar: '/4.jpg',
    authorDescription: 'Tech Lead at StartupXYZ | Mentor | Speaker',
    caption:
      "Had an insightful conversation with my team today about technical debt. It's not always about writing perfect code from day one, but about making conscious decisions and documenting them well.",
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
    likes: 176,
    comments: [],
    imageUrl: '/4.jpg',
  },
  {
    id: '1',
    author: 'Sarah Johnson',
    authorAvatar: '/1.jpg',
    authorDescription: 'Product Manager at Tech Corp | Innovation Enthusiast',
    caption:
      "Excited to share that our team just launched a new feature that will revolutionize how users interact with our platform. The journey has been incredible, and I couldn't be more proud of what we've accomplished together.",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    likes: 142,
    comments: [],
    imageUrl: '/1.jpg',
  },
  {
    id: '2',
    author: 'Michael Chen',
    authorAvatar: '/2.jpg',
    authorDescription: 'Software Engineer | Full Stack Developer | Open Source Contributor',
    caption:
      "Just finished reading an amazing book on system design. Key takeaway: scalability isn't just about handling more traffic, it's about building systems that can evolve with your business needs.",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    likes: 89,
    comments: [],
    imageUrl: '/2.jpg',
  },
  {
    id: '3',
    author: 'Emily Rodriguez',
    authorAvatar: '/3.jpg',
    authorDescription: 'UX Designer | Creating delightful user experiences',
    caption:
      'Design tip of the day: Always consider accessibility from the start, not as an afterthought. Your users will thank you for it!',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    likes: 234,
    comments: [],
    imageUrl: '/3.jpg',
  },
  {
    id: '4',
    author: 'David Kim',
    authorAvatar: '/4.jpg',
    authorDescription: 'Tech Lead at StartupXYZ | Mentor | Speaker',
    caption:
      "Had an insightful conversation with my team today about technical debt. It's not always about writing perfect code from day one, but about making conscious decisions and documenting them well.",
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
    likes: 176,
    comments: [],
    imageUrl: '/4.jpg',
  },
  {
    id: '1',
    author: 'Sarah Johnson',
    authorAvatar: '/1.jpg',
    authorDescription: 'Product Manager at Tech Corp | Innovation Enthusiast',
    caption:
      "Excited to share that our team just launched a new feature that will revolutionize how users interact with our platform. The journey has been incredible, and I couldn't be more proud of what we've accomplished together.",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    likes: 142,
    comments: [],
    imageUrl: '/1.jpg',
  },
  {
    id: '2',
    author: 'Michael Chen',
    authorAvatar: '/2.jpg',
    authorDescription: 'Software Engineer | Full Stack Developer | Open Source Contributor',
    caption:
      "Just finished reading an amazing book on system design. Key takeaway: scalability isn't just about handling more traffic, it's about building systems that can evolve with your business needs.",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    likes: 89,
    comments: [],
    imageUrl: '/2.jpg',
  },
  {
    id: '3',
    author: 'Emily Rodriguez',
    authorAvatar: '/3.jpg',
    authorDescription: 'UX Designer | Creating delightful user experiences',
    caption:
      'Design tip of the day: Always consider accessibility from the start, not as an afterthought. Your users will thank you for it!',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    likes: 234,
    comments: [],
    imageUrl: '/3.jpg',
  },
  {
    id: '4',
    author: 'David Kim',
    authorAvatar: '/4.jpg',
    authorDescription: 'Tech Lead at StartupXYZ | Mentor | Speaker',
    caption:
      "Had an insightful conversation with my team today about technical debt. It's not always about writing perfect code from day one, but about making conscious decisions and documenting them well.",
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
    likes: 176,
    comments: [],
    imageUrl: '/4.jpg',
  },
];

// Remove duplicate posts and ensure unique IDs
export const MOCK_POSTS: Post[] = BASE_POSTS

