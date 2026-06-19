import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { AIPlannerDto } from './dto/ai-planner.dto';

/* ─────────────────────────── destination database ─────────────── */

interface DestActivity {
  name: string;
  description: string;
  location: string;
  duration: string;
  cost: number;
  type: 'SIGHTSEEING' | 'ADVENTURE' | 'FOOD' | 'SHOPPING' | 'TRANSPORT' | 'REST';
  tags: ('relaxed' | 'adventure' | 'cultural' | 'nature')[];
}

interface DestRestaurant {
  name: string;
  cuisine: string;
  costPerPerson: number;
  isVeg: boolean;
  mustTry: string;
  tier: 'budget' | 'mid' | 'luxury';
}

interface DestHotelOption {
  name: string;
  location: string;
  pricePerNight: number;
  rating: number;
  amenities: string[];
  tier: 'budget' | 'mid' | 'luxury';
}

interface DestData {
  bestTime: string;
  type: string;
  summary: string;
  activities: DestActivity[];
  restaurants: DestRestaurant[];
  hotels: DestHotelOption[];
  tips: string[];
  packing: string[];
  transport: {
    byAir: { duration: string; cost: number; airlines: string[] };
    byTrain: { duration: string; cost: number; trains: string[] };
    byRoad: { duration: string; cost: number };
  };
}

