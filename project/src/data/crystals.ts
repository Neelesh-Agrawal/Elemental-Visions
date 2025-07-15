import { Crystal } from '../types';

export const crystals: Crystal[] = [
  {
    id: '1',
    name: 'Amethyst',
    purpose: 'Spiritual Protection',
    description: 'Powerful protection stone that enhances spiritual awareness and intuition.',
    properties: ['Protection', 'Intuition', 'Clarity', 'Peace'],
    image: '/crystals/Amethyst_Cluster/outer.jpg',
    forms: [
      { name: 'Bracelet', price: 1200, image: '/crystals/Amethyst_Cluster/bracelet.jpg' },
      { name: 'Tumble', price: 400, image: '/crystals/Amethyst_Cluster/tumble.jpeg' },
      { name: 'Tree', price: 1800, image: '/crystals/Amethyst_Cluster/tree.jpg' },
      { name: 'Pendant', price: 900, image: '/crystals/Amethyst_Cluster/pendant.jpeg' },
      { name: 'Raw', price: 600, image: '/crystals/Amethyst_Cluster/outer.jpg' }
    ]
  },
  {
    id: '2',
    name: 'Rose Quartz',
    purpose: 'Love & Healing',
    price: 800,
    image: '/crystals/Rose_Quartz/outer.jpg',
    description: 'The stone of unconditional love, promoting self-love and emotional healing.',
    properties: ['Love', 'Compassion', 'Emotional Healing', 'Self-Care'],
    forms: [
      { name: 'Bracelet', price: 1000, image: '/crystals/Rose_Quartz/bracelet.jpg' },
      { name: 'Tumble', price: 300, image: '/crystals/Rose_Quartz/tumble.jpg' },
      { name: 'Tree', price: 2000, image: '/crystals/Rose_Quartz/tree.jpeg' },
      { name: 'Pendant', price: 1200, image: '/crystals/Rose_Quartz/pendant.jpg' },
      { name: 'Raw', price: 800, image: '/crystals/Rose_Quartz/raw.jpeg' }
    ]
  },
  {
    id: '3',
    name: 'Clear Quartz',
    purpose: 'Amplification',
    price: 600,
    image: '/crystals/Clear_Quartz/outer.jpg',
    description: 'Master healer that amplifies energy and intention of other crystals.',
    properties: ['Amplification', 'Clarity', 'Energy', 'Healing'],
    forms: [
      { name: 'Bracelet', price: 700, image: '/crystals/Clear_Quartz/bracelet.jpg' },
      { name: 'Tumble', price: 200, image: '/crystals/Clear_Quartz/Tumble.jpeg' },
      { name: 'Tree', price: 1500, image: '/crystals/Clear_Quartz/tree.jpeg' },
      { name: 'Pendant', price: 800, image: '/crystals/Clear_Quartz/pendant.jpg' },
      { name: 'Raw', price: 500, image: '/crystals/Clear_Quartz/raw.jpeg' }
    ]
  },
  {
    id: '4',
    name: 'Black Tourmaline',
    purpose: 'Grounding',
    price: 900,
    image: '/crystals/Black_Tourmaline/outer.jpg',
    description: 'Powerful grounding stone that provides protection from negative energies.',
    properties: ['Grounding', 'Protection', 'Stability', 'Cleansing'],
    forms: [
      { name: 'Bracelet', price: 1100, image: '/crystals/Black_Tourmaline/bracelet.jpg' },
      { name: 'Tumble', price: 350, image: '/crystals/Black_Tourmaline/tumble.jpeg' },
      { name: 'Tree', price: 2200, image: '/crystals/Black_Tourmaline/tree.jpeg' },
      { name: 'Pendant', price: 1000, image: '/crystals/Black_Tourmaline/pendant.jpg' },
      { name: 'Raw', price: 700, image: '/crystals/Black_Tourmaline/raw.jpg' }
    ]
  },
  {
    id: '5',
    name: 'Citrine',
    purpose: 'Abundance & Joy',
    price: 1100,
    image: '/crystals/Citrine/outer.jpg',
    description: 'Stone of abundance that attracts prosperity and positive energy.',
    properties: ['Abundance', 'Joy', 'Confidence', 'Manifestation'],
    forms: [
      { name: 'Bracelet', price: 1300, image: '/crystals/Citrine/bracelet.jpg' },
      { name: 'Tumble', price: 450, image: '/crystals/Citrine/tumble.png' },
      { name: 'Tree', price: 2500, image: '/crystals/Citrine/tree.png' },
      { name: 'Pendant', price: 1400, image: '/crystals/Citrine/pendant.png' },
      { name: 'Raw', price: 900, image: '/crystals/Citrine/raw.png' }
    ]
  },
  {
    id: '6',
    name: 'Labradorite',
    purpose: 'Transformation',
    price: 1300,
    image: '/crystals/Labradorite/outer.jpeg',
    description: 'Stone of transformation that enhances intuition and psychic abilities.',
    properties: ['Transformation', 'Intuition', 'Magic', 'Protection'],
    forms: [
      { name: 'Bracelet', price: 1500, image: '/crystals/Labradorite/bracelet.jpeg' },
      { name: 'Tumble', price: 500, image: '/crystals/Labradorite/tumble.jpeg' },
      { name: 'Tree', price: 3000, image: '/crystals/Labradorite/tree.jpeg' },
      { name: 'Pendant', price: 1600, image: '/crystals/Labradorite/pendant.jpeg' },
      { name: 'Raw', price: 1100, image: '/crystals/Labradorite/raw.jpeg' }
    ]
  },
  {
    id: '7',
    name: 'Green Aventurine',
    purpose: 'Luck & Opportunity',
    price: 700,
    image: '/crystals/Green_Aventurine/outer.jpg',
    description: 'Lucky stone that attracts opportunities and promotes optimism.',
    properties: ['Luck', 'Opportunity', 'Growth', 'Heart Healing'],
    forms: [
      { name: 'Bracelet', price: 800, image: '/crystals/Green_Aventurine/bracelet.jpg' },
      { name: 'Tumble', price: 250, image: '/crystals/Green_Aventurine/tumble.jpeg' },
      { name: 'Tree', price: 1800, image: '/crystals/Green_Aventurine/tree.jpg' },
      { name: 'Pendant', price: 900, image: '/crystals/Green_Aventurine/pendant.jpeg' },
      { name: 'Raw', price: 600, image: '/crystals/Green_Aventurine/raw.jpg' }
    ]
  },
  {
    id: '8',
    name: 'Selenite Wand',
    purpose: 'Cleansing & Purification',
    price: 950,
    image: '/crystals/Selenite_Wand/outer.jpeg',
    description: 'High-vibration crystal that cleanses and charges other stones.',
    properties: ['Cleansing', 'Purification', 'Peace', 'Clarity'],
    forms: [
      { name: 'Bracelet', price: 1050, image: '/crystals/Selenite_Wand/bracelet.jpeg' },
      { name: 'Tumble', price: 350, image: '/crystals/Selenite_Wand/tumble.jpeg' },
      { name: 'Tree', price: 2100, image: '/crystals/Selenite_Wand/tree.jpeg' },
      { name: 'Pendant', price: 1100, image: '/crystals/Selenite_Wand/pendant.jpeg' },
      { name: 'Raw', price: 750, image: '/crystals/Selenite_Wand/raw.jpeg' }
    ]
  },
  {
    id: '9',
    name: 'Carnelian',
    purpose: 'Courage & Creativity',
    price: 850,
    image: '/crystals/Carnelian/outer.jpeg',
    description: 'Energizing stone that boosts courage, creativity, and motivation.',
    properties: ['Courage', 'Creativity', 'Motivation', 'Vitality'],
    forms: [
      { name: 'Bracelet', price: 950, image: '/crystals/Carnelian/bracelet.jpeg' },
      { name: 'Tumble', price: 300, image: '/crystals/Carnelian/tumble.jpeg' },
      { name: 'Tree', price: 2000, image: '/crystals/Carnelian/tree.jpeg' },
      { name: 'Pendant', price: 1000, image: '/crystals/Carnelian/pendant.jpeg' },
      { name: 'Raw', price: 700, image: '/crystals/Carnelian/raw.jpeg' }
    ]
  },
  {
    id: '10',
    name: 'Moonstone',
    purpose: 'Intuition & Feminine Energy',
    price: 1000,
    image: '/crystals/Moonstone/outer.jpeg',
    description: 'Sacred stone that enhances intuition and connects with lunar cycles.',
    properties: ['Intuition', 'Feminine Energy', 'Cycles', 'Emotional Balance'],
    forms: [
      { name: 'Bracelet', price: 1100, image: '/crystals/Moonstone/bracelet.jpeg' },
      { name: 'Tumble', price: 350, image: '/crystals/Moonstone/tumble.jpeg' },
      { name: 'Tree', price: 2200, image: '/crystals/Moonstone/tree.jpeg' },
      { name: 'Pendant', price: 1200, image: '/crystals/Moonstone/pendant.jpeg' },
      { name: 'Raw', price: 800, image: '/crystals/Moonstone/raw.jpeg' }
    ]
  }
];