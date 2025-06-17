

// Featured cars data
export const mockFeaturedCars = [
  {
    id: '1',
    make: 'Tesla',
    model: 'Model 3',
    year: 2022,
    image: 'https://images.pexels.com/photos/12322158/pexels-photo-12322158.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    rating: 4.9,
    seats: 5,
    fuelType: 'Electric',
    pricePerDay: 89,
    location: 'San Francisco, CA',
    description: 'Tesla Model 3 Long Range with Autopilot. Clean, well-maintained, and perfect for your trip.',
    features: [
      'Autopilot',
      'All-Wheel Drive',
      'Premium Sound',
      'Heated Seats',
      'Supercharging Access'
    ],
    owner: {
      name: 'David',
      rating: 4.9,
      image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      responseTime: '5 min'
    }
  },
  {
    id: '2',
    make: 'Toyota',
    model: 'RAV4',
    year: 2021,
    image: 'https://images.pexels.com/photos/13917923/pexels-photo-13917923.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    rating: 4.8,
    seats: 5,
    fuelType: 'Hybrid',
    pricePerDay: 65,
    location: 'Los Angeles, CA',
    description: 'Fuel-efficient Toyota RAV4 Hybrid. Perfect for road trips or city driving.',
    features: [
      'Backup Camera',
      'Apple CarPlay',
      'Lane Assist',
      'Keyless Entry',
      'Roof Rack'
    ],
    owner: {
      name: 'Sarah',
      rating: 4.7,
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      responseTime: '10 min'
    }
  },
  {
    id: '3',
    make: 'BMW',
    model: '3 Series',
    year: 2020,
    image: 'https://images.pexels.com/photos/892522/pexels-photo-892522.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    rating: 4.7,
    seats: 5,
    fuelType: 'Gas',
    pricePerDay: 79,
    location: 'New York, NY',
    description: 'Sporty BMW 3 Series in excellent condition. Enjoy luxury and performance.',
    features: [
      'Sport Package',
      'Leather Seats',
      'Sunroof',
      'Navigation',
      'Bluetooth'
    ],
    owner: {
      name: 'Michael',
      rating: 4.8,
      image: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      responseTime: '15 min'
    }
  }
];

// Search results data
export const mockSearchResults = [
  ...mockFeaturedCars,
  {
    id: '4',
    make: 'Honda',
    model: 'Civic',
    year: 2021,
    image: 'https://images.pexels.com/photos/18861692/pexels-photo-18861692/free-photo-of-car-vehicle-design-wheel.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    rating: 4.6,
    seats: 5,
    fuelType: 'Gas',
    pricePerDay: 55,
    location: 'Seattle, WA',
    description: 'Reliable and fuel-efficient Honda Civic. Great for city driving.',
    features: [
      'Backup Camera',
      'Apple CarPlay',
      'Bluetooth',
      'Keyless Entry',
      'Heated Seats'
    ],
    owner: {
      name: 'Emily',
      rating: 4.5,
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      responseTime: '20 min'
    }
  },
  {
    id: '5',
    make: 'Jeep',
    model: 'Wrangler',
    year: 2019,
    image: 'https://images.pexels.com/photos/3136673/pexels-photo-3136673.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    rating: 4.8,
    seats: 4,
    fuelType: 'Gas',
    pricePerDay: 85,
    location: 'Denver, CO',
    description: 'Adventure-ready Jeep Wrangler. Perfect for exploring the mountains.',
    features: [
      '4x4',
      'Removable Top',
      'Bluetooth',
      'Tow Package',
      'Off-Road Tires'
    ],
    owner: {
      name: 'Alex',
      rating: 4.9,
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      responseTime: '5 min'
    }
  },
  {
    id: '6',
    make: 'Audi',
    model: 'Q5',
    year: 2020,
    image: 'https://images.pexels.com/photos/17848104/pexels-photo-17848104/free-photo-of-blue-audi-on-road.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    rating: 4.7,
    seats: 5,
    fuelType: 'Gas',
    pricePerDay: 95,
    location: 'Chicago, IL',
    description: 'Luxury Audi Q5 SUV with all the premium features you need.',
    features: [
      'Quattro AWD',
      'Panoramic Sunroof',
      'Premium Sound',
      'Heated Seats',
      'Navigation'
    ],
    owner: {
      name: 'Jessica',
      rating: 4.8,
      image: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      responseTime: '10 min'
    }
  },
  {
    id: '7',
    make: 'Ford',
    model: 'Mustang',
    year: 2021,
    image: 'https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    rating: 4.9,
    seats: 4,
    fuelType: 'Gas',
    pricePerDay: 99,
    location: 'Miami, FL',
    description: 'Iconic Ford Mustang convertible. Feel the wind in your hair!',
    features: [
      'Convertible Top',
      'Sport Mode',
      'Bluetooth',
      'Backup Camera',
      'Premium Sound'
    ],
    owner: {
      name: 'Carlos',
      rating: 4.9,
      image: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      responseTime: '5 min'
    }
  },
  {
    id: '8',
    make: 'Chevrolet',
    model: 'Bolt',
    year: 2022,
    image: 'https://images.pexels.com/photos/13861879/pexels-photo-13861879.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    rating: 4.6,
    seats: 5,
    fuelType: 'Electric',
    pricePerDay: 69,
    location: 'Portland, OR',
    description: 'Eco-friendly Chevy Bolt with great range. Zero emissions, all fun.',
    features: [
      'Long Range Battery',
      'Fast Charging',
      'Apple CarPlay',
      'Heated Seats',
      'Backup Camera'
    ],
    owner: {
      name: 'Jordan',
      rating: 4.7,
      image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      responseTime: '15 min'
    }
  }
];