const DEST_DB: Record<string, DestData> = {
  goa: {
    bestTime: 'November to February',
    type: 'beach',
    summary: 'Goa blends sun-drenched beaches, Portuguese heritage, vibrant nightlife and incredible seafood into an unforgettable coastal escape. Perfect for relaxation and celebration alike.',
    activities: [
      { name: 'Baga Beach', description: 'Start with Goa\'s most iconic beach — soak the sun, try water sports and grab fresh coconut water from the shacks.', location: 'Baga, North Goa', duration: '3 hours', cost: 0, type: 'SIGHTSEEING', tags: ['relaxed', 'adventure'] },
      { name: 'Calangute Water Sports', description: 'Parasailing, jet skiing and banana boat rides with the Arabian Sea as your playground.', location: 'Calangute Beach', duration: '2 hours', cost: 1800, type: 'ADVENTURE', tags: ['adventure'] },
      { name: 'Basilica of Bom Jesus', description: 'UNESCO World Heritage 16th-century baroque church housing the mortal remains of St. Francis Xavier.', location: 'Old Goa', duration: '1.5 hours', cost: 0, type: 'SIGHTSEEING', tags: ['relaxed', 'cultural'] },
      { name: 'Fort Aguada', description: '17th-century Portuguese fort with a preserved lighthouse and panoramic views of the Arabian Sea.', location: 'Candolim', duration: '1.5 hours', cost: 0, type: 'SIGHTSEEING', tags: ['relaxed', 'cultural'] },
      { name: 'Dudhsagar Falls Trek', description: 'Four-tiered waterfall inside dense jungle — one of India\'s tallest at 310 metres. A jaw-dropping day trip.', location: 'Mollem National Park', duration: '6 hours', cost: 800, type: 'ADVENTURE', tags: ['adventure', 'nature'] },
      { name: 'Anjuna Flea Market', description: 'Iconic Wednesday market blending hippie culture with local handicrafts — jewellery, spices, vintage finds.', location: 'Anjuna', duration: '2 hours', cost: 500, type: 'SHOPPING', tags: ['relaxed', 'cultural'] },
      { name: 'Palolem Beach Kayaking', description: 'Paddle through calm waters at Goa\'s most serene beach — perfect for dolphin spotting.', location: 'Palolem, South Goa', duration: '2 hours', cost: 600, type: 'ADVENTURE', tags: ['adventure', 'nature'] },
      { name: 'Spice Plantation Tour', description: 'Walk through lush spice gardens with a guided tour, elephant ride, and a traditional Goan lunch included.', location: 'Ponda', duration: '4 hours', cost: 1200, type: 'SIGHTSEEING', tags: ['relaxed', 'nature'] },
      { name: 'Casino Night Cruise', description: 'Floating casino on the Mandovi River — try your luck with a backdrop of glittering lights.', location: 'Panaji', duration: '4 hours', cost: 2000, type: 'REST', tags: ['relaxed'] },
    ],
    restaurants: [
      { name: 'Britto\'s', cuisine: 'Goan Seafood', costPerPerson: 800, isVeg: false, mustTry: 'Prawn Balchão', tier: 'mid' },
      { name: 'Thalassa', cuisine: 'Greek-Goan Fusion', costPerPerson: 1200, isVeg: false, mustTry: 'Grilled Octopus', tier: 'luxury' },
      { name: 'Ritz Classic', cuisine: 'Goan Vegetarian', costPerPerson: 400, isVeg: true, mustTry: 'Sol Kadhi with Goan Thali', tier: 'budget' },
      { name: 'Martin\'s Corner', cuisine: 'Goan', costPerPerson: 700, isVeg: false, mustTry: 'Crab Xacuti', tier: 'mid' },
      { name: 'Gunpowder', cuisine: 'Kerala-Goan Fusion', costPerPerson: 600, isVeg: false, mustTry: 'Appam with Kerala Curry', tier: 'mid' },
      { name: 'Café Tato', cuisine: 'Goan Breakfast', costPerPerson: 200, isVeg: true, mustTry: 'Poha and Chai', tier: 'budget' },
    ],
    hotels: [
      { name: 'Zostel Goa', location: 'Anjuna', pricePerNight: 700, rating: 4.1, amenities: ['Common kitchen', 'Social lounge', 'Bike rentals', 'Beach access'], tier: 'budget' },
      { name: 'The Park Calangute', location: 'Calangute', pricePerNight: 7500, rating: 4.4, amenities: ['Pool', 'Sea view rooms', 'Restaurant', 'Bar'], tier: 'mid' },
      { name: 'Taj Holiday Village Resort', location: 'Candolim Beach', pricePerNight: 18000, rating: 4.8, amenities: ['Private beach', 'Infinity pool', 'Spa', 'Multiple restaurants'], tier: 'luxury' },
    ],
    tips: ['Hire a two-wheeler (₹300–400/day) — best way to explore', 'Book December–January accommodation 2 months ahead', 'Try Goan fish curry rice at local restaurants away from the beach', 'North Goa for nightlife; South Goa for peace', 'Carry cash — beach shacks rarely accept cards'],
    packing: ['Sunscreen SPF 50+', 'Swimwear (2 sets)', 'Lightweight cotton clothes', 'Flip-flops & sandals', 'Waterproof bag', 'Insect repellent', 'GoPro / waterproof camera', 'Cash (₹3,000 minimum)', 'Light rain jacket (if monsoon)'],
    transport: {
      byAir: { duration: '1.5 hours', cost: 6000, airlines: ['IndiGo', 'Air India', 'GoAir'] },
      byTrain: { duration: '11–12 hours', cost: 800, trains: ['Mandovi Express', 'Goa Express', 'VSG Express'] },
      byRoad: { duration: '9–10 hours', cost: 3000 },
    },
  },

  manali: {
    bestTime: 'October to June (avoid July–September monsoon)',
    type: 'mountains',
    summary: 'Manali is a Himalayan paradise offering snow-capped peaks, thrilling adventure sports, ancient temples and the legendary Rohtang Pass. Perfect for both adventure seekers and peace lovers.',
    activities: [
      { name: 'Rohtang Pass Snow Experience', description: 'At 3,978m, this iconic snow pass offers 360° Himalayan views and snow activities — sledging, snow bikes and skiing.', location: 'Rohtang, 51 km from Manali', duration: '5 hours', cost: 1000, type: 'ADVENTURE', tags: ['adventure', 'nature'] },
      { name: 'Solang Valley Paragliding', description: 'Soar above the valley with the Himalayas as your backdrop — exhilarating and unforgettable.', location: 'Solang Valley', duration: '3 hours', cost: 2500, type: 'ADVENTURE', tags: ['adventure'] },
      { name: 'Hadimba Temple Visit', description: '16th-century cave temple dedicated to Hadimba Devi, set in a dense cedar forest with exquisite carved woodwork.', location: 'Dhoongri Forest, Manali', duration: '1 hour', cost: 0, type: 'SIGHTSEEING', tags: ['relaxed', 'cultural'] },
      { name: 'Beas River White Water Rafting', description: 'Grade 3–4 rapids on the Beas River through spectacular Himalayan gorges. Best May to July.', location: 'Pirdi to Jhiri', duration: '3 hours', cost: 1200, type: 'ADVENTURE', tags: ['adventure'] },
      { name: 'Old Manali Village Walk', description: 'Charming lanes lined with cafes, apple orchards and mountain views — the original village atmosphere.', location: 'Old Manali', duration: '2 hours', cost: 0, type: 'REST', tags: ['relaxed'] },
      { name: 'Naggar Castle', description: '500-year-old castle overlooking the Kullu Valley, now a heritage hotel with a small Roerich art gallery.', location: 'Naggar, 21 km from Manali', duration: '2 hours', cost: 50, type: 'SIGHTSEEING', tags: ['cultural', 'relaxed'] },
      { name: 'Manikaran Hot Springs', description: 'Sacred hot springs and Gurudwara in a dramatic gorge — the hot spring water cooks rice and lentils naturally!', location: 'Manikaran, Kasol', duration: '4 hours', cost: 200, type: 'SIGHTSEEING', tags: ['nature', 'relaxed'] },
      { name: 'Zorbing at Solang Valley', description: 'Roll downhill in a giant inflatable ball — great fun for groups and families.', location: 'Solang Valley', duration: '1 hour', cost: 700, type: 'ADVENTURE', tags: ['adventure'] },
    ],
    restaurants: [
      { name: 'Johnson\'s Café', cuisine: 'Continental & Indian', costPerPerson: 700, isVeg: false, mustTry: 'Trout Fish with Garlic Butter', tier: 'mid' },
      { name: 'Lazy Dog Lounge', cuisine: 'Multi-Cuisine', costPerPerson: 600, isVeg: false, mustTry: 'Wood-fired Pizza', tier: 'mid' },
      { name: 'Drifter\'s Inn', cuisine: 'Backpacker Café', costPerPerson: 350, isVeg: true, mustTry: 'Maggi & Chai with Mountain Views', tier: 'budget' },
      { name: 'The Himalayan', cuisine: 'North Indian', costPerPerson: 500, isVeg: false, mustTry: 'Dal Makhani and Naan', tier: 'budget' },
      { name: 'Casa Bella Vista', cuisine: 'Italian-Indian', costPerPerson: 900, isVeg: false, mustTry: 'Pasta Arrabiata', tier: 'luxury' },
    ],
    hotels: [
      { name: 'The Hosteller Manali', location: 'Old Manali', pricePerNight: 800, rating: 4.2, amenities: ['Mountain views', 'Social events', 'Café', 'Group tours'], tier: 'budget' },
      { name: 'Apple Country Resort', location: 'Old Manali', pricePerNight: 6500, rating: 4.5, amenities: ['Mountain views', 'Bonfire', 'Restaurant', 'Apple orchard'], tier: 'mid' },
      { name: 'Span Resorts', location: 'Kullu-Manali Highway', pricePerNight: 12000, rating: 4.7, amenities: ['River-facing rooms', 'Spa', 'Indoor pool', 'Adventure activities'], tier: 'luxury' },
    ],
    tips: ['Book Rohtang Pass permits online 1–2 days ahead — limited daily slots', 'Carry warm layers even in summer — nights get very cold', 'Try siddu (steamed bread) and fresh trout dishes', 'Negotiate taxi rates and agree on waiting charges upfront', 'Acclimatise for a day before going to high-altitude passes'],
    packing: ['Heavy winter jacket', 'Thermal inner layers', 'Woollen socks & gloves', 'Trekking boots', 'Sunscreen SPF 50+', 'Lip balm', 'First-aid kit', 'Altitude sickness tablets', 'Portable charger', 'Cash (ATMs limited beyond Manali)'],
    transport: {
      byAir: { duration: '1 hour to Bhuntar + 2 hrs road', cost: 8000, airlines: ['Air India'] },
      byTrain: { duration: '12 hrs to Chandigarh + 8 hrs bus', cost: 1500, trains: ['Shatabdi Express', 'Himalayan Queen'] },
      byRoad: { duration: '13–15 hours', cost: 4000 },
    },
  },

  rishikesh: {
    bestTime: 'September to June',
    type: 'spiritual-adventure',
    summary: 'The yoga capital of the world, Rishikesh sits where the holy Ganga emerges from the Himalayas — a sacred town that perfectly blends spiritual retreat with adrenaline-fuelled adventure.',
    activities: [
      { name: 'Ganga White Water Rafting', description: 'Grade 3–4 rapids from Shivpuri to Rishikesh — "The Wall", "Three Blind Mice" and "Golf Course" rapids. Best March–June and Sept–Nov.', location: 'Shivpuri to Rishikesh', duration: '3 hours', cost: 1500, type: 'ADVENTURE', tags: ['adventure'] },
      { name: 'Bungee Jumping at Jumpin Heights', description: 'India\'s highest bungee jump at 83 metres from a fixed platform. Book 1–2 days in advance.', location: 'Shivpuri', duration: '2 hours', cost: 3550, type: 'ADVENTURE', tags: ['adventure'] },
      { name: 'Triveni Ghat Evening Aarti', description: 'The most moving spiritual experience in Rishikesh — fire, flowers and chanting at sunset on the sacred Ganga.', location: 'Triveni Ghat', duration: '1.5 hours', cost: 0, type: 'SIGHTSEEING', tags: ['relaxed', 'cultural'] },
      { name: 'Laxman Jhula Bridge Walk', description: 'Iconic iron suspension bridge over the Ganga, lined with temples, cafes and ashrams. The heart of Rishikesh.', location: 'Laxman Jhula', duration: '2 hours', cost: 0, type: 'SIGHTSEEING', tags: ['relaxed'] },
      { name: 'Beatles Ashram Exploration', description: 'Abandoned ashram where The Beatles studied meditation in 1968, now covered in stunning street art.', location: 'Swarg Ashram', duration: '1.5 hours', cost: 150, type: 'SIGHTSEEING', tags: ['cultural', 'relaxed'] },
      { name: 'Sunrise Yoga Class', description: 'Join a riverside yoga session at dawn — multiple ashrams offer drop-in classes from ₹500.', location: 'Various ashrams', duration: '2 hours', cost: 500, type: 'REST', tags: ['relaxed'] },
      { name: 'Flying Fox Zipline', description: 'The fastest zipline in India over the Ganga — 300 metres of pure adrenaline!', location: 'Marine Drive', duration: '1 hour', cost: 2500, type: 'ADVENTURE', tags: ['adventure'] },
      { name: 'Rajaji National Park Safari', description: 'Jeep safari at the Himalayan foothills spotting wild elephants, leopards and 315 bird species.', location: 'Rajaji National Park', duration: '4 hours', cost: 1500, type: 'SIGHTSEEING', tags: ['nature', 'adventure'] },
    ],
    restaurants: [
      { name: 'Café de Goa', cuisine: 'Goan & Continental', costPerPerson: 450, isVeg: false, mustTry: 'Prawn Curry Rice', tier: 'mid' },
      { name: 'Little Buddha Café', cuisine: 'Multi-Cuisine', costPerPerson: 400, isVeg: true, mustTry: 'Israeli Shakshuka', tier: 'mid' },
      { name: 'Chotiwala', cuisine: 'Pure Veg North Indian', costPerPerson: 250, isVeg: true, mustTry: 'Aloo Puri Combo', tier: 'budget' },
      { name: 'The Sitting Elephant', cuisine: 'Continental & Indian', costPerPerson: 600, isVeg: false, mustTry: 'Nutella Pancakes', tier: 'mid' },
      { name: 'Madras Café', cuisine: 'South Indian', costPerPerson: 200, isVeg: true, mustTry: 'Masala Dosa', tier: 'budget' },
    ],
    hotels: [
      { name: 'Zostel Rishikesh', location: 'Laxman Jhula', pricePerNight: 600, rating: 4.3, amenities: ['Ganga views', 'Social events', 'Café', 'Rafting packages'], tier: 'budget' },
      { name: 'Atali Ganga Resort', location: 'Marine Drive', pricePerNight: 4500, rating: 4.5, amenities: ['Riverside', 'Adventure packages', 'Bonfire', 'Yoga deck'], tier: 'mid' },
      { name: 'Ananda in the Himalayas', location: 'Narendra Nagar', pricePerNight: 35000, rating: 4.9, amenities: ['World-class spa', 'Yoga & Ayurveda', 'Himalayan views', 'Fine dining'], tier: 'luxury' },
    ],
    tips: ['Non-veg food and alcohol strictly prohibited in central Rishikesh', 'Book adventure activities through GMVN or registered operators only', 'Arrive at Triveni Ghat 30 min early for the evening Aarti', 'Stay in Tapovan/Laxman Jhula area for best café vibe', 'Yoga centres offer 1-day drop-in classes from ₹500'],
    packing: ['Yoga mat', 'Comfortable loose clothing', 'Sandals for ghats', 'Light rain jacket', 'Quick-dry towel', 'Sunscreen', 'Insect repellent', 'Water bottle', 'Modest clothing for temples'],
    transport: {
      byAir: { duration: '1 hour to Dehradun + 1 hr road', cost: 5000, airlines: ['IndiGo', 'Air India'] },
      byTrain: { duration: '6 hrs to Haridwar + 30 min bus', cost: 800, trains: ['Dehradun Express', 'Jan Shatabdi'] },
      byRoad: { duration: '7–8 hours', cost: 2500 },
    },
  },

  kerala: {
    bestTime: 'October to February',
    type: 'nature-backwaters',
    summary: 'God\'s Own Country offers a dream tapestry of emerald backwaters, spice-scented hill stations, ancient temples, golden beaches and Ayurvedic healing traditions.',
    activities: [
      { name: 'Alleppey Houseboat Stay', description: 'Overnight on a traditional Kerala houseboat drifting through coconut-fringed backwaters — a quintessential Kerala experience.', location: 'Alleppey (Alappuzha)', duration: '24 hours', cost: 5000, type: 'SIGHTSEEING', tags: ['relaxed', 'nature'] },
      { name: 'Munnar Tea Gardens', description: 'Walk through vast emerald tea estates in the Nilgiri hills — guided tours explain the tea-making process.', location: 'Munnar', duration: '3 hours', cost: 300, type: 'SIGHTSEEING', tags: ['relaxed', 'nature'] },
      { name: 'Periyar Tiger Reserve Safari', description: 'Boat safari on Periyar Lake to spot wild elephants, bison, deer and rare birds in their natural habitat.', location: 'Thekkady', duration: '3 hours', cost: 1200, type: 'ADVENTURE', tags: ['adventure', 'nature'] },
      { name: 'Kathakali Cultural Show', description: 'Mesmerising classical dance-drama featuring elaborate makeup, costumes and storytelling through expressive gestures.', location: 'Kochi / Thrissur', duration: '2 hours', cost: 350, type: 'SIGHTSEEING', tags: ['cultural', 'relaxed'] },
      { name: 'Fort Kochi & Chinese Fishing Nets', description: 'Explore the historic Jewish Quarter, Dutch Palace, and watch fishermen haul giant cantilevered nets at sunset.', location: 'Fort Kochi, Ernakulam', duration: '4 hours', cost: 200, type: 'SIGHTSEEING', tags: ['cultural', 'relaxed'] },
      { name: 'Athirapally Waterfalls', description: 'The "Niagara of India" — a stunning 80-foot waterfall in dense rainforest, made famous by countless Bollywood films.', location: 'Chalakudy, Thrissur', duration: '3 hours', cost: 150, type: 'SIGHTSEEING', tags: ['nature', 'adventure'] },
      { name: 'Ayurvedic Massage Therapy', description: 'Traditional Kerala Ayurveda — a full-body Abhyanga oil massage to rejuvenate your body and mind.', location: 'Various Ayurveda centres', duration: '2 hours', cost: 1500, type: 'REST', tags: ['relaxed'] },
      { name: 'Varkala Cliff Beach', description: 'Dramatic red laterite cliffs overlooking turquoise Arabian Sea waters — most scenic beach in Kerala.', location: 'Varkala, Thiruvananthapuram', duration: '3 hours', cost: 0, type: 'SIGHTSEEING', tags: ['relaxed', 'nature'] },
    ],
    restaurants: [
      { name: 'Kayees Biryani', cuisine: 'Kerala Biryani', costPerPerson: 350, isVeg: false, mustTry: 'Chicken Dum Biryani', tier: 'budget' },
      { name: 'Villa Maya', cuisine: 'Fusion Fine Dining', costPerPerson: 1500, isVeg: false, mustTry: 'Karimeen Pollichathu (Pearl Spot Fish)', tier: 'luxury' },
      { name: 'Sree Krishna Café', cuisine: 'Kerala Vegetarian', costPerPerson: 200, isVeg: true, mustTry: 'Kerala Sadhya Thali (banana leaf)', tier: 'budget' },
      { name: 'Dal Roti', cuisine: 'North Indian & Kerala', costPerPerson: 400, isVeg: true, mustTry: 'Appam with Vegetable Stew', tier: 'mid' },
      { name: 'Fort House Restaurant', cuisine: 'Seafood & Continental', costPerPerson: 900, isVeg: false, mustTry: 'Prawn Masala', tier: 'mid' },
    ],
    hotels: [
      { name: 'Green Woods Bethlehem', location: 'Munnar', pricePerNight: 2000, rating: 4.2, amenities: ['Tea garden views', 'Bonfire', 'Kerala breakfast', 'Trekking'], tier: 'budget' },
      { name: 'Coconut Lagoon Resort', location: 'Kumarakom', pricePerNight: 8000, rating: 4.6, amenities: ['Backwater views', 'Infinity pool', 'Ayurveda spa', 'Boating'], tier: 'mid' },
      { name: 'Kumarakom Lake Resort', location: 'Kumarakom', pricePerNight: 25000, rating: 4.9, amenities: ['Private pool villas', 'Ayurveda centre', 'Fine dining', 'Heritage cottages'], tier: 'luxury' },
    ],
    tips: ['Pre-book houseboats and Ayurveda centres — they fill up fast', 'Carry modest clothing for temple visits', 'Best fresh seafood at local toddy shops away from tourist areas', 'Use local KSRTC buses for affordable inter-city travel', 'Carry an umbrella even in winter — Kerala can get sudden showers'],
    packing: ['Light cotton/linen clothes', 'Rain jacket/umbrella', 'Mosquito repellent', 'Modest clothes for temples', 'Sunscreen', 'Quick-dry towel', 'Good sandals', 'Stomach medication (rich food!)'],
    transport: {
      byAir: { duration: '2 hours to Kochi', cost: 5500, airlines: ['IndiGo', 'Air India', 'SpiceJet'] },
      byTrain: { duration: '22–24 hours', cost: 1200, trains: ['Kerala Express', 'Netravati Express', 'Konkan Kanya'] },
      byRoad: { duration: '18–20 hours', cost: 5000 },
    },
  },

  rajasthan: {
    bestTime: 'October to March',
    type: 'cultural-historical',
    summary: 'The Land of Maharajas dazzles with towering forts, opulent palaces, vibrant festivals, the world\'s most romantic desert and some of India\'s finest royal cuisine.',
    activities: [
      { name: 'Amber Fort & Sheesh Mahal', description: 'Breathtaking hilltop fort with intricate mirror-work halls, elephant rides and panoramic views of Maota Lake.', location: 'Amber, Jaipur', duration: '3 hours', cost: 200, type: 'SIGHTSEEING', tags: ['cultural', 'relaxed'] },
      { name: 'Hawa Mahal', description: 'The iconic "Palace of Winds" with 953 intricately latticed windows — most photographed monument in Jaipur.', location: 'Badi Chaupar, Jaipur', duration: '1 hour', cost: 50, type: 'SIGHTSEEING', tags: ['cultural', 'relaxed'] },
      { name: 'Mehrangarh Fort, Jodhpur', description: 'Massive blue-city fort rising 125m above Jodhpur with incredible museum collections and views over the Blue City.', location: 'Jodhpur', duration: '3 hours', cost: 100, type: 'SIGHTSEEING', tags: ['cultural'] },
      { name: 'Sam Sand Dunes Camel Safari', description: 'Camel ride into the Great Thar Desert at sunset followed by folk music and traditional Rajasthani dinner under stars.', location: 'Sam, near Jaisalmer', duration: '4 hours', cost: 1500, type: 'ADVENTURE', tags: ['adventure', 'cultural'] },
      { name: 'Lake Pichola Boat Ride', description: 'Magical sunset boat ride around the shimmering lake with views of the Lake Palace and Udaipur\'s palaces.', location: 'Udaipur', duration: '1 hour', cost: 500, type: 'SIGHTSEEING', tags: ['relaxed', 'nature'] },
      { name: 'Jaisalmer Fort', description: 'The "Golden Fort" — a living, breathing 12th-century citadel where 3,000 people still reside inside its walls.', location: 'Jaisalmer', duration: '2 hours', cost: 0, type: 'SIGHTSEEING', tags: ['cultural'] },
      { name: 'Pushkar Camel Fair / Brahma Temple', description: 'Pushkar is home to the world\'s only Brahma temple and the famous annual camel fair on sacred lake ghats.', location: 'Pushkar', duration: '3 hours', cost: 100, type: 'SIGHTSEEING', tags: ['cultural', 'relaxed'] },
      { name: 'City Palace Jaipur', description: 'Stunning complex of palaces, gardens and courtyards — the royal residence of the Maharaja of Jaipur still in use today.', location: 'Jaipur', duration: '2 hours', cost: 500, type: 'SIGHTSEEING', tags: ['cultural', 'relaxed'] },
    ],
    restaurants: [
      { name: '1135 AD Restaurant', cuisine: 'Royal Rajasthani', costPerPerson: 2000, isVeg: false, mustTry: 'Laal Maas (mutton curry)', tier: 'luxury' },
      { name: 'Niros', cuisine: 'North Indian & Continental', costPerPerson: 700, isVeg: false, mustTry: 'Dal Baati Churma', tier: 'mid' },
      { name: 'Laxmi Mishthan Bhandar', cuisine: 'Rajasthani Sweets & Thali', costPerPerson: 300, isVeg: true, mustTry: 'Rajasthani Thali', tier: 'budget' },
      { name: 'Ambrai Restaurant', cuisine: 'Rajasthani & Mughlai', costPerPerson: 1200, isVeg: false, mustTry: 'Gatte ki Sabzi with Baati', tier: 'luxury' },
      { name: 'Natraj Restaurant', cuisine: 'Pure Veg', costPerPerson: 250, isVeg: true, mustTry: 'Kachori with Sabzi', tier: 'budget' },
    ],
    hotels: [
      { name: 'Zostel Jaipur', location: 'Near Hawa Mahal', pricePerNight: 700, rating: 4.1, amenities: ['Rooftop', 'Travel desk', 'Café', 'Social events'], tier: 'budget' },
      { name: 'Samode Haveli', location: 'Jaipur', pricePerNight: 9000, rating: 4.7, amenities: ['Courtyard pool', 'Heritage rooms', 'Restaurant', 'Spa'], tier: 'mid' },
      { name: 'Taj Lake Palace', location: 'Lake Pichola, Udaipur', pricePerNight: 50000, rating: 4.9, amenities: ['Floating palace', 'Pool', 'Spa', 'Multiple restaurants', 'Boat transfers'], tier: 'luxury' },
    ],
    tips: ['Book royal hotel packages for royal dining experiences', 'Bargain hard at Johri Bazaar and Sadar Market — vendors start high', 'Carry a stole/scarf for women visiting temples and palaces', 'Avoid peak summer (April–June) — temperatures cross 45°C', 'Try local transport: auto-rickshaws are cheapest for short distances'],
    packing: ['Sunscreen SPF 60+', 'Light cotton clothes (pastel colors — less heat)', 'Scarf/stole', 'Sturdy walking shoes', 'Water bottle with filter', 'Cash for markets', 'Hand fan', 'Sunglasses'],
    transport: {
      byAir: { duration: '1.5 hours to Jaipur', cost: 5000, airlines: ['IndiGo', 'Air India', 'SpiceJet'] },
      byTrain: { duration: '18–20 hours', cost: 1000, trains: ['Ajmer Shatabdi', 'Garib Nawaz Express'] },
      byRoad: { duration: '16–18 hours', cost: 4500 },
    },
  },

  ladakh: {
    bestTime: 'June to September',
    type: 'high-altitude-adventure',
    summary: 'The "Roof of the World" is a surreal moonscape of Buddhist monasteries, sapphire lakes and barren mountain passes that will reset your soul and challenge your body at every step.',
    activities: [
      { name: 'Pangong Tso Lake', description: 'The famous 134km lake stretching into Tibet — its color shifts from blue to green to red depending on the light. Camping overnight is magical.', location: 'Changthang Plateau, 160km from Leh', duration: '8 hours', cost: 500, type: 'SIGHTSEEING', tags: ['nature', 'relaxed'] },
      { name: 'Khardung La Pass', description: 'One of the world\'s highest motorable passes at 5,359m — breathtaking views and bragging rights forever.', location: '39 km north of Leh', duration: '6 hours', cost: 300, type: 'ADVENTURE', tags: ['adventure', 'nature'] },
      { name: 'Nubra Valley & Bactrian Camels', description: 'The cold desert valley with white sand dunes where you can ride double-humped Bactrian camels at sunset.', location: 'Hunder, Nubra Valley', duration: '8 hours', cost: 600, type: 'ADVENTURE', tags: ['adventure', 'nature'] },
      { name: 'Hemis Monastery', description: 'Ladakh\'s largest monastery, housing rich Buddhist art, thangka paintings and the famous annual Hemis Festival.', location: '45 km from Leh', duration: '2 hours', cost: 30, type: 'SIGHTSEEING', tags: ['cultural', 'relaxed'] },
      { name: 'Magnetic Hill', description: 'The optical illusion hill where vehicles appear to roll uphill — a fascinating gravity mystery on NH1.', location: '30 km from Leh', duration: '30 minutes', cost: 0, type: 'SIGHTSEEING', tags: ['relaxed'] },
      { name: 'Zanskar Valley Rafting', description: 'One of the world\'s most remote and thrilling rafting stretches through the frozen Himalayan canyons. June–August only.', location: 'Zanskar River', duration: '5 hours', cost: 2500, type: 'ADVENTURE', tags: ['adventure'] },
      { name: 'Leh Palace Sunset', description: '17th-century 9-storey royal palace modelled on the Potala Palace in Lhasa — best at golden hour.', location: 'Leh Town', duration: '2 hours', cost: 30, type: 'SIGHTSEEING', tags: ['cultural', 'relaxed'] },
    ],
    restaurants: [
      { name: 'Tibetan Kitchen', cuisine: 'Tibetan & North Indian', costPerPerson: 400, isVeg: false, mustTry: 'Thukpa (Tibetan noodle soup)', tier: 'budget' },
      { name: 'Gesmo Restaurant', cuisine: 'Tibetan & Israeli', costPerPerson: 500, isVeg: true, mustTry: 'Butter Tea with Tsampa', tier: 'mid' },
      { name: 'Chopsticks Noodle Bar', cuisine: 'Chinese-Tibetan', costPerPerson: 450, isVeg: false, mustTry: 'Momos with Spicy Chilli Sauce', tier: 'mid' },
      { name: 'Bon Appétit', cuisine: 'Continental', costPerPerson: 600, isVeg: false, mustTry: 'Apple Crumble', tier: 'mid' },
      { name: 'Namza Dining', cuisine: 'Modern Ladakhi', costPerPerson: 900, isVeg: false, mustTry: 'Skyu (traditional Ladakhi stew)', tier: 'luxury' },
    ],
    hotels: [
      { name: 'Tsogspa Guest House', location: 'Leh Town', pricePerNight: 1500, rating: 4.0, amenities: ['Mountain views', 'Home-cooked meals', 'Warm rooms', 'Helpful hosts'], tier: 'budget' },
      { name: 'The Grand Dragon Ladakh', location: 'Leh', pricePerNight: 8000, rating: 4.6, amenities: ['Heated rooms', 'Restaurant', 'Spa', 'Himalayan views', 'Oxygen bar'], tier: 'mid' },
      { name: 'The Chamba Camp, Thiksey', location: 'Thiksey', pricePerNight: 28000, rating: 4.8, amenities: ['Luxury tents', 'Fine dining', 'Monastery views', 'Personalised safaris'], tier: 'luxury' },
    ],
    tips: ['Spend 2 days acclimatising in Leh before any high-altitude excursion', 'Inner Line Permits required for Pangong, Nubra, Tso Moriri — get them in Leh', 'Carry plenty of cash — ATMs are limited and often out of service', 'Stargazing in Ladakh is among the best on Earth — bring a warm blanket', 'Hire local taxi union taxis — they know the routes and conditions best'],
    packing: ['Very warm jacket & thermals', 'Altitude sickness tablets (Diamox)', 'Sunscreen SPF 70+', 'Lip balm & moisturiser', 'Trekking boots', 'Warm gloves & beanie', 'Portable oxygen cylinder', 'Cash ₹15,000+', 'Warm water bottle', 'Sunglasses with UV protection'],
    transport: {
      byAir: { duration: '2 hours to Leh', cost: 9000, airlines: ['Air India', 'IndiGo', 'GoFirst'] },
      byTrain: { duration: 'No direct train — fly or Manali–Leh road', cost: 0, trains: [] },
      byRoad: { duration: '2 days via Manali–Leh Highway (480 km)', cost: 6000 },
    },
  },

  shimla: {
    bestTime: 'March to June, December to January (snow)',
    type: 'hill-station',
    summary: 'The former summer capital of British India, Shimla is a charming hill town of Victorian architecture, snowy peaks, toy trains and pine-scented forests.',
    activities: [
      { name: 'The Ridge & Mall Road Walk', description: 'Stroll along the famous promenade with panoramic Himalayan views and colonial-era architecture.', location: 'Central Shimla', duration: '2 hours', cost: 0, type: 'SIGHTSEEING', tags: ['relaxed'] },
      { name: 'Jakhu Temple Trek', description: 'Short 2km hike to a hilltop temple at 2,455m dedicated to Hanuman — incredible views and resident monkeys.', location: 'Jakhu Hill', duration: '3 hours', cost: 50, type: 'ADVENTURE', tags: ['adventure', 'nature'] },
      { name: 'Kufri Snow Point', description: 'Popular snow destination 16km from Shimla — snow activities, yak rides and Himalayan panoramas.', location: 'Kufri', duration: '4 hours', cost: 800, type: 'ADVENTURE', tags: ['adventure', 'nature'] },
      { name: 'Kalka–Shimla Toy Train', description: 'UNESCO World Heritage narrow-gauge railway through 102 tunnels and 864 bridges — a breathtaking 5-hour journey.', location: 'Kalka to Shimla', duration: '5 hours', cost: 500, type: 'SIGHTSEEING', tags: ['relaxed', 'cultural'] },
      { name: 'Christ Church', description: 'The second-oldest church in North India — stunning neo-Gothic architecture in the heart of Shimla.', location: 'The Ridge, Shimla', duration: '45 minutes', cost: 0, type: 'SIGHTSEEING', tags: ['cultural', 'relaxed'] },
      { name: 'Chadwick Falls', description: 'Beautiful 67-metre waterfall in Glen Forest — best visited after monsoon when in full flow.', location: 'Glen, Shimla', duration: '2 hours', cost: 0, type: 'SIGHTSEEING', tags: ['nature'] },
    ],
    restaurants: [
      { name: 'Indian Coffee House', cuisine: 'South Indian & Snacks', costPerPerson: 200, isVeg: true, mustTry: 'Filter Coffee & Masala Dosa', tier: 'budget' },
      { name: 'Café Sol', cuisine: 'Continental & Italian', costPerPerson: 700, isVeg: false, mustTry: 'Wood-fired Pizza', tier: 'mid' },
      { name: 'Ashiana & Goofa', cuisine: 'North Indian', costPerPerson: 500, isVeg: false, mustTry: 'Dham (Himachali feast)', tier: 'mid' },
      { name: 'Baljees', cuisine: 'Pure Veg Himachali', costPerPerson: 350, isVeg: true, mustTry: 'Madra and Rice (Himachali)', tier: 'budget' },
    ],
    hotels: [
      { name: 'YMCA Hostel', location: 'The Ridge, Shimla', pricePerNight: 1200, rating: 4.0, amenities: ['Central location', 'Ridge views', 'Cafeteria', 'Clean rooms'], tier: 'budget' },
      { name: 'Hotel Willow Banks', location: 'Chotta Shimla', pricePerNight: 5500, rating: 4.4, amenities: ['Mountain views', 'Restaurant', 'Lounge', 'Room service'], tier: 'mid' },
      { name: 'Wildflower Hall', location: 'Mashobra, near Shimla', pricePerNight: 22000, rating: 4.9, amenities: ['Infinity pool', 'Himalayan views', 'Spa', 'Forest walks', 'Fine dining'], tier: 'luxury' },
    ],
    tips: ['The Mall Road is car-free — great for walking', 'Book toy train tickets well in advance', 'Try local Himachali dishes: Siddu, Madra, Babru', 'Carry layers — temperatures drop sharply after sunset', 'Avoid peak winter (Jan–Feb) unless you want heavy snow experience'],
    packing: ['Warm winter jacket', 'Sweaters & thermals', 'Rain jacket', 'Comfortable walking shoes', 'Sunscreen', 'Warm hat & gloves (winter)', 'Umbrella'],
    transport: {
      byAir: { duration: '1.5 hours to Chandigarh + 3 hrs road', cost: 6000, airlines: ['IndiGo', 'Air India'] },
      byTrain: { duration: '14 hrs to Kalka + 5 hrs toy train', cost: 1000, trains: ['Kalka Mail', 'Shatabdi Express to Chandigarh'] },
      byRoad: { duration: '13–14 hours', cost: 4000 },
    },
  },

  mumbai: {
    bestTime: 'November to February',
    type: 'metro-culture',
    summary: 'India\'s Maximum City never sleeps — Bollywood dreams, colonial architecture, street food paradise, sprawling beaches and a pulsating energy unlike anywhere else in the world.',
    activities: [
      { name: 'Gateway of India', description: 'Iconic 1924 colonial arch on the Mumbai waterfront — take a ferry to Elephanta Caves from here.', location: 'Apollo Bunder, Colaba', duration: '1 hour', cost: 0, type: 'SIGHTSEEING', tags: ['cultural', 'relaxed'] },
      { name: 'Elephanta Caves', description: 'UNESCO World Heritage 7th-century rock-cut caves dedicated to Shiva — a one-hour boat ride away from the Gateway.', location: 'Elephanta Island', duration: '3 hours', cost: 700, type: 'SIGHTSEEING', tags: ['cultural'] },
      { name: 'Marine Drive Sunset Walk', description: 'The iconic "Queen\'s Necklace" — walk along the 3.6km Art Deco promenade as the sun dips into the Arabian Sea.', location: 'Nariman Point to Babulnath', duration: '2 hours', cost: 0, type: 'REST', tags: ['relaxed'] },
      { name: 'Dharavi Slum Experience', description: 'Eye-opening guided walk through Asia\'s largest informal economy — 15,000 businesses generating ₹5,000 crore annually.', location: 'Dharavi', duration: '3 hours', cost: 1000, type: 'SIGHTSEEING', tags: ['cultural'] },
      { name: 'Bandra-Worli Sea Link Drive', description: 'Drive across the iconic 5.6km cable-stayed bridge connecting Bandra to Worli — spectacular city and sea views.', location: 'Bandra to Worli', duration: '30 minutes', cost: 80, type: 'SIGHTSEEING', tags: ['relaxed'] },
      { name: 'CST Heritage Walk', description: 'Visit the UNESCO-listed Chhatrapati Shivaji Maharaj Terminus — a masterpiece of Victorian Gothic architecture.', location: 'Fort, Mumbai', duration: '1.5 hours', cost: 0, type: 'SIGHTSEEING', tags: ['cultural'] },
      { name: 'Juhu Beach & Street Food', description: 'Mumbai\'s favourite beach — try Pav Bhaji, Bhel Puri and Vada Pav from the legendary street food stalls at sunset.', location: 'Juhu, Andheri', duration: '2 hours', cost: 300, type: 'FOOD', tags: ['relaxed', 'cultural'] },
    ],
    restaurants: [
      { name: 'Leopold Café', cuisine: 'Multi-Cuisine', costPerPerson: 600, isVeg: false, mustTry: 'Chicken Tikka with Cold Beer', tier: 'mid' },
      { name: 'Swati Snacks', cuisine: 'Gujarati-Mumbai Snacks', costPerPerson: 400, isVeg: true, mustTry: 'Panki and Lilva Kachori', tier: 'mid' },
      { name: 'Khyber', cuisine: 'Mughlai', costPerPerson: 1500, isVeg: false, mustTry: 'Khyber Raan (whole leg of lamb)', tier: 'luxury' },
      { name: 'Sardar Refreshments', cuisine: 'Mumbai Street Food', costPerPerson: 150, isVeg: true, mustTry: 'Pav Bhaji', tier: 'budget' },
      { name: 'Trishna', cuisine: 'Coastal Seafood', costPerPerson: 1200, isVeg: false, mustTry: 'Butter Pepper Garlic Crab', tier: 'luxury' },
    ],
    hotels: [
      { name: 'YMCA Mumbai', location: 'Colaba', pricePerNight: 2500, rating: 3.9, amenities: ['Central location', 'Basic amenities', 'Safe neighbourhood', 'A/C rooms'], tier: 'budget' },
      { name: 'The Orchid Hotel', location: 'Vile Parle East', pricePerNight: 7000, rating: 4.4, amenities: ['Pool', 'Restaurant', 'Airport proximity', 'Eco-certified'], tier: 'mid' },
      { name: 'The Taj Mahal Palace', location: 'Colaba, Apollo Bunder', pricePerNight: 40000, rating: 4.9, amenities: ['Gateway of India views', 'Multiple restaurants', 'Spa', 'History & elegance'], tier: 'luxury' },
    ],
    tips: ['Use the local train (₹10–50) — fastest way to travel across Mumbai', 'Try Vada Pav (₹15) — Mumbai\'s quintessential street food', 'Book Elephanta Caves ferry early in the morning to avoid crowds', 'Carry an umbrella in July–September monsoon', 'Avoid travelling by road during 9–11 AM and 6–9 PM rush hours'],
    packing: ['Light cotton clothes', 'Comfortable walking shoes', 'Umbrella (monsoon)', 'Oyster card / change for local trains', 'Sunscreen', 'Small backpack'],
    transport: {
      byAir: { duration: '1.5 hours', cost: 5000, airlines: ['IndiGo', 'Air India', 'SpiceJet', 'GoFirst'] },
      byTrain: { duration: '3.5–4.5 hours', cost: 400, trains: ['Deccan Queen', 'Shatabdi', 'Duronto Express'] },
      byRoad: { duration: '3–4 hours via Expressway', cost: 1200 },
    },
  },
};

