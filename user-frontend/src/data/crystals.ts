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
      { name: 'Bracelet', price: 750, image: '/crystals/Amethyst_Cluster/bracelet.jpg' },
      { name: 'Pendant', price: 375, image: '/crystals/Amethyst_Cluster/pendant.jpeg' },
      { name: 'Tumble (Set of 2)', price: 300, image: '/crystals/Amethyst_Cluster/tumble.jpeg' },
      { name: 'Tree', price: 875, image: '/crystals/Amethyst_Cluster/tree.jpg' },
      { name: 'Raw', price: 299, image: '/crystals/Amethyst_Cluster/outer.jpg' }
    ]
  },
  {
    id: '2',
    name: 'Rose Quartz',
    purpose: 'Love & Healing',
    price: 500,
    image: '/crystals/Rose_Quartz/outer.jpg',
    description: 'The stone of unconditional love, promoting self-love and emotional healing.',
    properties: ['Love', 'Compassion', 'Emotional Healing', 'Self-Care'],
    forms: [
      { name: 'Bracelet', price: 500, image: '/crystals/Rose_Quartz/bracelet.jpg' },
      { name: 'Pendant', price: 375, image: '/crystals/Rose_Quartz/pendant.jpg' },
      { name: 'Tumble (Set of 2)', price: 250, image: '/crystals/Rose_Quartz/tumble.jpg' },
      { name: 'Tree', price: 799, image: '/crystals/Rose_Quartz/tree.jpeg' },
      { name: 'Raw', price: 299, image: '/crystals/Rose_Quartz/raw.jpeg' }
    ]
  },
  {
    id: '3',
    name: 'Clear Quartz',
    purpose: 'Amplification',
    price: 500,
    image: '/crystals/Clear_Quartz/outer.jpg',
    description: 'Master healer that amplifies energy and intention of other crystals.',
    properties: ['Amplification', 'Clarity', 'Energy', 'Healing'],
    forms: [
      { name: 'Bracelet', price: 500, image: '/crystals/Clear_Quartz/bracelet.jpg' },
      { name: 'Pendant', price: 375, image: '/crystals/Clear_Quartz/pendant.jpg' },
      { name: 'Tumble (Set of 2)', price: 250, image: '/crystals/Clear_Quartz/Tumble.jpeg' },
      { name: 'Tree', price: 799, image: '/crystals/Clear_Quartz/tree.jpeg' },
      { name: 'Raw', price: 299, image: '/crystals/Clear_Quartz/raw.jpeg' }
    ]
  },
  {
    id: '4',
    name: 'Black Tourmaline',
    purpose: 'Grounding',
    price: 625,
    image: '/crystals/Black_Tourmaline/outer.jpg',
    description: 'Powerful grounding stone that provides protection from negative energies.',
    properties: ['Grounding', 'Protection', 'Stability', 'Cleansing'],
    forms: [
      { name: 'Bracelet', price: 625, image: '/crystals/Black_Tourmaline/bracelet.jpg' },
      { name: 'Pendant', price: 375, image: '/crystals/Black_Tourmaline/pendant.jpg' },
      { name: 'Tumble (Set of 2)', price: 300, image: '/crystals/Black_Tourmaline/tumble.jpeg' },
      { name: 'Tree', price: 875, image: '/crystals/Black_Tourmaline/tree.jpeg' },
      { name: 'Raw', price: 299, image: '/crystals/Black_Tourmaline/raw.jpg' }
    ]
  },
  {
    id: '5',
    name: 'Citrine',
    purpose: 'Abundance & Joy',
    price: 750,
    image: '/crystals/Citrine/outer.jpg',
    description: 'Stone of abundance that attracts prosperity and positive energy.',
    properties: ['Abundance', 'Joy', 'Confidence', 'Manifestation'],
    forms: [
      { name: 'Bracelet', price: 750, image: '/crystals/Citrine/bracelet.jpg' },
      { name: 'Pendant', price: 375, image: '/crystals/Citrine/pendant.jpeg' },
      { name: 'Tumble (Set of 2)', price: 300, image: '/crystals/Citrine/tumble.jpeg' },
      { name: 'Tree', price: 875, image: '/crystals/Citrine/tree.jpeg' },
      { name: 'Raw', price: 299, image: '/crystals/Citrine/raw.jpeg' }
    ]
  },
  {
    id: '6',
    name: 'Labradorite',
    purpose: 'Transformation',
    price: 500,
    image: '/crystals/Labradorite/outer.jpeg',
    description: 'Stone of transformation that enhances intuition and psychic abilities.',
    properties: ['Transformation', 'Intuition', 'Magic', 'Protection'],
    forms: [
      { name: 'Bracelet', price: 500, image: '/crystals/Labradorite/bracelet.jpeg' },
      { name: 'Pendant', price: 375, image: '/crystals/Labradorite/pendant.jpeg' },
      { name: 'Tumble (Set of 2)', price: 250, image: '/crystals/Labradorite/tumble.jpeg' },
      { name: 'Tree', price: 799, image: '/crystals/Labradorite/tree.jpeg' },
      { name: 'Raw', price: 299, image: '/crystals/Labradorite/raw.jpeg' }
    ]
  },
  {
    id: '7',
    name: 'Green Aventurine',
    purpose: 'Luck & Opportunity',
    price: 500,
    image: '/crystals/Green_Aventurine/outer.jpg',
    description: 'Lucky stone that attracts opportunities and promotes optimism.',
    properties: ['Luck', 'Opportunity', 'Growth', 'Heart Healing'],
    forms: [
      { name: 'Bracelet', price: 500, image: '/crystals/Green_Aventurine/bracelet.jpg' },
      { name: 'Pendant', price: 375, image: '/crystals/Green_Aventurine/pendant.jpeg' },
      { name: 'Tumble (Set of 2)', price: 250, image: '/crystals/Green_Aventurine/tumble.jpeg' },
      { name: 'Tree', price: 799, image: '/crystals/Green_Aventurine/tree.jpg' },
      { name: 'Raw', price: 299, image: '/crystals/Green_Aventurine/raw.jpg' }
    ]
  },
  {
    id: '9',
    name: 'Red Carnelian',
    purpose: 'Courage & Creativity',
    price: 500,
    image: '/crystals/Carnelian/outer.jpeg',
    description: 'Energizing stone that boosts courage, creativity, and motivation.',
    properties: ['Courage', 'Creativity', 'Motivation', 'Vitality'],
    forms: [
      { name: 'Bracelet', price: 500, image: '/crystals/Carnelian/bracelet.jpeg' },
      { name: 'Pendant', price: 375, image: '/crystals/Carnelian/pendant.jpeg' },
      { name: 'Tumble (Set of 2)', price: 250, image: '/crystals/Carnelian/tumble.jpeg' },
      { name: 'Tree', price: 799, image: '/crystals/Carnelian/tree.jpeg' },
      { name: 'Raw', price: 299, image: '/crystals/Carnelian/raw.jpeg' }
    ]
  },
  {
    id: '10',
    name: 'Moonstone',
    purpose: 'Intuition & Feminine Energy',
    price: 750,
    image: '/crystals/Moonstone/outer.jpeg',
    description: 'Sacred stone that enhances intuition and connects with lunar cycles.',
    properties: ['Intuition', 'Feminine Energy', 'Cycles', 'Emotional Balance'],
    forms: [
      { name: 'Bracelet', price: 750, image: '/crystals/Moonstone/bracelet.jpeg' },
      { name: 'Pendant', price: 375, image: '/crystals/Moonstone/pendant.jpeg' },
      { name: 'Tumble (Set of 2)', price: 300, image: '/crystals/Moonstone/tumble.jpeg' },
      { name: 'Tree', price: 875, image: '/crystals/Moonstone/tree.jpeg' },
      { name: 'Raw', price: 299, image: '/crystals/Moonstone/raw.jpeg' }
    ]
  },
  {
    id: '11',
    name: 'Pyrite',
    purpose: 'Abundance & Protection',
    price: 750,
    image: '/crystals/Pyrite/raw.jpeg',
    description: 'Powerful stone of manifestation that attracts wealth and shields from negative energy.',
    properties: ['Abundance', 'Protection', 'Willpower', 'Confidence'],
    forms: [
      { name: 'Bracelet', price: 750, image: '/crystals/Pyrite/bracelet.jpeg' },
      { name: 'Pendant', price: 375, image: '/crystals/Pyrite/pendant.jpeg' },
      { name: 'Tumble (Set of 2)', price: 300, image: '/crystals/Pyrite/Tumble.jpeg' },
      { name: 'Tree', price: 875, image: '/crystals/Pyrite/tree.jpeg' },
      { name: 'Raw', price: 299, image: '/crystals/Pyrite/raw.jpeg' }
    ]
  },
  {
    id: '12',
    name: 'Tiger Eye',
    purpose: 'Courage & Focus',
    price: 500,
    image: '/crystals/Tiger_Eye/Raw.jpeg',
    description: 'Stone of courage that enhances focus, willpower, and personal strength.',
    properties: ['Courage', 'Focus', 'Grounding', 'Protection'],
    forms: [
      { name: 'Bracelet', price: 500, image: '/crystals/Tiger_Eye/Bracelet.jpeg' },
      { name: 'Pendant', price: 375, image: '/crystals/Tiger_Eye/Pendant.jpeg' },
      { name: 'Tumble (Set of 2)', price: 250, image: '/crystals/Tiger_Eye/Tumble.jpeg' },
      { name: 'Tree', price: 799, image: '/crystals/Tiger_Eye/Tree.jpeg' },
      { name: 'Raw', price: 299, image: '/crystals/Tiger_Eye/Raw.jpeg' }
    ]
  },
  {
    id: '13',
    name: 'Lapiz Lazuli',
    purpose: 'Wisdom & Truth',
    price: 625,
    image: '/crystals/Lapis_Lazuli/Raw.jpeg',
    description: 'Royal stone of wisdom that enhances truth, communication, and spiritual insight.',
    properties: ['Wisdom', 'Truth', 'Communication', 'Spiritual Insight'],
    forms: [
      { name: 'Bracelet', price: 625, image: '/crystals/Lapis_Lazuli/Bracelet.jpeg' },
      { name: 'Pendant', price: 375, image: '/crystals/Lapis_Lazuli/Pendant.jpeg' },
      { name: 'Tumble (Set of 2)', price: 300, image: '/crystals/Lapis_Lazuli/Tumble.jpeg' },
      { name: 'Tree', price: 875, image: '/crystals/Lapis_Lazuli/Tree.jpeg' },
      { name: 'Raw', price: 299, image: '/crystals/Lapis_Lazuli/Raw.jpeg' }
    ]
  },
  {
    id: '8',
    name: 'Selenite',
    purpose: 'Cleansing & Purification',
    price: 500,
    image: '/crystals/Selenite_Wand/outer.jpeg',
    description: 'High-vibration crystal that cleanses and charges other stones.',
    properties: ['Cleansing', 'Purification', 'Peace', 'Clarity'],
    forms: [
      { name: 'Plain Plate', price: 500, image: '/crystals/Selenite_Plate/plain.jpeg' },
      { name: 'Design Plate', price: 600, image: '/crystals/Selenite_Plate/design.jpeg' }
    ]
  },
  {
    id: '16',
    name: 'Green Jade',
    purpose: 'Prosperity & Harmony',
    price: 500,
    image: '/crystals/Green_Jade/outer.jpeg',
    description: 'Stone of prosperity that brings harmony, luck, and abundance.',
    properties: ['Prosperity', 'Harmony', 'Luck', 'Balance'],
    forms: [
      { name: 'Bracelet', price: 500, image: '/crystals/Green_Jade/bracelet.jpeg' },
      { name: 'Pendant', price: 375, image: '/crystals/Green_Jade/pendant.jpeg' },
      { name: 'Tumble (Set of 2)', price: 250, image: '/crystals/Green_Jade/tumble.jpeg' },
      { name: 'Tree', price: 799, image: '/crystals/Green_Jade/tree.jpeg' },
      { name: 'Raw', price: 299, image: '/crystals/Green_Jade/raw.jpeg' }
    ]
  },
  {
    id: '17',
    name: 'Red Jasper',
    purpose: 'Strength & Vitality',
    price: 500,
    image: '/crystals/Red_Jasper/outer.jpeg',
    description: 'Stone of endurance that provides strength, courage, and vitality.',
    properties: ['Strength', 'Vitality', 'Courage', 'Endurance'],
    forms: [
      { name: 'Bracelet', price: 500, image: '/crystals/Red_Jasper/bracelet.jpeg' },
      { name: 'Pendant', price: 375, image: '/crystals/Red_Jasper/pendant.jpeg' },
      { name: 'Tumble (Set of 2)', price: 250, image: '/crystals/Red_Jasper/tumble.jpeg' },
      { name: 'Tree', price: 799, image: '/crystals/Red_Jasper/tree.jpeg' },
      { name: 'Raw', price: 299, image: '/crystals/Red_Jasper/raw.jpeg' }
    ]
  },
  {
    id: '18',
    name: 'Multi Fluorite',
    purpose: 'Mental Clarity & Focus',
    price: 625,
    image: '/crystals/Multi_Fluorite/outer.jpeg',
    description: 'Beautiful rainbow fluorite for enhanced mental clarity and concentration.',
    properties: ['Mental Clarity', 'Focus', 'Learning', 'Decision Making'],
    forms: [
      { name: 'Bracelet', price: 625, image: '/crystals/Multi_Fluorite/bracelet.jpeg' },
      { name: 'Pendant', price: 375, image: '/crystals/Multi_Fluorite/pendant.jpeg' },
      { name: 'Tumble (Set of 2)', price: 250, image: '/crystals/Multi_Fluorite/tumble.jpeg' },
      { name: 'Tree', price: 799, image: '/crystals/Multi_Fluorite/tree.jpeg' },
      { name: 'Raw', price: 299, image: '/crystals/Multi_Fluorite/raw.jpeg' }
    ]
  },
  {
    id: '19',
    name: 'Golden Pyrite',
    purpose: 'Abundance & Confidence',
    price: 500,
    image: '/crystals/Golden_Pyrite/outer.jpeg',
    description: 'Golden stone of abundance that boosts confidence and attracts wealth.',
    properties: ['Abundance', 'Confidence', 'Wealth', 'Success'],
    forms: [
      { name: 'Bracelet', price: 500, image: '/crystals/Golden_Pyrite/bracelet.jpeg' },
      { name: 'Pendant', price: 375, image: '/crystals/Golden_Pyrite/pendant.jpeg' },
      { name: 'Tumble (Set of 2)', price: 250, image: '/crystals/Golden_Pyrite/tumble.jpeg' },
      { name: 'Tree', price: 799, image: '/crystals/Golden_Pyrite/tree.jpeg' },
      { name: 'Raw', price: 299, image: '/crystals/Golden_Pyrite/raw.jpeg' }
    ]
  },
  {
    id: '20',
    name: 'Black Obsedian',
    purpose: 'Protection & Grounding',
    price: 500,
    image: '/crystals/Black_Obsedian/outer.jpeg',
    description: 'Powerful protective stone that shields against negativity and provides grounding.',
    properties: ['Protection', 'Grounding', 'Shield', 'Clarity'],
    forms: [
      { name: 'Bracelet', price: 500, image: '/crystals/Black_Obsedian/bracelet.jpeg' },
      { name: 'Pendant', price: 375, image: '/crystals/Black_Obsedian/pendant.jpeg' },
      { name: 'Tumble (Set of 2)', price: 250, image: '/crystals/Black_Obsedian/tumble.jpeg' },
      { name: 'Tree', price: 799, image: '/crystals/Black_Obsedian/tree.jpeg' },
      { name: 'Raw', price: 299, image: '/crystals/Black_Obsedian/raw.jpeg' }
    ]
  },
  {
    id: '21',
    name: 'Howlite',
    purpose: 'Calming & Peace',
    price: 500,
    image: '/crystals/Howlite/outer.jpeg',
    description: 'Calming stone that reduces stress, anxiety, and promotes peaceful sleep.',
    properties: ['Calming', 'Peace', 'Sleep', 'Stress Relief'],
    forms: [
      { name: 'Bracelet', price: 500, image: '/crystals/Howlite/bracelet.jpeg' },
      { name: 'Pendant', price: 375, image: '/crystals/Howlite/pendant.jpeg' },
      { name: 'Tumble (Set of 2)', price: 250, image: '/crystals/Howlite/tumble.jpeg' },
      { name: 'Tree', price: 799, image: '/crystals/Howlite/tree.jpeg' },
      { name: 'Raw', price: 299, image: '/crystals/Howlite/raw.jpeg' }
    ]
  },
  {
    id: 'mixels',
    name: 'Mixels',
    purpose: 'Crystal Combinations',
    price: 500,
    image: '/crystals/Mixels/7_chakra_bracelet.jpeg',
    description: 'Beautiful combination bracelets with multiple crystals for enhanced energy and healing.',
    properties: ['Combination', 'Enhanced Energy', 'Multi-Purpose', 'Healing'],
    category: 'Mixels',
    forms: [
      { name: '7 Chakras (all combos)', price: 500, image: '/crystals/Mixels/7_chakra_bracelet.jpeg' },
      { name: 'Money Magnet (Citrine + Green Aventurine + Pyrite + Tiger Eye)', price: 750, image: '/crystals/Mixels/money_magnet.jpeg' },
      { name: 'Triple Protection (Tiger Eye + Black Obsedian + Haemetite)', price: 500, image: '/crystals/Mixels/c.jpeg' },
      { name: 'Wall Hangings (Negativity Protection)', price: 450, image: '/crystals/Wall_Hangings/1.jpg' },
      { name: 'Evil Eye Hangings', price: 300, image: '/crystals/Wall_Hangings/evil_eye.jpeg' }
    ]
  }
];