// Car reviews data
export const mockReviews = [
  {
    id: 'r1',
    carId: '1',
    user: {
      name: 'Jennifer',
      image: 'https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    },
    rating: 5,
    date: '2023-04-15',
    comment: 'Amazing car! Very clean and drives beautifully. The owner was also very responsive and flexible with pickup and drop-off.'
  },
  {
    id: 'r2',
    carId: '1',
    user: {
      name: 'Robert',
      image: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    },
    rating: 4,
    date: '2023-03-22',
    comment: 'Great experience overall. The car was clean and fun to drive. Would rent again!'
  },
  {
    id: 'r3',
    carId: '1',
    user: {
      name: 'Michelle',
      image: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    },
    rating: 5,
    date: '2023-02-10',
    comment: 'Perfect car for our weekend trip. The Tesla was immaculate and the owner was very helpful explaining all the features.'
  },
  {
    id: 'r4',
    carId: '2',
    user: {
      name: 'Kevin',
      image: 'https://images.pexels.com/photos/837358/pexels-photo-837358.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    },
    rating: 5,
    date: '2023-04-02',
    comment: 'The RAV4 was perfect for our camping trip. Very spacious and comfortable. Sarah was a pleasure to deal with.'
  },
  {
    id: 'r5',
    carId: '2',
    user: {
      name: 'Lisa',
      image: 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    },
    rating: 4,
    date: '2023-03-15',
    comment: 'Great car and very fuel efficient. The pickup and drop-off process was smooth and easy.'
  }
];

// Car features data
export const featureIcons = {
  'Autopilot': 'auto-pilot',
  'All-Wheel Drive': 'awd',
  'Premium Sound': 'music',
  'Heated Seats': 'thermometer',
  'Supercharging Access': 'zap',
  'Backup Camera': 'camera',
  'Apple CarPlay': 'smartphone',
  'Lane Assist': 'alert-circle',
  'Keyless Entry': 'key',
  'Roof Rack': 'package',
  'Sport Package': 'activity',
  'Leather Seats': 'armchair',
  'Sunroof': 'sun',
  'Navigation': 'map',
  'Bluetooth': 'bluetooth',
  '4x4': 'truck',
  'Removable Top': 'umbrella',
  'Tow Package': 'link',
  'Off-Road Tires': 'disc',
  'Quattro AWD': 'snowflake',
  'Panoramic Sunroof': 'sun',
  'Heated Seats': 'flame',
  'Convertible Top': 'umbrella',
  'Sport Mode': 'zap-fast',
  'Long Range Battery': 'battery-charging',
  'Fast Charging': 'zap',
};

// Filter options
export const filterOptions = {
  carTypes: [
    'Sedan',
    'SUV',
    'Truck',
    'Convertible',
    'Sports Car',
    'Luxury',
    'Electric',
    'Hybrid'
  ],
  features: [
    'All-Wheel Drive',
    'Bluetooth',
    'Backup Camera',
    'Heated Seats',
    'Sunroof',
    'Apple CarPlay/Android Auto',
    'Child Seat',
    'Ski Rack',
    'Bike Rack',
    'Pet Friendly'
  ],
  makes: [
    'Audi',
    'BMW',
    'Chevrolet',
    'Ford',
    'Honda',
    'Jeep',
    'Lexus',
    'Mercedes-Benz',
    'Nissan',
    'Porsche',
    'Tesla',
    'Toyota',
    'Volkswagen'
  ]
};

// Host earnings data
export const hostEarningsExample = {
  averageMonthly: 850,
  topEarners: 1200,
  weekendRates: 95,
  weekdayRates: 75,
  occupancyRate: '70%',
  popularCars: [
    'Tesla Model 3/Y',
    'Toyota RAV4',
    'Jeep Wrangler',
    'Honda Civic',
    'Ford Mustang'
  ]
};