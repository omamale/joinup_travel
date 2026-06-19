export interface DestPlace {
  name: string;
  category: string;
  image: string;
  description: string;
  rating: number;
  timings: string;
  entryFee: string;
}

export interface DestHotel {
  name: string;
  stars: number;
  pricePerNight: number;
  image: string;
  area: string;
  highlights: string[];
}

export interface DestinationData {
  name: string;
  heroImage: string;
  tagline: string;
  description: string;
  bestTime: string;
  budgetRange: string;
  recommendedDays: string;
  travelOptions: { mode: string; info: string; cost: string }[];
  places: DestPlace[];
  hotels: DestHotel[];
  tips: string[];
}

export const DESTINATIONS: Record<string, DestinationData> = {
  Goa: {
    name: 'Goa',
    heroImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200&q=80',
    tagline: 'Sun, Sand & Soul',
    description: "India's smallest state packs a massive punch — stunning beaches, Portuguese heritage, world-class seafood, and a nightlife scene unlike anywhere else in the country.",
    bestTime: 'November – February',
    budgetRange: '₹8,000 – ₹25,000 per person',
    recommendedDays: '4 – 6 days',
    travelOptions: [
      { mode: '✈️ By Air', info: 'Nearest airport: Goa (GOI) — Dabolim & Mopa', cost: '₹3,000 – ₹10,000' },
      { mode: '🚂 By Train', info: 'Madgaon (MAO) & Thivim (THVM) stations', cost: '₹500 – ₹2,500' },
      { mode: '🚗 By Road', info: 'Well connected via NH66 & NH748', cost: '₹2,000 – ₹5,000 fuel' },
    ],
    places: [
      {
        name: 'Baga Beach',
        category: 'Beach',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80',
        description: "Goa's most vibrant beach — shacks, water sports, parasailing, and electric nightlife all in one place. Best visited in the evening when the beach comes alive with music and crowds.",
        rating: 4.5,
        timings: 'Open 24 hours',
        entryFee: 'Free',
      },
      {
        name: 'Basilica of Bom Jesus',
        category: 'Heritage',
        image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&q=80',
        description: 'UNESCO World Heritage church housing the mortal remains of St. Francis Xavier. Stunning 16th-century baroque architecture that has survived 400+ years. One of the oldest churches in India.',
        rating: 4.7,
        timings: '9 AM – 6:30 PM, All days',
        entryFee: 'Free',
      },
      {
        name: 'Dudhsagar Falls',
        category: 'Nature',
        image: 'https://images.unsplash.com/photo-1552537376-3abf35237a55?w=600&q=80',
        description: "One of India's tallest waterfalls at 310 metres, set inside dense jungle. The name means 'Sea of Milk' — a dramatic four-tiered cascade best seen right after monsoon when it's at full force.",
        rating: 4.6,
        timings: '8 AM – 5 PM (Oct – May only)',
        entryFee: '₹400 per person',
      },
      {
        name: 'Fort Aguada',
        category: 'Heritage',
        image: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=600&q=80',
        description: '17th-century Portuguese fort with a preserved lighthouse offering panoramic views of the Arabian Sea. The fort was never conquered — a testament to Portuguese military engineering.',
        rating: 4.3,
        timings: '9:30 AM – 6 PM',
        entryFee: 'Free',
      },
      {
        name: 'Anjuna Flea Market',
        category: 'Market',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80',
        description: 'Iconic every-Wednesday flea market blending hippie culture with local handicrafts — silver jewellery, vintage finds, spices, and street food. Prices are very negotiable!',
        rating: 4.2,
        timings: 'Every Wednesday, 8 AM – Sunset',
        entryFee: 'Free',
      },
      {
        name: 'Palolem Beach',
        category: 'Beach',
        image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&q=80',
        description: "South Goa's most serene crescent-shaped beach, backed by coconut palms. Far quieter than North Goa — perfect for kayaking, dolphin spotting, and evenings at candlelit shacks.",
        rating: 4.6,
        timings: 'Open 24 hours',
        entryFee: 'Free',
      },
    ],
    hotels: [
      {
        name: 'Taj Holiday Village Resort',
        stars: 5,
        pricePerNight: 18000,
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80',
        area: 'Candolim Beach',
        highlights: ['Private beach', 'Infinity pool', 'Spa', 'Multiple restaurants'],
      },
      {
        name: 'The Park Calangute',
        stars: 4,
        pricePerNight: 7500,
        image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80',
        area: 'Calangute',
        highlights: ['Pool', 'Sea view rooms', 'Restaurant', 'Bar'],
      },
      {
        name: 'Lemon Tree Amarante',
        stars: 4,
        pricePerNight: 5500,
        image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80',
        area: 'Panjim',
        highlights: ['Pool', 'Gym', 'Restaurant', 'Free parking'],
      },
      {
        name: 'Zostel Goa',
        stars: 2,
        pricePerNight: 700,
        image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&q=80',
        area: 'Anjuna',
        highlights: ['Common kitchen', 'Social lounge', 'Bike rentals', 'Travel desk'],
      },
    ],
    tips: [
      'Book accommodation 2+ months ahead for the December–January peak season',
      'Hire a two-wheeler (₹300–400/day) — it\'s the best way to explore',
      'Try the Goan fish curry rice and xacuti at local restaurants',
      'North Goa for nightlife; South Goa for peace and quiet',
      'Carry cash — many beach shacks don\'t accept cards',
    ],
  },

  Manali: {
    name: 'Manali',
    heroImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80',
    tagline: 'Gateway to the Himalayas',
    description: 'A stunning Himalayan hill station at 2,050 metres in the Kullu Valley. Famous for snow-capped peaks, adventure sports, ancient temples, and the legendary Rohtang Pass.',
    bestTime: 'October – June (avoid monsoon)',
    budgetRange: '₹12,000 – ₹30,000 per person',
    recommendedDays: '5 – 7 days',
    travelOptions: [
      { mode: '✈️ By Air', info: 'Nearest airport: Kullu-Manali (KUU), Bhuntar', cost: '₹5,000 – ₹14,000' },
      { mode: '🚂 By Train', info: 'Nearest station: Chandigarh or Pathankot, then bus', cost: '₹600 – ₹3,500' },
      { mode: '🚗 By Road', info: 'Via NH3 Manali Highway — scenic mountain drive', cost: '₹3,500 – ₹8,000 fuel' },
    ],
    places: [
      {
        name: 'Rohtang Pass',
        category: 'Adventure',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
        description: 'At 3,978 metres, this snow-clad mountain pass offers breathtaking 360° Himalayan views and thrilling snowfield activities — skiing, snow bikes, and snowball fights. A bucket-list experience.',
        rating: 4.8,
        timings: '8 AM – 5 PM (permits required online)',
        entryFee: '₹550 per vehicle permit',
      },
      {
        name: 'Solang Valley',
        category: 'Adventure',
        image: 'https://images.unsplash.com/photo-1530521954074-e0a103ceff36?w=600&q=80',
        description: 'Adventure capital — paragliding, zorbing, snow tubing, skiing, and ropeway rides with dramatic Himalayan peaks on all sides. Best in winter for snow; great in summer for green meadows.',
        rating: 4.6,
        timings: '9 AM – 5 PM',
        entryFee: 'Activity-wise (₹200 – ₹2,500)',
      },
      {
        name: 'Hadimba Temple',
        category: 'Heritage',
        image: 'https://images.unsplash.com/photo-1610642372651-fe6e4d3b8b93?w=600&q=80',
        description: '16th-century cave temple dedicated to Hadimba Devi, set in a dense cedar forest. The four-tiered pagoda architecture with carved woodwork is exquisite. One of the most photographed temples in Himachal.',
        rating: 4.5,
        timings: '8 AM – 6 PM',
        entryFee: 'Free (donation appreciated)',
      },
      {
        name: 'Old Manali Village',
        category: 'Village',
        image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&q=80',
        description: 'The original village with charming cafes strung with fairy lights, apple orchards, and a relaxed backpacker vibe. Take a slow walk through the lanes and grab coffee with mountain views.',
        rating: 4.4,
        timings: 'All day',
        entryFee: 'Free',
      },
      {
        name: 'Beas River Rafting',
        category: 'Adventure',
        image: 'https://images.unsplash.com/photo-1591951425328-48c78ec28a97?w=600&q=80',
        description: 'Thrilling white-water rafting through Grade 3–4 rapids on the Beas River. Stretches from Pirdi to Jhiri (14 km) offer the most exciting rapids. Best between May and July.',
        rating: 4.7,
        timings: '9 AM – 4 PM',
        entryFee: '₹600 – ₹1,500 per person',
      },
      {
        name: 'Naggar Castle',
        category: 'Heritage',
        image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&q=80',
        description: 'A 500-year-old castle overlooking the Kullu valley, now converted into a heritage hotel with a small Roerich art museum. The views from the ramparts are absolutely stunning.',
        rating: 4.3,
        timings: '9 AM – 5 PM',
        entryFee: '₹50',
      },
    ],
    hotels: [
      {
        name: 'Span Resorts',
        stars: 5,
        pricePerNight: 12000,
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80',
        area: 'Kullu',
        highlights: ['River-facing rooms', 'Spa', 'Indoor pool', 'Adventure activities'],
      },
      {
        name: 'Apple Country Resort',
        stars: 4,
        pricePerNight: 6500,
        image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80',
        area: 'Old Manali',
        highlights: ['Mountain views', 'Bonfire', 'Restaurant', 'Apple orchard'],
      },
      {
        name: 'Snow Valley Resorts',
        stars: 3,
        pricePerNight: 3500,
        image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80',
        area: 'Manali town',
        highlights: ['Central location', 'Restaurant', 'Travel desk', 'Valley views'],
      },
      {
        name: 'The Hosteller Manali',
        stars: 2,
        pricePerNight: 800,
        image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&q=80',
        area: 'Old Manali',
        highlights: ['Social events', 'Cafe', 'Mountain views', 'Group tours'],
      },
    ],
    tips: [
      'Book Rohtang Pass permits online 1–2 days in advance — limited daily slots',
      'Carry warm layers even in summer — nights get very cold at this altitude',
      'Try the local siddu (steamed bread) and fresh trout fish dishes',
      'Negotiate taxi rates in advance and agree on waiting charges',
      'Avoid the July–September monsoon season due to landslide risk on mountain roads',
    ],
  },

  Rishikesh: {
    name: 'Rishikesh',
    heroImage: 'https://images.unsplash.com/photo-1591951425328-48c78ec28a97?w=1200&q=80',
    tagline: 'Yoga, Rafting & the Holy Ganga',
    description: 'The yoga capital of the world, set where the Ganga emerges from the Himalayas. Perfect for spiritual seekers and adrenaline junkies alike — white-water rafting, bungee jumping, and ashram retreats all in one place.',
    bestTime: 'September – June',
    budgetRange: '₹5,000 – ₹18,000 per person',
    recommendedDays: '3 – 5 days',
    travelOptions: [
      { mode: '✈️ By Air', info: 'Nearest airport: Jolly Grant, Dehradun (DED)', cost: '₹4,000 – ₹12,000' },
      { mode: '🚂 By Train', info: 'Haridwar station (24 km) — best connected rail head', cost: '₹400 – ₹2,500' },
      { mode: '🚗 By Road', info: 'Connected via NH58 — scenic Ganga valley drive', cost: '₹2,500 – ₹6,000 fuel' },
    ],
    places: [
      {
        name: 'Laxman Jhula',
        category: 'Heritage',
        image: 'https://images.unsplash.com/photo-1591951425328-48c78ec28a97?w=600&q=80',
        description: 'Iconic iron suspension bridge over the Ganga, lined with temples, cafes, and ashrams. According to legend, Lord Laxman crossed the Ganga here on a jute rope. The bridge and surrounding ghats are the heart of Rishikesh.',
        rating: 4.6,
        timings: 'All day',
        entryFee: 'Free',
      },
      {
        name: 'Triveni Ghat Aarti',
        category: 'Spiritual',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80',
        description: 'The main bathing ghat on the Ganga. The evening Ganga Aarti here — with fire, flowers, and chanting — is one of India\'s most moving spiritual experiences. Arrive 30 minutes early for a good spot.',
        rating: 4.8,
        timings: 'Aarti at 6 PM daily',
        entryFee: 'Free',
      },
      {
        name: 'Ganga White Water Rafting',
        category: 'Adventure',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80',
        description: 'Thrilling rapids from Shivpuri to Rishikesh — Grade 3+ rapids through spectacular Himalayan gorges with rapids named "The Wall", "Three Blind Mice", and "Golf Course". Best March–June and Sept–Nov.',
        rating: 4.9,
        timings: '8 AM – 4 PM (seasonal)',
        entryFee: '₹600 – ₹2,500 per person',
      },
      {
        name: 'Beatles Ashram',
        category: 'Heritage',
        image: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=600&q=80',
        description: 'Abandoned ashram where John Lennon, Paul McCartney, George Harrison and Ringo Starr stayed in 1968 to study transcendental meditation. Now jungle ruins covered in stunning colourful street art.',
        rating: 4.4,
        timings: '8 AM – 5 PM',
        entryFee: '₹600 (foreigners), ₹150 (Indians)',
      },
      {
        name: 'Bungee Jumping — Jumpin Heights',
        category: 'Adventure',
        image: 'https://images.unsplash.com/photo-1530521954074-e0a103ceff36?w=600&q=80',
        description: "India's highest bungee jump at 83 metres from a fixed platform over a river gorge. Book 1–2 days in advance as slots fill up. Not for the faint-hearted — but utterly unforgettable.",
        rating: 4.8,
        timings: '9 AM – 5 PM (closed Tues)',
        entryFee: '₹3,550 per jump',
      },
      {
        name: 'Rajaji National Park',
        category: 'Nature',
        image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80',
        description: 'Vast wildlife sanctuary at the Himalayan foothills — home to wild elephants, leopards, tigers (rare), and over 315 bird species. Jeep safaris in the morning offer the best wildlife sightings.',
        rating: 4.5,
        timings: '6 AM – 6 PM (Oct – June)',
        entryFee: '₹250 (Indians) + jeep hire',
      },
    ],
    hotels: [
      {
        name: 'Ananda in the Himalayas',
        stars: 5,
        pricePerNight: 35000,
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80',
        area: 'Narendra Nagar',
        highlights: ['World-class spa', 'Yoga & Ayurveda', 'Himalayan views', 'Gourmet dining'],
      },
      {
        name: 'The Glasshouse on the Ganges',
        stars: 4,
        pricePerNight: 8000,
        image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80',
        area: 'Ganga banks',
        highlights: ['Riverside rooms', 'Garden', 'Yoga deck', 'Restaurant'],
      },
      {
        name: 'Atali Ganga Resort',
        stars: 3,
        pricePerNight: 4500,
        image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80',
        area: 'Marine Drive',
        highlights: ['Riverside', 'Adventure packages', 'Bonfire', 'Yoga'],
      },
      {
        name: 'Zostel Rishikesh',
        stars: 2,
        pricePerNight: 600,
        image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&q=80',
        area: 'Laxman Jhula',
        highlights: ['Ganga views', 'Social events', 'Cafe', 'Rafting packages'],
      },
    ],
    tips: [
      'Non-veg food and alcohol are strictly prohibited in central Rishikesh',
      'Book adventure activities through GMVN or registered operators only — avoid touts',
      'The Triveni Ghat evening Aarti is unforgettable — arrive 30 min early',
      'Stay in Tapovan / Laxman Jhula area for the best café and ashram vibe',
      'Yoga centres offer 1-day drop-in classes from ₹500 — no need to book a full retreat',
    ],
  },

  Rajasthan: {
    name: 'Rajasthan',
    heroImage: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&q=80',
    tagline: 'Land of Maharajas & Desert Sands',
    description: "Rajasthan is India at its most magnificent — towering forts, opulent palaces, vibrant festivals, and the world's most romantic desert. A sensory overload in the best possible way.",
    bestTime: 'October – March',
    budgetRange: '₹10,000 – ₹40,000 per person',
    recommendedDays: '7 – 10 days',
    travelOptions: [
      { mode: '✈️ By Air', info: 'Major airports: Jaipur (JAI), Jodhpur (JDH), Udaipur (UDR)', cost: '₹3,000 – ₹10,000' },
      { mode: '🚂 By Train', info: 'Excellent rail connectivity to Jaipur, Jodhpur & Udaipur', cost: '₹400 – ₹2,500' },
      { mode: '🚗 By Road', info: 'Best explored by private car — classic Jaipur→Jodhpur→Jaisalmer→Udaipur circuit', cost: '₹5,000 – ₹15,000' },
    ],
    places: [
      {
        name: 'Amber Fort, Jaipur',
        category: 'Heritage',
        image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&q=80',
        description: 'A breathtaking hilltop fort with intricate mirror-work halls (Sheesh Mahal), elephant rides up the ramp, and panoramic views of Maota Lake. Built in 1592 — one of Rajasthan\'s most magnificent forts.',
        rating: 4.7,
        timings: '8 AM – 5:30 PM',
        entryFee: '₹100 (Indians) / ₹500 (foreigners)',
      },
      {
        name: 'Hawa Mahal, Jaipur',
        category: 'Heritage',
        image: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=600&q=80',
        description: 'The iconic "Palace of Winds" with 953 intricately latticed windows — designed so royal ladies could observe street festivals without being seen. One of the most recognisable monuments in India.',
        rating: 4.5,
        timings: '9 AM – 4:30 PM',
        entryFee: '₹50 (Indians)',
      },
      {
        name: 'Lake Pichola, Udaipur',
        category: 'Nature',
        image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&q=80',
        description: 'Stunning 4th-century artificial lake with the legendary Taj Lake Palace (used in James Bond\'s Octopussy) rising from its waters. Sunset boat rides past ghats and palaces are pure magic.',
        rating: 4.8,
        timings: 'All day',
        entryFee: '₹400 (boat ride)',
      },
      {
        name: 'Mehrangarh Fort, Jodhpur',
        category: 'Heritage',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80',
        description: 'One of India\'s largest and most imposing forts, rising 120 metres above the Blue City. The museum inside is world-class — ancient weaponry, royal palanquins, and stunning city views from the ramparts.',
        rating: 4.8,
        timings: '9 AM – 5 PM',
        entryFee: '₹100 (Indians) / ₹600 (foreigners)',
      },
      {
        name: 'Sam Sand Dunes, Jaisalmer',
        category: 'Adventure',
        image: 'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=600&q=80',
        description: 'Golden Thar Desert dunes stretching to the horizon — camel safaris at sunset, overnight camping under the stars, and folk music around the bonfire. The most authentic desert experience in India.',
        rating: 4.7,
        timings: 'Best at sunset and sunrise',
        entryFee: 'Camel safari ₹500 – ₹2,000',
      },
      {
        name: 'Ranthambore National Park',
        category: 'Nature',
        image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80',
        description: 'One of India\'s best places to spot Bengal tigers in the wild — a dramatic landscape of ancient fort ruins, lakes, and jungle. Book safaris well in advance as they fill up months ahead.',
        rating: 4.6,
        timings: '6 AM – 6 PM (Oct – June)',
        entryFee: '₹1,200 – ₹2,000 per safari',
      },
    ],
    hotels: [
      {
        name: 'Rambagh Palace, Jaipur',
        stars: 5,
        pricePerNight: 45000,
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80',
        area: 'Jaipur',
        highlights: ['Former royal palace', 'Polo ground', 'Spa', 'Multiple restaurants'],
      },
      {
        name: 'Taj Lake Palace, Udaipur',
        stars: 5,
        pricePerNight: 38000,
        image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80',
        area: 'Lake Pichola',
        highlights: ['Island palace', 'Rooftop pool', 'Spa', 'Boat access only'],
      },
      {
        name: 'WelcomHeritage Bal Samand',
        stars: 4,
        pricePerNight: 8000,
        image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80',
        area: 'Jodhpur',
        highlights: ['Garden palace', 'Pool', 'Heritage property', 'Rajasthani cuisine'],
      },
      {
        name: 'Moustache Hostel Jaipur',
        stars: 2,
        pricePerNight: 500,
        image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&q=80',
        area: 'Old City',
        highlights: ['Rooftop cafe', 'Social events', 'Guided walks', 'Budget-friendly'],
      },
    ],
    tips: [
      'Follow the Jaipur → Jodhpur → Jaisalmer → Udaipur circuit for the best experience',
      'Bargaining is expected in markets — start at 40% of the asking price',
      'Dress modestly when visiting temples and forts — cover shoulders and knees',
      'Try laal maas (spicy mutton), dal baati churma, and ghewar sweets',
      'Book Ranthambore safari slots 90+ days in advance — they sell out fast',
    ],
  },

  Kerala: {
    name: 'Kerala',
    heroImage: 'https://images.unsplash.com/photo-1602301878688-72303a3e3d30?w=1200&q=80',
    tagline: "God's Own Country",
    description: "Kerala is India's most lush destination — tranquil backwaters, misty tea gardens, pristine beaches, incredible Ayurvedic spas, and some of the world's freshest seafood.",
    bestTime: 'September – March',
    budgetRange: '₹10,000 – ₹30,000 per person',
    recommendedDays: '5 – 8 days',
    travelOptions: [
      { mode: '✈️ By Air', info: 'Major airports: Kochi (COK), Thiruvananthapuram (TRV), Kozhikode (CCJ)', cost: '₹3,500 – ₹12,000' },
      { mode: '🚂 By Train', info: 'Excellent coastal rail network — Kochi, Alleppey, Varkala, Trivandrum', cost: '₹300 – ₹2,500' },
      { mode: '🚗 By Road', info: 'Scenic NH66 coastal highway connecting all major towns', cost: '₹3,000 – ₹8,000 fuel' },
    ],
    places: [
      {
        name: 'Alleppey Backwaters',
        category: 'Nature',
        image: 'https://images.unsplash.com/photo-1602301878688-72303a3e3d30?w=600&q=80',
        description: 'The "Venice of the East" — a lazy network of 1,900 km of canals, lakes, and rivers. An overnight houseboat journey watching village life drift by is one of India\'s most unique experiences.',
        rating: 4.9,
        timings: 'All day',
        entryFee: 'Houseboat ₹5,000 – ₹15,000/night',
      },
      {
        name: 'Munnar Tea Gardens',
        category: 'Nature',
        image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&q=80',
        description: 'Endless rolling hills blanketed in emerald tea plantations at 1,600 metres — one of the most scenic landscapes in South India. Visit a working tea factory for free behind-the-scenes tours.',
        rating: 4.7,
        timings: 'All day',
        entryFee: 'Free (tea factory ₹75)',
      },
      {
        name: 'Fort Kochi',
        category: 'Heritage',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80',
        description: 'A melting pot of Portuguese, Dutch, and British history — iconic Chinese fishing nets on the seafront, a 16th-century Jewish synagogue, Dutch cemetery, and vibrant street art in a walkable heritage district.',
        rating: 4.6,
        timings: 'All day',
        entryFee: 'Free',
      },
      {
        name: 'Varkala Beach',
        category: 'Beach',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80',
        description: 'Dramatic red laterite cliffs overlooking the Arabian Sea — a truly unique beach setting. The cliff-top is lined with yoga studios, Ayurvedic massage centres, and restaurants with sea views.',
        rating: 4.5,
        timings: 'All day',
        entryFee: 'Free',
      },
      {
        name: 'Periyar Wildlife Sanctuary',
        category: 'Nature',
        image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80',
        description: 'Unique wildlife experience — boat safaris on Periyar Lake where wild elephants come to bathe on the lakeside. Also home to tigers, leopards, gaur, and 265 bird species in 925 sq km of forest.',
        rating: 4.6,
        timings: '7 AM – 6 PM',
        entryFee: '₹150 (Indians) + boat ₹120',
      },
      {
        name: 'Kovalam Beach',
        category: 'Beach',
        image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&q=80',
        description: 'Three adjacent crescent-shaped beaches flanked by rocky headlands near Thiruvananthapuram. Known for Ayurvedic resorts, calm surf, and lighthouse views. The most accessible beach from Trivandrum airport.',
        rating: 4.4,
        timings: 'All day',
        entryFee: 'Free',
      },
    ],
    hotels: [
      {
        name: 'Kumarakom Lake Resort',
        stars: 5,
        pricePerNight: 22000,
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80',
        area: 'Kumarakom',
        highlights: ['Private pool villas', 'Ayurveda centre', 'Backwater views', 'Heritage setting'],
      },
      {
        name: 'Fragrant Nature Backwater Resort',
        stars: 4,
        pricePerNight: 8500,
        image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80',
        area: 'Kollam',
        highlights: ['Backwater location', 'Ayurveda', 'Pool', 'Boat rides'],
      },
      {
        name: 'Tea Valley Resort, Munnar',
        stars: 3,
        pricePerNight: 4500,
        image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80',
        area: 'Munnar',
        highlights: ['Tea garden views', 'Restaurant', 'Trekking', 'Bonfire'],
      },
      {
        name: 'Zostel Kochi',
        stars: 2,
        pricePerNight: 600,
        image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&q=80',
        area: 'Fort Kochi',
        highlights: ['Heritage building', 'Cafe', 'Walking distance to sights', 'Social events'],
      },
    ],
    tips: [
      'Book houseboats directly with operators in Alleppey — avoid middlemen for better prices',
      'Visit during Onam festival (Aug–Sep) for Kerala\'s most spectacular cultural celebrations',
      'Try Karimeen (pearl spot fish curry), appam with stew, and banana chips',
      'Kerala is one of India\'s safest and cleanest states — great for solo travellers',
      'Carry mosquito repellent for backwater and jungle areas',
    ],
  },

  Ladakh: {
    name: 'Ladakh',
    heroImage: 'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=1200&q=80',
    tagline: 'The Land of High Passes',
    description: "Earth's most surreal landscape — barren moonscapes, sapphire lakes at 4,000+ metres, ancient Buddhist monasteries, and a silence so deep it feels spiritual. A once-in-a-lifetime destination.",
    bestTime: 'June – September',
    budgetRange: '₹20,000 – ₹50,000 per person',
    recommendedDays: '7 – 10 days',
    travelOptions: [
      { mode: '✈️ By Air', info: 'Leh Kushok Bakula Rimpochee Airport (IXL) — direct flights from Delhi, Mumbai', cost: '₹5,000 – ₹18,000' },
      { mode: '🚗 Manali–Leh Highway', info: 'Epic 490 km mountain road via Rohtang & Baralacha passes (2 days)', cost: '₹3,000 – ₹6,000 per person' },
      { mode: '🚗 Srinagar–Leh Highway', info: 'Scenic 434 km route via Zoji La pass — pass open June–Nov', cost: '₹2,500 – ₹5,000 per person' },
    ],
    places: [
      {
        name: 'Pangong Tso Lake',
        category: 'Nature',
        image: 'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=600&q=80',
        description: 'The legendary lake at 4,350 metres that shifts from turquoise to cobalt to emerald as the light changes — famously featured in 3 Idiots. 60% of the lake lies in Tibet. Overnight camping on the banks is unforgettable.',
        rating: 4.9,
        timings: 'All day (permit required)',
        entryFee: '₹400 (Inner Line Permit)',
      },
      {
        name: 'Nubra Valley & Bactrian Camels',
        category: 'Adventure',
        image: 'https://images.unsplash.com/photo-1530521954074-e0a103ceff36?w=600&q=80',
        description: 'Cross Khardung La — the world\'s highest motorable pass at 5,359 m — to reach this stunning valley with double-humped Bactrian camels and sand dunes. Hunder village is a highlight.',
        rating: 4.8,
        timings: 'All day',
        entryFee: 'Inner Line Permit required',
      },
      {
        name: 'Leh Palace',
        category: 'Heritage',
        image: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=600&q=80',
        description: '17th-century nine-storey former royal palace towering above Leh town, modelled on the Potala Palace in Lhasa. Incredible views of the Zanskar and Karakoram ranges from the rooftop.',
        rating: 4.5,
        timings: '8 AM – 1 PM & 2 PM – 6 PM',
        entryFee: '₹15',
      },
      {
        name: 'Thiksey Monastery',
        category: 'Spiritual',
        image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&q=80',
        description: 'The most visually striking monastery in Ladakh — a 12-storey complex of white-washed buildings rising from a rocky hilltop. Contains a magnificent 15-metre Maitreya Buddha. Morning prayers at 6 AM are special.',
        rating: 4.7,
        timings: '6 AM – 9 PM',
        entryFee: '₹30',
      },
      {
        name: 'Magnetic Hill',
        category: 'Wonder',
        image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&q=80',
        description: 'A famous optical illusion on the Leh-Kargil highway where vehicles appear to roll uphill against gravity due to the surrounding hills creating a false horizon effect. A fun stop on the way to Kargil.',
        rating: 4.2,
        timings: 'All day',
        entryFee: 'Free',
      },
      {
        name: 'Zanskar River Rafting',
        category: 'Adventure',
        image: 'https://images.unsplash.com/photo-1591951425328-48c78ec28a97?w=600&q=80',
        description: 'Remote and dramatic Grade 4–5 rafting through deep gorges carved by the turquoise Zanskar river. One of the most adventurous rafting experiences in Asia — completely cut off from roads.',
        rating: 4.7,
        timings: 'July – September only',
        entryFee: '₹3,000 – ₹15,000 per person',
      },
    ],
    hotels: [
      {
        name: 'The Grand Dragon Ladakh',
        stars: 4,
        pricePerNight: 12000,
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80',
        area: 'Leh',
        highlights: ['Mountain views', 'Restaurant', 'Spa', 'Oxygen-enriched rooms'],
      },
      {
        name: 'Nimmu House',
        stars: 4,
        pricePerNight: 9000,
        image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80',
        area: 'Nimmu Village',
        highlights: ['Heritage property', 'Indus river views', 'Home-cooked meals', 'Stargazing deck'],
      },
      {
        name: 'Padma Hotel',
        stars: 3,
        pricePerNight: 3500,
        image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80',
        area: 'Leh town',
        highlights: ['Central location', 'Restaurant', 'Garden', 'Budget-friendly'],
      },
      {
        name: 'Jungle Camp Nubra',
        stars: 2,
        pricePerNight: 2500,
        image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&q=80',
        area: 'Nubra Valley',
        highlights: ['Glamping tents', 'Camel safari', 'Bonfire', 'Stargazing'],
      },
    ],
    tips: [
      'Spend 2–3 days in Leh to acclimatise before going to high-altitude areas — altitude sickness is real',
      'Inner Line Permits (ILP) are required for Pangong, Nubra, Tso Moriri — get them in Leh',
      'Carry cash — ATMs are limited, often out of cash, and network is patchy',
      'The stargazing in Ladakh is among the best on earth — carry a blanket for night sky sessions',
      'Hire a local taxi union taxi rather than private vehicles for better navigation and fair rates',
    ],
  },
};

