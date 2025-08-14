export interface StationDetails {
  id: string;
  name: string;
  address: string;
  coordinates: [number, number];
  description: string;
  connections: {
    subway?: string[];
    bus?: string[];
    njTransit?: string[];
    ferry?: string[];
    lightRail?: string[];
  };
  nearbyAttractions: {
    name: string;
    distance: string;
    type: 'landmark' | 'shopping' | 'dining' | 'park' | 'entertainment';
  }[];
  parking?: {
    available: boolean;
    spaces?: number;
    details?: string;
  };
  accessibility: {
    wheelchairAccessible: boolean;
    elevators: boolean;
    escalators: boolean;
  };
  travelTimes: {
    destination: string;
    minutes: number;
  }[];
  amenities: string[];
}

export const STATION_DETAILS: Record<string, StationDetails> = {
  NWK: {
    id: 'NWK',
    name: 'Newark Penn Station',
    address: 'Raymond Plaza, Newark, NJ 07102',
    coordinates: [40.7357, -74.1635],
    description: 'Major transportation hub serving as the western terminus of the PATH system, with extensive connections to NJ Transit rail and bus services.',
    connections: {
      njTransit: ['Northeast Corridor', 'North Jersey Coast Line', 'Raritan Valley Line', 'Montclair-Boonton Line', 'Morris & Essex Lines'],
      bus: ['1', '5', '11', '13', '21', '25', '27', '28', '29', '34', '37', '39', '40', '41', '42', '43', '59', '62', '65', '66', '67', '70', '72', '73', '74', '75', '76', '78', '79', '90', '92', '93', '94', '96', '99', '107', '108'],
      lightRail: ['Newark Light Rail']
    },
    nearbyAttractions: [
      { name: 'Prudential Center', distance: '0.5 miles', type: 'entertainment' },
      { name: 'Newark Museum of Art', distance: '0.8 miles', type: 'entertainment' },
      { name: 'Military Park', distance: '0.3 miles', type: 'park' },
      { name: 'Ironbound District', distance: '0.7 miles', type: 'dining' }
    ],
    parking: {
      available: true,
      spaces: 3500,
      details: 'Over 3,500 parking spaces available within 2 blocks of the station'
    },
    accessibility: {
      wheelchairAccessible: true,
      elevators: true,
      escalators: true
    },
    travelTimes: [
      { destination: 'World Trade Center', minutes: 25 },
      { destination: 'Hoboken', minutes: 25 },
      { destination: '33rd Street', minutes: 40 },
      { destination: 'Journal Square', minutes: 10 }
    ],
    amenities: ['Waiting area', 'Restrooms', 'Food court', 'Retail shops', 'ATMs', 'WiFi']
  },

  HAR: {
    id: 'HAR',
    name: 'Harrison',
    address: 'Frank E. Rodgers Blvd, Harrison, NJ 07029',
    coordinates: [40.7394, -74.1555],
    description: 'Modern station serving the growing Harrison waterfront development area with direct service to Manhattan.',
    connections: {
      bus: ['40', '43']
    },
    nearbyAttractions: [
      { name: 'Red Bull Arena', distance: '0.3 miles', type: 'entertainment' },
      { name: 'Harrison Waterfront', distance: '0.2 miles', type: 'park' },
      { name: 'Riverbend District', distance: '0.1 miles', type: 'shopping' }
    ],
    parking: {
      available: true,
      spaces: 1200,
      details: 'Park and ride facility available'
    },
    accessibility: {
      wheelchairAccessible: true,
      elevators: true,
      escalators: false
    },
    travelTimes: [
      { destination: 'World Trade Center', minutes: 20 },
      { destination: 'Newark', minutes: 5 },
      { destination: 'Journal Square', minutes: 8 },
      { destination: '33rd Street', minutes: 35 }
    ],
    amenities: ['Waiting area', 'Bike racks', 'Kiss and ride area']
  },

  JSQ: {
    id: 'JSQ',
    name: 'Journal Square',
    address: '1 Path Plaza, Jersey City, NJ 07306',
    coordinates: [40.7332, -74.0627],
    description: 'Major transportation hub and PATH administrative headquarters, serving as a key interchange point for multiple PATH lines.',
    connections: {
      bus: ['1', '2', '6', '8', '10', '80', '82', '83', '84', '85', '86', '87', '88', '119', '125'],
      lightRail: ['Hudson-Bergen Light Rail (nearby)']
    },
    nearbyAttractions: [
      { name: 'Journal Square Plaza', distance: '0 miles', type: 'shopping' },
      { name: 'Loew\'s Jersey Theatre', distance: '0.2 miles', type: 'entertainment' },
      { name: 'India Square', distance: '0.5 miles', type: 'dining' },
      { name: 'Jersey City Medical Center', distance: '0.3 miles', type: 'landmark' }
    ],
    parking: {
      available: true,
      spaces: 800,
      details: 'Multi-level parking facility at transportation center'
    },
    accessibility: {
      wheelchairAccessible: true,
      elevators: true,
      escalators: true
    },
    travelTimes: [
      { destination: '33rd Street', minutes: 20 },
      { destination: 'World Trade Center', minutes: 15 },
      { destination: 'Newark', minutes: 10 },
      { destination: 'Hoboken', minutes: 10 }
    ],
    amenities: ['Retail plaza', 'Food court', 'ATMs', 'Restrooms', 'PATH administrative offices']
  },

  GRV: {
    id: 'GRV',
    name: 'Grove Street',
    address: 'Columbus Dr & Grove St, Jersey City, NJ 07302',
    coordinates: [40.7195, -74.0434],
    description: 'Historic downtown Jersey City station serving the vibrant Grove Street neighborhood with restaurants, shops, and nightlife.',
    connections: {
      bus: ['81', '86']
    },
    nearbyAttractions: [
      { name: 'Grove Street Plaza', distance: '0 miles', type: 'shopping' },
      { name: 'Van Vorst Park', distance: '0.3 miles', type: 'park' },
      { name: 'Jersey City City Hall', distance: '0.2 miles', type: 'landmark' },
      { name: 'Downtown Jersey City restaurants', distance: '0.1 miles', type: 'dining' }
    ],
    parking: {
      available: false,
      details: 'Street parking and nearby parking garages available'
    },
    accessibility: {
      wheelchairAccessible: true,
      elevators: true,
      escalators: false
    },
    travelTimes: [
      { destination: 'World Trade Center', minutes: 10 },
      { destination: '33rd Street', minutes: 25 },
      { destination: 'Newark', minutes: 15 },
      { destination: 'Journal Square', minutes: 5 }
    ],
    amenities: ['Bike racks', 'Nearby shopping and dining']
  },

  NEW: {
    id: 'NEW',
    name: 'Newport',
    address: 'Town Square Pl & Washington Blvd, Jersey City, NJ 07310',
    coordinates: [40.7268, -74.0341],
    description: 'Modern station serving the Newport Centre area with shopping mall, residential towers, and office buildings.',
    connections: {
      bus: ['64', '68', '80', '82', '85', '86', '87', '88', '119', '125'],
      lightRail: ['Hudson-Bergen Light Rail (nearby)']
    },
    nearbyAttractions: [
      { name: 'Newport Centre Mall', distance: '0.1 miles', type: 'shopping' },
      { name: 'Newport Green Park', distance: '0.2 miles', type: 'park' },
      { name: 'Hudson River Waterfront', distance: '0.3 miles', type: 'park' },
      { name: 'AMC Newport Centre 11', distance: '0.1 miles', type: 'entertainment' }
    ],
    parking: {
      available: true,
      spaces: 4000,
      details: 'Large parking garage at Newport Centre Mall'
    },
    accessibility: {
      wheelchairAccessible: true,
      elevators: true,
      escalators: true
    },
    travelTimes: [
      { destination: 'World Trade Center', minutes: 7 },
      { destination: '33rd Street', minutes: 20 },
      { destination: 'Hoboken', minutes: 5 },
      { destination: 'Newark', minutes: 20 }
    ],
    amenities: ['Direct mall access', 'Food court nearby', 'Retail shops', 'ATMs']
  },

  EXP: {
    id: 'EXP',
    name: 'Exchange Place',
    address: 'Exchange Pl & Hudson St, Jersey City, NJ 07302',
    coordinates: [40.7167, -74.033],
    description: 'Financial district station serving Jersey City\'s waterfront business district with stunning Manhattan views.',
    connections: {
      ferry: ['NY Waterway to Manhattan', 'Liberty Landing Ferry'],
      bus: ['20', '68', '80', '82', '85', '86', '87', '88'],
      lightRail: ['Hudson-Bergen Light Rail']
    },
    nearbyAttractions: [
      { name: 'J. Owen Grundy Park', distance: '0.1 miles', type: 'park' },
      { name: 'Harborside Financial Center', distance: '0.2 miles', type: 'shopping' },
      { name: 'Jersey City Waterfront', distance: '0 miles', type: 'park' },
      { name: 'Hyatt House Jersey City', distance: '0.1 miles', type: 'landmark' }
    ],
    parking: {
      available: true,
      details: 'Multiple parking garages in financial district'
    },
    accessibility: {
      wheelchairAccessible: true,
      elevators: true,
      escalators: true
    },
    travelTimes: [
      { destination: 'World Trade Center', minutes: 5 },
      { destination: '33rd Street', minutes: 20 },
      { destination: 'Newark', minutes: 20 },
      { destination: 'Hoboken', minutes: 7 }
    ],
    amenities: ['Waterfront access', 'Nearby restaurants', 'Ferry terminal']
  },

  HOB: {
    id: 'HOB',
    name: 'Hoboken Terminal',
    address: '1 Hudson Pl, Hoboken, NJ 07030',
    coordinates: [40.7363, -74.0279],
    description: 'Historic multi-modal transportation hub serving over 50,000 daily commuters with PATH, NJ Transit, ferry, and light rail services.',
    connections: {
      njTransit: ['Main Line', 'Bergen County Line', 'Pascack Valley Line', 'Port Jervis Line', 'Montclair-Boonton Line', 'Morris & Essex Lines', 'North Jersey Coast Line', 'Northeast Corridor Line', 'Raritan Valley Line'],
      ferry: ['NY Waterway to Manhattan (multiple routes)', 'Hoboken/Newport', 'Hoboken/Jersey City'],
      lightRail: ['Hudson-Bergen Light Rail'],
      bus: ['22', '23', '64', '68', '85', '86', '87', '89', '126']
    },
    nearbyAttractions: [
      { name: 'Frank Sinatra Park', distance: '0.3 miles', type: 'park' },
      { name: 'Washington Street (shopping/dining)', distance: '0.2 miles', type: 'shopping' },
      { name: 'Hoboken Waterfront', distance: '0.1 miles', type: 'park' },
      { name: 'Carlo\'s Bakery (Cake Boss)', distance: '0.3 miles', type: 'dining' },
      { name: 'Pier A Park', distance: '0.2 miles', type: 'park' }
    ],
    parking: {
      available: true,
      spaces: 2000,
      details: 'Multiple parking options near terminal'
    },
    accessibility: {
      wheelchairAccessible: true,
      elevators: true,
      escalators: true
    },
    travelTimes: [
      { destination: 'World Trade Center', minutes: 10 },
      { destination: '33rd Street', minutes: 15 },
      { destination: 'Newark', minutes: 25 },
      { destination: 'Journal Square', minutes: 10 }
    ],
    amenities: ['Historic waiting room', 'Food court', 'Retail shops', 'Ferry terminal', 'Restrooms', 'ATMs', 'WiFi']
  },

  WTC: {
    id: 'WTC',
    name: 'World Trade Center',
    address: '50 Church St, New York, NY 10007',
    coordinates: [40.7126, -74.0113],
    description: 'Spectacular Santiago Calatrava-designed transportation hub (Oculus) serving as the downtown Manhattan terminus with extensive shopping and dining.',
    connections: {
      subway: ['1', '2', '3', '4', '5', 'A', 'C', 'E', 'J', 'Z', 'R', 'W'],
      bus: ['M5', 'M20', 'M22']
    },
    nearbyAttractions: [
      { name: '9/11 Memorial & Museum', distance: '0.1 miles', type: 'landmark' },
      { name: 'One World Observatory', distance: '0.2 miles', type: 'landmark' },
      { name: 'Westfield World Trade Center Mall', distance: '0 miles', type: 'shopping' },
      { name: 'Brookfield Place', distance: '0.3 miles', type: 'shopping' },
      { name: 'Battery Park', distance: '0.4 miles', type: 'park' },
      { name: 'Wall Street', distance: '0.3 miles', type: 'landmark' },
      { name: 'Stone Street Historic District', distance: '0.2 miles', type: 'dining' }
    ],
    parking: {
      available: true,
      details: 'Multiple parking garages in Financial District'
    },
    accessibility: {
      wheelchairAccessible: true,
      elevators: true,
      escalators: true
    },
    travelTimes: [
      { destination: 'Newark', minutes: 25 },
      { destination: 'Hoboken', minutes: 10 },
      { destination: 'Journal Square', minutes: 15 },
      { destination: 'Exchange Place', minutes: 5 }
    ],
    amenities: ['Westfield Mall', 'Eataly', 'Apple Store', 'Multiple dining options', 'Restrooms', 'ATMs', 'WiFi', 'Tourist information']
  },

  CHR: {
    id: 'CHR',
    name: 'Christopher Street',
    address: 'Christopher St & Greenwich St, New York, NY 10014',
    coordinates: [40.7338, -74.007],
    description: 'Greenwich Village station in the heart of the historic West Village, known for LGBTQ+ history and vibrant neighborhood culture.',
    connections: {
      subway: ['1 (at Christopher St-Sheridan Sq)'],
      bus: ['M8', 'M20']
    },
    nearbyAttractions: [
      { name: 'Stonewall Inn', distance: '0.1 miles', type: 'landmark' },
      { name: 'Washington Square Park', distance: '0.4 miles', type: 'park' },
      { name: 'Hudson River Park', distance: '0.2 miles', type: 'park' },
      { name: 'The High Line', distance: '0.3 miles', type: 'park' },
      { name: 'West Village restaurants & bars', distance: '0 miles', type: 'dining' },
      { name: 'Bleecker Street shopping', distance: '0.2 miles', type: 'shopping' }
    ],
    parking: {
      available: false,
      details: 'Limited street parking, nearby parking garages available'
    },
    accessibility: {
      wheelchairAccessible: true,
      elevators: true,
      escalators: false
    },
    travelTimes: [
      { destination: 'World Trade Center', minutes: 10 },
      { destination: '33rd Street', minutes: 10 },
      { destination: 'Hoboken', minutes: 15 },
      { destination: 'Newark', minutes: 30 }
    ],
    amenities: ['Historic neighborhood', 'Nearby dining and nightlife']
  },

  '09S': {
    id: '09S',
    name: '9th Street',
    address: '9th St & 6th Ave, New York, NY 10011',
    coordinates: [40.7344, -74.0048],
    description: 'Greenwich Village station closest to Washington Square Park and New York University campus.',
    connections: {
      subway: ['F', 'M (at 14th St)', 'L (at 14th St)', 'A', 'C', 'E', 'B', 'D (at W 4th St)'],
      bus: ['M5', 'M6', 'M8', 'M21']
    },
    nearbyAttractions: [
      { name: 'Washington Square Park', distance: '0.2 miles', type: 'park' },
      { name: 'New York University', distance: '0.1 miles', type: 'landmark' },
      { name: 'Union Square', distance: '0.3 miles', type: 'shopping' },
      { name: 'Greenwich Village', distance: '0 miles', type: 'dining' },
      { name: 'Strand Bookstore', distance: '0.2 miles', type: 'shopping' }
    ],
    parking: {
      available: false,
      details: 'Limited street parking, NYU parking garages nearby'
    },
    accessibility: {
      wheelchairAccessible: true,
      elevators: true,
      escalators: false
    },
    travelTimes: [
      { destination: 'World Trade Center', minutes: 10 },
      { destination: '33rd Street', minutes: 8 },
      { destination: 'Hoboken', minutes: 12 },
      { destination: 'Newark', minutes: 28 }
    ],
    amenities: ['Near NYU campus', 'Student-friendly area', 'Cafes and bookstores']
  },

  '14S': {
    id: '14S',
    name: '14th Street',
    address: '14th St & 6th Ave, New York, NY 10014',
    coordinates: [40.7374, -74.0061],
    description: 'Major crosstown station at the intersection of Greenwich Village, Chelsea, and Union Square areas.',
    connections: {
      subway: ['F', 'M', 'L', '1', '2', '3'],
      bus: ['M14A', 'M14D', 'M5', 'M6', 'M7']
    },
    nearbyAttractions: [
      { name: 'Union Square', distance: '0.3 miles', type: 'shopping' },
      { name: 'Chelsea Market', distance: '0.3 miles', type: 'shopping' },
      { name: 'The High Line', distance: '0.2 miles', type: 'park' },
      { name: 'Meatpacking District', distance: '0.2 miles', type: 'dining' },
      { name: 'Whitney Museum', distance: '0.3 miles', type: 'entertainment' }
    ],
    parking: {
      available: false,
      details: 'Limited street parking, commercial garages available'
    },
    accessibility: {
      wheelchairAccessible: true,
      elevators: true,
      escalators: false
    },
    travelTimes: [
      { destination: 'World Trade Center', minutes: 12 },
      { destination: '33rd Street', minutes: 6 },
      { destination: 'Hoboken', minutes: 10 },
      { destination: 'Newark', minutes: 26 }
    ],
    amenities: ['Major subway interchange', 'Shopping and dining nearby']
  },

  '23S': {
    id: '23S',
    name: '23rd Street',
    address: '23rd St & 6th Ave, New York, NY 10010',
    coordinates: [40.7429, -74.0067],
    description: 'Chelsea station serving the Flatiron District with easy access to Madison Square Park and numerous tech company offices.',
    connections: {
      subway: ['F', 'M', 'N', 'R', 'W', '6 (at 23rd St)'],
      bus: ['M5', 'M6', 'M7', 'M23']
    },
    nearbyAttractions: [
      { name: 'Madison Square Park', distance: '0.2 miles', type: 'park' },
      { name: 'Flatiron Building', distance: '0.2 miles', type: 'landmark' },
      { name: 'Chelsea Hotel', distance: '0.1 miles', type: 'landmark' },
      { name: 'Eataly NYC Flatiron', distance: '0.2 miles', type: 'dining' },
      { name: 'Museum of Mathematics', distance: '0.3 miles', type: 'entertainment' }
    ],
    parking: {
      available: false,
      details: 'Limited street parking, commercial garages available'
    },
    accessibility: {
      wheelchairAccessible: true,
      elevators: true,
      escalators: false
    },
    travelTimes: [
      { destination: 'World Trade Center', minutes: 15 },
      { destination: '33rd Street', minutes: 4 },
      { destination: 'Hoboken', minutes: 8 },
      { destination: 'Newark', minutes: 24 }
    ],
    amenities: ['Business district location', 'Nearby parks and dining']
  },

  '33S': {
    id: '33S',
    name: '33rd Street',
    address: '32nd St & 6th Ave, New York, NY 10001',
    coordinates: [40.7489, -74.0063],
    description: 'Midtown Manhattan terminus station beneath Herald Square, providing direct access to Macy\'s and major shopping district.',
    connections: {
      subway: ['B', 'D', 'F', 'M', 'N', 'Q', 'R', 'W (at 34th St-Herald Sq)', '1', '2', '3 (at Penn Station)', 'A', 'C', 'E (at Penn Station)'],
      bus: ['M4', 'M5', 'M6', 'M7', 'M34', 'M34A', 'Q32'],
      njTransit: ['Penn Station (2 blocks) - Multiple lines including Amtrak and LIRR']
    },
    nearbyAttractions: [
      { name: 'Macy\'s Herald Square', distance: '0 miles', type: 'shopping' },
      { name: 'Empire State Building', distance: '0.2 miles', type: 'landmark' },
      { name: 'Madison Square Garden', distance: '0.2 miles', type: 'entertainment' },
      { name: 'Penn Station', distance: '0.1 miles', type: 'landmark' },
      { name: 'Manhattan Mall', distance: '0 miles', type: 'shopping' },
      { name: 'Koreatown', distance: '0.1 miles', type: 'dining' },
      { name: 'Times Square', distance: '0.4 miles', type: 'landmark' }
    ],
    parking: {
      available: true,
      details: 'Multiple parking garages in Midtown area'
    },
    accessibility: {
      wheelchairAccessible: true,
      elevators: true,
      escalators: true
    },
    travelTimes: [
      { destination: 'World Trade Center', minutes: 18 },
      { destination: 'Journal Square', minutes: 20 },
      { destination: 'Hoboken', minutes: 15 },
      { destination: 'Newark', minutes: 40 }
    ],
    amenities: ['Manhattan Mall access', 'Major shopping district', 'Food courts', 'Tourist information', 'Restrooms', 'ATMs']
  }
};