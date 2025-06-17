export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'booking' | 'payment' | 'vehicle' | 'account' | 'technical' | 'other';
  customer: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  assignedTo?: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: string;
  updatedAt: string;
  messages: Message[];
}

export interface Message {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
    type: 'customer' | 'support';
    avatar?: string;
  };
  timestamp: string;
  attachments?: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  status: 'active' | 'suspended' | 'pending';
  verified: boolean;
  joinedAt: string;
  totalBookings: number;
  totalRentals: number;
  rating: number;
  vehicles?: Vehicle[];
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  status: 'active' | 'pending' | 'suspended' | 'maintenance';
  owner: {
    id: string;
    name: string;
    email: string;
  };
  photos: string[];
  pricePerDay: number;
  location: string;
  features: string[];
  createdAt: string;
}

export interface ChatSession {
  id: string;
  customer: {
    id: string;
    name: string;
    avatar?: string;
    status: 'online' | 'offline';
  };
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  status: 'active' | 'closed';
}

export interface SupportAgent {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  status: 'online' | 'away' | 'offline';
  activeTickets: number;
  totalResolved: number;
  averageRating: number;
}

// Mock data
export const mockTickets: Ticket[] = [
  {
    id: 'T001',
    title: 'Payment not processed for booking',
    description: 'Customer reports that payment was charged but booking was not confirmed',
    status: 'open',
    priority: 'high',
    category: 'payment',
    customer: {
      id: 'U001',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      avatar: 'https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg?w=150'
    },
    assignedTo: {
      id: 'A001',
      name: 'Mike Wilson',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?w=150'
    },
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T14:20:00Z',
    messages: [
      {
        id: 'M001',
        content: 'I was charged $150 for my booking but I never received a confirmation email. My booking ID should be BK12345.',
        sender: {
          id: 'U001',
          name: 'Sarah Johnson',
          type: 'customer',
          avatar: 'https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg?w=150'
        },
        timestamp: '2024-01-15T10:30:00Z'
      },
      {
        id: 'M002',
        content: 'Hi Sarah, I\'m looking into your booking now. Can you please provide the last 4 digits of the card used for payment?',
        sender: {
          id: 'A001',
          name: 'Mike Wilson',
          type: 'support',
          avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?w=150'
        },
        timestamp: '2024-01-15T14:20:00Z'
      }
    ]
  },
  {
    id: 'T002',
    title: 'Vehicle damaged during rental',
    description: 'Customer reports damage to rental vehicle upon return',
    status: 'in-progress',
    priority: 'urgent',
    category: 'vehicle',
    customer: {
      id: 'U002',
      name: 'David Chen',
      email: 'david.chen@email.com',
      avatar: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?w=150'
    },
    createdAt: '2024-01-14T16:45:00Z',
    updatedAt: '2024-01-15T09:15:00Z',
    messages: []
  },
  {
    id: 'T003',
    title: 'Account verification issues',
    description: 'Unable to verify identity documents',
    status: 'resolved',
    priority: 'medium',
    category: 'account',
    customer: {
      id: 'U003',
      name: 'Emma Rodriguez',
      email: 'emma.rodriguez@email.com',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=150'
    },
    assignedTo: {
      id: 'A002',
      name: 'Lisa Park',
      avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?w=150'
    },
    createdAt: '2024-01-12T08:20:00Z',
    updatedAt: '2024-01-14T17:30:00Z',
    messages: []
  }
];

export const mockUsers: User[] = [
  {
    id: 'U001',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1 (555) 123-4567',
    avatar: 'https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg?w=150',
    status: 'active',
    verified: true,
    joinedAt: '2023-06-15T00:00:00Z',
    totalBookings: 12,
    totalRentals: 0,
    rating: 4.8
  },
  {
    id: 'U002',
    name: 'David Chen',
    email: 'david.chen@email.com',
    phone: '+1 (555) 234-5678',
    avatar: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?w=150',
    status: 'active',
    verified: true,
    joinedAt: '2023-08-22T00:00:00Z',
    totalBookings: 8,
    totalRentals: 3,
    rating: 4.5
  },
  {
    id: 'U003',
    name: 'Emma Rodriguez',
    email: 'emma.rodriguez@email.com',
    phone: '+1 (555) 345-6789',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=150',
    status: 'pending',
    verified: false,
    joinedAt: '2024-01-10T00:00:00Z',
    totalBookings: 0,
    totalRentals: 0,
    rating: 0
  }
];