// Sentinel value in heroImage field → means "fetch real photo from Wikipedia"
export const WIKI_PHOTO_SENTINEL = '__WIKI__';

// ─── hotel image pool (real hotel photos) ────────────────────────────────────
const HOTEL_POOL = [
  '1566073771259-6a8506099945',
  '1520250497591-112f2f40a3f4',
  '1551882547-ff40c63fe5fa',
  '1555854877-bab0e564b8d5',
  '1571896349842-33c89424de2d',
  '1445019980597-93fa8acb246c',
  '1542314831-068cd1dbfeeb',
  '1502602898657-3e91760cbb34',
];

// ─── real category-specific Unsplash photos ───────────────────────────────────
const CATEGORY_PHOTOS: Record<string, string[]> = {
  heritage: [
    'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&q=80', // Amber Fort
    'https://images.unsplash.com/photo-1580127941733-ec5fb3c13580?w=600&q=80', // fort wall
    'https://images.unsplash.com/photo-1548013146-72479768bada?w=600&q=80',    // Taj Mahal
    'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=600&q=80', // Fort Aguada
  ],
  temple: [
    'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=600&q=80', // Hampi temple
    'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&q=80', // temple gopuram
    'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&q=80', // temple exterior
    'https://images.unsplash.com/photo-1614082242765-7c98ca0f3df3?w=600&q=80', // south india temple
  ],
  nature: [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80', // mountain viewpoint
    'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=80', // green hills
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&q=80', // nature valley
    'https://images.unsplash.com/photo-1598977983980-35c1cf2c4eb4?w=600&q=80', // India landscape
  ],
  market: [
    'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&q=80', // India street market
    'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600&q=80', // colourful market
    'https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=600&q=80', // bazaar
  ],
  waterfall: [
    'https://images.unsplash.com/photo-1552537376-3abf35237a55?w=600&q=80', // Dudhsagar
    'https://images.unsplash.com/photo-1564574685734-b3a5c70bc5cc?w=600&q=80', // waterfall India
    'https://images.unsplash.com/photo-1431440869543-efaf3388c585?w=600&q=80', // waterfall forest
  ],
  museum: [
    'https://images.unsplash.com/photo-1564399580075-5dfe19c205f3?w=600&q=80', // museum interior
    'https://images.unsplash.com/photo-1580127941733-ec5fb3c13580?w=600&q=80', // heritage building
    'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&q=80', // palace/museum
  ],
};