/* ─── generic fallback for unknown destinations ──────────────── */
function getDestData(destination: string): DestData {
  const key = destination.toLowerCase().trim().split(' ')[0];
  return (
    DEST_DB[key] ??
    DEST_DB[destination.toLowerCase().replace(/\s+/g, '')] ?? {
      bestTime: 'October to March',
      type: 'mixed',
      summary: `${destination} is a wonderful travel destination with unique local culture, scenic beauty and authentic experiences waiting to be discovered.`,
      activities: [
        { name: `${destination} City Tour`, description: 'Explore the main attractions, markets and heritage spots of the city with a local guide.', location: destination, duration: '4 hours', cost: 800, type: 'SIGHTSEEING', tags: ['relaxed', 'cultural'] },
        { name: 'Local Market Visit', description: 'Wander through the bustling local market for handicrafts, spices and street food.', location: `${destination} Main Market`, duration: '2 hours', cost: 500, type: 'SHOPPING', tags: ['relaxed', 'cultural'] },
        { name: 'Photography Walk', description: 'Golden hour photography walk through the most scenic parts of the city.', location: destination, duration: '2 hours', cost: 0, type: 'REST', tags: ['relaxed'] },
        { name: 'Nature Trail', description: 'Early morning nature walk through the surrounding landscape.', location: `${destination} outskirts`, duration: '3 hours', cost: 300, type: 'SIGHTSEEING', tags: ['nature', 'adventure'] },
        { name: 'Local Cooking Class', description: 'Learn to cook authentic local dishes with a home chef.', location: destination, duration: '3 hours', cost: 1500, type: 'FOOD', tags: ['cultural', 'relaxed'] },
        { name: 'Sunset Viewpoint', description: 'Head to the best viewpoint in the area for a spectacular sunset.', location: `${destination} viewpoint`, duration: '1.5 hours', cost: 0, type: 'SIGHTSEEING', tags: ['relaxed', 'nature'] },
      ],
      restaurants: [
        { name: 'Local Dhaba', cuisine: 'North Indian', costPerPerson: 200, isVeg: true, mustTry: 'Dal Tadka with Roti', tier: 'budget' },
        { name: 'City Restaurant', cuisine: 'Multi-Cuisine', costPerPerson: 500, isVeg: false, mustTry: 'Regional specialty thali', tier: 'mid' },
        { name: 'Heritage Dining Hall', cuisine: 'Regional Indian', costPerPerson: 1200, isVeg: false, mustTry: 'Chef\'s special', tier: 'luxury' },
      ],
      hotels: [
        { name: 'Budget Guesthouse', location: destination, pricePerNight: 1500, rating: 3.8, amenities: ['Clean rooms', 'A/C', 'Free Wi-Fi', 'Breakfast'], tier: 'budget' },
        { name: 'City Hotel', location: `${destination} Centre`, pricePerNight: 5000, rating: 4.2, amenities: ['Pool', 'Restaurant', 'Travel desk', 'Room service'], tier: 'mid' },
        { name: 'Heritage Resort', location: destination, pricePerNight: 15000, rating: 4.7, amenities: ['Spa', 'Fine dining', 'Pool', 'Scenic views'], tier: 'luxury' },
      ],
      tips: ['Research local customs and dress codes before visiting', 'Hire a local guide for the best experience', 'Try street food — it\'s the most authentic local experience', 'Book accommodation in advance during peak season', 'Carry local currency and small change'],
      packing: ['Comfortable walking shoes', 'Light layers', 'Sunscreen', 'Insect repellent', 'Camera', 'Cash', 'Portable charger', 'First-aid kit'],
      transport: {
        byAir: { duration: '2–3 hours (nearest major airport)', cost: 6000, airlines: ['IndiGo', 'Air India', 'SpiceJet'] },
        byTrain: { duration: '8–16 hours', cost: 800, trains: ['Express trains from major cities'] },
        byRoad: { duration: '8–14 hours', cost: 3000 },
      },
    }
  );
}