export const mockVehicles: Vehicle[] = [
  {
    id: 'V001',
    make: 'Tesla',
    model: 'Model 3',
    year: 2023,
    status: 'active',
    owner: {
      id: 'U004',
      name: 'Alex Thompson',
      email: 'alex.thompson@email.com'
    },
    photos: [
      'https://images.pexels.com/photos/120049/pexels-photo-120049.jpeg?w=400'
    ],
    pricePerDay: 89,
    location: 'San Francisco, CA',
    features: ['Electric', 'Autopilot', 'Premium Interior'],
    createdAt: '2023-12-01T00:00:00Z'
  },
  {
    id: 'V002',
    make: 'BMW',
    model: 'X5',
    year: 2022,
    status: 'pending',
    owner: {
      id: 'U005',
      name: 'Maria Garcia',
      email: 'maria.garcia@email.com'
    },
    photos: [
      'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?w=400'
    ],
    pricePerDay: 125,
    location: 'Los Angeles, CA',
    features: ['AWD', 'Luxury Package', 'Navigation'],
    createdAt: '2024-01-05T00:00:00Z'
  }
];

export const mockChatSessions: ChatSession[] = [
  {
    id: 'C001',
    customer: {
      id: 'U001',
      name: 'Sarah Johnson',
      avatar: 'https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg?w=150',
      status: 'online'
    },
    lastMessage: 'Thank you for your help with the payment issue!',
    lastMessageTime: '2024-01-15T15:30:00Z',
    unreadCount: 0,
    status: 'active'
  },
  {
    id: 'C002',
    customer: {
      id: 'U002',
      name: 'David Chen',
      avatar: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?w=150',
      status: 'offline'
    },
    lastMessage: 'I need help with my booking cancellation',
    lastMessageTime: '2024-01-15T12:15:00Z',
    unreadCount: 2,
    status: 'active'
  }
];

export const mockSupportAgents: SupportAgent[] = [
  {
    id: 'A001',
    name: 'Mike Wilson',
    email: 'mike.wilson@airdrive.com',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?w=150',
    status: 'online',
    activeTickets: 8,
    totalResolved: 245,
    averageRating: 4.8
  },
  {
    id: 'A002',
    name: 'Lisa Park',
    email: 'lisa.park@airdrive.com',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?w=150',
    status: 'online',
    activeTickets: 5,
    totalResolved: 189,
    averageRating: 4.9
  },
  {
    id: 'A003',
    name: 'James Miller',
    email: 'james.miller@airdrive.com',
    avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?w=150',
    status: 'away',
    activeTickets: 3,
    totalResolved: 156,
    averageRating: 4.7
  }
];

export const mockAnalytics = {
  ticketStats: {
    total: 156,
    open: 23,
    inProgress: 12,
    resolved: 98,
    closed: 23,
    avgResolutionTime: '2.4 hours',
    satisfactionRate: 94.2
  },
  monthlyTickets: [
    { month: 'Jan', tickets: 45, resolved: 42 },
    { month: 'Feb', tickets: 52, resolved: 48 },
    { month: 'Mar', tickets: 38, resolved: 35 },
    { month: 'Apr', tickets: 47, resolved: 44 },
    { month: 'May', tickets: 41, resolved: 39 },
    { month: 'Jun', tickets: 35, resolved: 33 }
  ],
  categoryBreakdown: [
    { category: 'Booking', count: 45, percentage: 28.8 },
    { category: 'Payment', count: 38, percentage: 24.4 },
    { category: 'Vehicle', count: 32, percentage: 20.5 },
    { category: 'Account', count: 25, percentage: 16.0 },
    { category: 'Technical', count: 16, percentage: 10.3 }
  ]
};