function hashNum(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function pick<T>(arr: T[], seed: number, offset = 0): T {
  return arr[(seed + offset) % arr.length];
}

function generateFallbackDestination(name: string): DestinationData {
  const seed = hashNum(name);
  const n = name.trim();

  const taglines = [
    'Hidden Gem of India', 'Off the Beaten Path', 'Where Stories Begin',
    'Discover the Real India', 'A Land of Wonders', 'Culture & Nature Await',
    'Timeless Beauty', "India's Best Kept Secret",
  ];

  const budgets = [
    '₹5,000 – ₹15,000 per person', '₹8,000 – ₹20,000 per person',
    '₹6,000 – ₹18,000 per person', '₹10,000 – ₹30,000 per person',
  ];

  const dayRanges = ['3 – 4 days', '4 – 5 days', '3 – 5 days', '5 – 7 days', '2 – 3 days'];

  const bestTimes = [
    'October to March', 'November to February', 'September to June',
    'October to April', 'November to March', 'Year-round',
  ];

  const placeCategories = [
    { cat: 'Heritage', pool: 'heritage', suffix: 'Fort',        rating: 4.4, fee: '₹50 – ₹200', time: '9 AM – 6 PM' },
    { cat: 'Temple',   pool: 'temple',   suffix: 'Temple',      rating: 4.6, fee: 'Free',        time: '6 AM – 8 PM' },
    { cat: 'Nature',   pool: 'nature',   suffix: 'Viewpoint',   rating: 4.3, fee: 'Free',        time: 'Sunrise – Sunset' },
    { cat: 'Market',   pool: 'market',   suffix: 'Local Bazaar',rating: 4.2, fee: 'Free',        time: '10 AM – 9 PM' },
    { cat: 'Nature',   pool: 'waterfall',suffix: 'Waterfall',   rating: 4.5, fee: '₹30 – ₹100', time: '8 AM – 5 PM' },
    { cat: 'Museum',   pool: 'museum',   suffix: 'Museum',      rating: 4.1, fee: '₹20 – ₹50',  time: '10 AM – 5 PM, Closed Mon' },
  ];

  const places: DestPlace[] = placeCategories.map((p, i) => ({
    name: `${n} ${p.suffix}`,
    category: p.cat,
    image: pick(CATEGORY_PHOTOS[p.pool], seed, i),
    description: `One of the most iconic attractions in ${n}. A must-visit spot that showcases the local culture, architecture and natural beauty of this destination. Visitors love the authentic atmosphere and photo opportunities here.`,
    rating: p.rating,
    timings: p.time,
    entryFee: p.fee,
  }));

  const hotels: DestHotel[] = [
    {
      name: `${n} Budget Guesthouse`,
      stars: 2,
      pricePerNight: 800 + (seed % 700),
      image: `https://images.unsplash.com/photo-${pick(HOTEL_POOL, seed, 0)}?w=400&q=80`,
      area: `${n} Town Centre`,
      highlights: ['Free Wi-Fi', 'Hot Water', 'Local Breakfast', 'Travel Desk'],
    },
    {
      name: `Hotel ${n} Comfort Inn`,
      stars: 3,
      pricePerNight: 2500 + (seed % 2000),
      image: `https://images.unsplash.com/photo-${pick(HOTEL_POOL, seed, 1)}?w=400&q=80`,
      area: `${n} Main Road`,
      highlights: ['Air Conditioning', 'Restaurant', 'Room Service', '24/7 Reception'],
    },
    {
      name: `${n} Heritage Resort`,
      stars: 4,
      pricePerNight: 6000 + (seed % 4000),
      image: `https://images.unsplash.com/photo-${pick(HOTEL_POOL, seed, 2)}?w=400&q=80`,
      area: `${n} Outskirts`,
      highlights: ['Swimming Pool', 'Spa', 'Fine Dining', 'Scenic Views'],
    },
    {
      name: `The Grand ${n}`,
      stars: 5,
      pricePerNight: 12000 + (seed % 8000),
      image: `https://images.unsplash.com/photo-${pick(HOTEL_POOL, seed, 3)}?w=400&q=80`,
      area: `${n} Premium Zone`,
      highlights: ['Luxury Suites', 'Infinity Pool', 'Multi-cuisine Restaurant', 'Concierge'],
    },
  ];

  return {
    name: n,
    heroImage: WIKI_PHOTO_SENTINEL,
    tagline: pick(taglines, seed),
    description: `${n} is a captivating destination in India with its own unique blend of culture, history, and natural beauty. Whether you're seeking adventure, spiritual experiences, local cuisine, or simply a break from city life — ${n} offers something special for every kind of traveller.`,
    bestTime: pick(bestTimes, seed),
    budgetRange: pick(budgets, seed),
    recommendedDays: pick(dayRanges, seed),
    travelOptions: [
      { mode: '✈️ By Air', info: `Fly to the nearest major airport and take road/train to ${n}`, cost: '₹3,000 – ₹12,000' },
      { mode: '🚂 By Train', info: `Check trains to ${n} or nearest railway station on IRCTC`, cost: '₹300 – ₹2,000' },
      { mode: '🚗 By Road', info: 'Well connected via state and national highways', cost: '₹500 – ₹4,000 fuel' },
    ],
    places,
    hotels,
    tips: [
      `Book accommodation in advance during peak season (Oct–Feb) as ${n} fills up quickly`,
      'Carry cash — smaller towns and local markets may not accept cards',
      'Hire a local guide for the first day to get the best insider knowledge',
      "Try the local street food — it's the most authentic and affordable dining experience",
      'Respect local customs and dress modestly when visiting temples and religious sites',
    ],
  };
}

export function getDestination(name: string): DestinationData {
  const decoded = decodeURIComponent(name).trim();
  const key = Object.keys(DESTINATIONS).find(
    (k) => k.toLowerCase() === decoded.toLowerCase(),
  );
  return key ? DESTINATIONS[key] : generateFallbackDestination(decoded);
}

export const ALL_DESTINATIONS = Object.values(DESTINATIONS);
