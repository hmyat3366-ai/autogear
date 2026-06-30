const products = [
  {
    id: 1,
    name: 'Carbon Fiber Racing Spoiler',
    category: 'Exterior',
    price: 299,
    description: 'Lightweight carbon fiber spoiler with aggressive racing design. Universal fit for most sedans and coupes.',
    rating: 4.8,
    reviews: 124,
    inStock: true,
    badge: 'Best Seller',
    img: '🏎️'
  },
  {
    id: 2,
    name: 'LED Matrix Headlights Pro',
    category: 'Lighting',
    price: 450,
    description: 'Ultra-bright LED matrix headlights with adaptive beam technology. Plug-and-play installation.',
    rating: 4.9,
    reviews: 89,
    inStock: true,
    badge: 'New',
    img: '💡'
  },
  {
    id: 3,
    name: 'Sport Racing Bucket Seats',
    category: 'Interior',
    price: 850,
    description: 'Premium leather racing bucket seats with lumbar support and side bolsters. Pair (2 seats).',
    rating: 4.7,
    reviews: 67,
    inStock: true,
    badge: 'Premium',
    img: '💺'
  },
  {
    id: 4,
    name: 'Cold Air Intake System',
    category: 'Performance',
    price: 199,
    description: 'High-flow cold air intake system. Increases horsepower by up to 15HP. Easy bolt-on installation.',
    rating: 4.6,
    reviews: 203,
    inStock: true,
    badge: null,
    img: '🔧'
  },
  {
    id: 5,
    name: 'Premium Leather Steering Wheel',
    category: 'Interior',
    price: 189,
    description: 'Italian leather wrapped steering wheel with red stitching. Includes adapter hub.',
    rating: 4.5,
    reviews: 156,
    inStock: true,
    badge: null,
    img: '🎯'
  },
  {
    id: 6,
    name: 'RGB Underglow LED Kit',
    category: 'Lighting',
    price: 129,
    description: 'Waterproof RGB underglow LED strip kit with remote control. 16 million colors, music sync mode.',
    rating: 4.4,
    reviews: 312,
    inStock: true,
    badge: 'Popular',
    img: '🌈'
  },
  {
    id: 7,
    name: 'Performance Exhaust System',
    category: 'Performance',
    price: 599,
    description: 'Stainless steel cat-back exhaust system. Deep rumble tone. Adds up to 25HP.',
    rating: 4.8,
    reviews: 98,
    inStock: true,
    badge: null,
    img: '💨'
  },
  {
    id: 8,
    name: '20" Forged Alloy Wheels',
    category: 'Exterior',
    price: 1299,
    description: 'Set of 4 forged aluminum alloy wheels. Matte black finish. Lightweight and strong.',
    rating: 4.9,
    reviews: 45,
    inStock: true,
    badge: 'Premium',
    img: '⚙️'
  },
  {
    id: 9,
    name: '4K Dual Dash Camera',
    category: 'Electronics',
    price: 179,
    description: 'Front and rear 4K dash cam with night vision, GPS, and parking mode. Wi-Fi enabled.',
    rating: 4.7,
    reviews: 267,
    inStock: true,
    badge: 'Best Seller',
    img: '📷'
  },
  {
    id: 10,
    name: 'Custom Floor Mat Set',
    category: 'Interior',
    price: 89,
    description: 'All-weather custom-fit floor mats. Heavy-duty rubber with anti-slip backing. Set of 4.',
    rating: 4.3,
    reviews: 445,
    inStock: true,
    badge: null,
    img: '🛡️'
  },
  {
    id: 11,
    name: 'Widebody Fender Flares',
    category: 'Exterior',
    price: 749,
    description: 'Universal widebody fender flare kit. ABS plastic with matte finish. Set of 4.',
    rating: 4.6,
    reviews: 78,
    inStock: false,
    badge: 'Sold Out',
    img: '🚗'
  },
  {
    id: 12,
    name: 'Turbo Boost Controller',
    category: 'Performance',
    price: 349,
    description: 'Electronic turbo boost controller with OLED display. Programmable boost levels.',
    rating: 4.5,
    reviews: 134,
    inStock: true,
    badge: null,
    img: '🏁'
  },
  {
    id: 13,
    name: 'JBL Premium Car Speakers',
    category: 'Electronics',
    price: 259,
    description: '6.5" component car speakers. 360W peak power. Crystal clear highs and deep bass.',
    rating: 4.8,
    reviews: 189,
    inStock: true,
    badge: 'Popular',
    img: '🔊'
  },
  {
    id: 14,
    name: 'Interior Ambient LED Strip',
    category: 'Lighting',
    price: 59,
    description: 'Interior ambient lighting kit with app control. 64 colors. Fiber optic strips.',
    rating: 4.2,
    reviews: 523,
    inStock: true,
    badge: null,
    img: '✨'
  },
  {
    id: 15,
    name: 'Magnetic Phone Mount Pro',
    category: 'Electronics',
    price: 39,
    description: 'Ultra-strong magnetic phone mount with wireless charging. 360° rotation. Dashboard mount.',
    rating: 4.6,
    reviews: 891,
    inStock: true,
    badge: 'Best Seller',
    img: '📱'
  },
  {
    id: 16,
    name: 'Carbon Fiber Mirror Covers',
    category: 'Exterior',
    price: 119,
    description: 'Real carbon fiber side mirror covers. Glossy finish. Easy clip-on installation.',
    rating: 4.4,
    reviews: 167,
    inStock: true,
    badge: null,
    img: '🪞'
  }
];

export const categories = ['All', 'Interior', 'Exterior', 'Lighting', 'Performance', 'Electronics'];

export default products;