/* ─────────────────────────── smart generator ───────────────── */

function generateItineraryLocally(dto: AIPlannerDto): any {
  const dest = getDestData(dto.destination);
  const budget = dto.budget;
  const days = dto.days;
  const people = dto.numberOfPeople;
  const style = dto.travelStyle;
  const food = dto.foodPreference;

  // Budget allocation
  const accommodation = Math.round(budget * 0.35);
  const foodBudget    = Math.round(budget * 0.25);
  const transport     = Math.round(budget * 0.20);
  const activities    = Math.round(budget * 0.15);
  const misc          = Math.round(budget * 0.05);

  const nightlyBudget = Math.round(accommodation / days);
  const perPersonNight = Math.round(nightlyBudget / people);

  // Select hotel tier
  let hotelTier: 'budget' | 'mid' | 'luxury' = 'budget';
  if (perPersonNight > 8000) hotelTier = 'luxury';
  else if (perPersonNight > 2500) hotelTier = 'mid';

  const hotel =
    dest.hotels.find((h) => h.tier === hotelTier) ??
    dest.hotels[0];

  // Filter activities by travel style
  const styleTagMap: Record<string, string[]> = {
    RELAXED:    ['relaxed'],
    MODERATE:   ['relaxed', 'cultural', 'nature'],
    FAST_PACED: ['cultural', 'nature', 'adventure'],
    ADVENTURE:  ['adventure'],
  };
  const preferredTags = styleTagMap[style] ?? ['relaxed'];

  const sortedActivities = [...dest.activities].sort((a, b) => {
    const aScore = a.tags.filter((t) => preferredTags.includes(t)).length;
    const bScore = b.tags.filter((t) => preferredTags.includes(t)).length;
    return bScore - aScore;
  });

  const activitiesPerDay = style === 'RELAXED' ? 2 : style === 'FAST_PACED' ? 4 : 3;

  // Filter restaurants by food preference
  const isVegRequired = food === 'VEG' || food === 'VEGAN' || food === 'JAIN';
  const filteredRestaurants = isVegRequired
    ? dest.restaurants.filter((r) => r.isVeg)
    : dest.restaurants;
  const restaurants = filteredRestaurants.length > 0 ? filteredRestaurants : dest.restaurants;

  const dayThemes = [
    'Arrival & First Impressions', 'Deep Exploration', 'Hidden Gems & Local Life',
    'Adventure & Activities', 'Cultural Immersion', 'Leisure & Shopping',
    'Day Trips & Excursions', 'Relaxation & Reflection', 'Last-Day Highlights', 'Farewell Morning',
  ];

  // Build itinerary days
  const itineraryDays: any[] = [];
  let activityIndex = 0;

  for (let d = 1; d <= days; d++) {
    const theme = d === 1 ? 'Arrival & First Impressions'
      : d === days ? 'Final Day & Departure'
      : dayThemes[d % dayThemes.length];

    const dayActivities: any[] = [];
    const times = ['09:00', '11:30', '14:30', '17:00'];
    const count = d === 1 || d === days ? Math.min(2, activitiesPerDay) : activitiesPerDay;

    for (let i = 0; i < count; i++) {
      const act = sortedActivities[activityIndex % sortedActivities.length];
      activityIndex++;
      dayActivities.push({
        time: times[i] ?? `${9 + i * 2}:00`,
        name: act.name,
        description: act.description,
        location: act.location,
        duration: act.duration,
        cost: act.cost,
        type: act.type,
      });
    }

    const restIdx = (d - 1) % restaurants.length;
    const r1 = restaurants[restIdx % restaurants.length];
    const r2 = restaurants[(restIdx + 1) % restaurants.length];
    const r3 = restaurants[(restIdx + 2) % restaurants.length];

    const estimatedCost =
      dayActivities.reduce((s, a) => s + a.cost, 0) +
      (r1.costPerPerson + r2.costPerPerson + r3.costPerPerson) * people +
      hotel.pricePerNight;

    itineraryDays.push({
      day: d,
      theme,
      activities: dayActivities,
      meals: [
        { time: 'BREAKFAST', restaurant: r1.name, cuisine: r1.cuisine, cost: r1.costPerPerson * people, isVeg: r1.isVeg, mustTry: r1.mustTry },
        { time: 'LUNCH',     restaurant: r2.name, cuisine: r2.cuisine, cost: r2.costPerPerson * people, isVeg: r2.isVeg, mustTry: r2.mustTry },
        { time: 'DINNER',    restaurant: r3.name, cuisine: r3.cuisine, cost: r3.costPerPerson * people, isVeg: r3.isVeg, mustTry: r3.mustTry },
      ],
      hotel: {
        name: hotel.name,
        location: hotel.location,
        pricePerNight: hotel.pricePerNight,
        rating: hotel.rating,
        amenities: hotel.amenities,
      },
      estimatedCost,
      tips: dest.tips[(d - 1) % dest.tips.length],
    });
  }

  return {
    destination: dto.destination,
    totalDays: days,
    totalBudget: budget,
    summary: dest.summary,
    bestTimeToVisit: dest.bestTime,
    days: itineraryDays,
    packingChecklist: dest.packing,
    travelTips: dest.tips,
    budgetBreakdown: { accommodation, food: foodBudget, transport, activities, miscellaneous: misc, total: budget },
    transportFromPune: dest.transport,
  };
}

/* ─────────────────────────── service ──────────────────────── */

@Injectable()
export class AiPlannerService {
  private openaiAvailable = false;
  private openai: any = null;

  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
  ) {
    const key = this.config.get<string>('OPENAI_API_KEY') ?? '';
    if (key && key.startsWith('sk-') && key.length > 20) {
      try {
        const OpenAI = require('openai');
        this.openai = new OpenAI.default({ apiKey: key });
        this.openaiAvailable = true;
      } catch {
        this.openaiAvailable = false;
      }
    }
  }

  async generateItinerary(userId: string, dto: AIPlannerDto) {
    let itinerary: any;

    if (this.openaiAvailable) {
      itinerary = await this.generateWithOpenAI(dto);
    } else {
      itinerary = generateItineraryLocally(dto);
    }

    // Save to DB (best effort — don't fail the request if DB save fails)
    try {
      await this.prisma.aITravelPlan.create({
        data: {
          userId,
          destination: dto.destination,
          days: dto.days,
          budget: dto.budget,
          input: dto as any,
          itinerary,
        },
      });
    } catch {
      // DB save failure should not break the response
    }

    return itinerary;
  }

  private async generateWithOpenAI(dto: AIPlannerDto): Promise<any> {
    const prompt = this.buildPrompt(dto);
    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert Indian travel planner. Always respond with valid JSON matching the exact schema provided. Include local knowledge, authentic experiences, and realistic Indian pricing in INR.',
        },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 4000,
    });

    const content = completion.choices[0].message.content;
    if (!content) throw new BadRequestException('Failed to generate itinerary');

    try {
      return JSON.parse(content);
    } catch {
      throw new BadRequestException('Invalid itinerary format received');
    }
  }

  async getUserPlans(userId: string) {
    return this.prisma.aITravelPlan.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
  }

  private buildPrompt(dto: AIPlannerDto): string {
    return `Generate a detailed ${dto.days}-day travel itinerary to ${dto.destination} for ${dto.numberOfPeople} person(s).

Budget: ₹${dto.budget} total
Travel Style: ${dto.travelStyle}
Food Preference: ${dto.foodPreference}

Respond with a JSON object matching this EXACT schema:
{
  "destination": "string",
  "totalDays": number,
  "totalBudget": number,
  "summary": "string - 2-3 sentence overview",
  "bestTimeToVisit": "string",
  "days": [{ "day": number, "theme": "string", "activities": [{ "time": "HH:MM", "name": "string", "description": "string", "location": "string", "duration": "string", "cost": number, "type": "SIGHTSEEING|ADVENTURE|FOOD|SHOPPING|TRANSPORT|REST" }], "meals": [{ "time": "BREAKFAST|LUNCH|DINNER|SNACK", "restaurant": "string", "cuisine": "string", "cost": number, "isVeg": boolean, "mustTry": "string" }], "hotel": { "name": "string", "location": "string", "pricePerNight": number, "rating": number, "amenities": ["string"] }, "estimatedCost": number, "tips": "string" }],
  "packingChecklist": ["string"],
  "travelTips": ["string"],
  "budgetBreakdown": { "accommodation": number, "food": number, "transport": number, "activities": number, "miscellaneous": number, "total": number },
  "transportFromPune": { "byAir": { "duration": "string", "cost": number, "airlines": ["string"] }, "byTrain": { "duration": "string", "cost": number, "trains": ["string"] }, "byRoad": { "duration": "string", "cost": number } }
}`;
  }
}
