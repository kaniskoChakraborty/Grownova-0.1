export type HsnEntry = { code: string; type: 'HSN' | 'SAC'; description: string; keywords: string[] };

// ponytail: curated list of common small-business items, matched by keyword. Swap for the full CBIC HSN/SAC
// master (and an LLM fallback via GrowAI) when users hit gaps. 4-digit HSN is what businesses up to
// Rs 5 crore turnover must print on B2B invoices.
export const HSN_CODES: HsnEntry[] = [
  { code: '0401', type: 'HSN', description: 'Milk and cream', keywords: ['milk', 'doodh', 'cream', 'dairy'] },
  { code: '0405', type: 'HSN', description: 'Butter, ghee and other milk fats', keywords: ['butter', 'ghee', 'makhan'] },
  { code: '0406', type: 'HSN', description: 'Cheese and curd, including paneer', keywords: ['cheese', 'paneer', 'curd', 'dahi'] },
  { code: '0701', type: 'HSN', description: 'Potatoes, fresh or chilled', keywords: ['potato', 'aloo', 'vegetable', 'sabzi'] },
  { code: '0703', type: 'HSN', description: 'Onions, garlic and leeks', keywords: ['onion', 'pyaz', 'garlic', 'lahsun', 'vegetable'] },
  { code: '0713', type: 'HSN', description: 'Dried pulses (dal)', keywords: ['dal', 'daal', 'pulse', 'lentil', 'chana', 'rajma', 'moong'] },
  { code: '0901', type: 'HSN', description: 'Coffee', keywords: ['coffee'] },
  { code: '0902', type: 'HSN', description: 'Tea', keywords: ['tea', 'chai', 'patti'] },
  { code: '0910', type: 'HSN', description: 'Ginger, turmeric and other spices', keywords: ['spice', 'masala', 'turmeric', 'haldi', 'ginger', 'adrak'] },
  { code: '1001', type: 'HSN', description: 'Wheat', keywords: ['wheat', 'gehun', 'grain'] },
  { code: '1006', type: 'HSN', description: 'Rice', keywords: ['rice', 'chawal', 'basmati', 'grain'] },
  { code: '1101', type: 'HSN', description: 'Wheat flour (atta, maida)', keywords: ['atta', 'flour', 'maida', 'aata'] },
  { code: '1514', type: 'HSN', description: 'Mustard oil', keywords: ['mustard', 'sarson', 'oil', 'tel'] },
  { code: '1512', type: 'HSN', description: 'Sunflower oil', keywords: ['sunflower', 'oil', 'refined', 'tel'] },
  { code: '1701', type: 'HSN', description: 'Sugar', keywords: ['sugar', 'cheeni', 'shakkar'] },
  { code: '1905', type: 'HSN', description: 'Bread, biscuits, cakes and bakery products', keywords: ['bread', 'biscuit', 'cake', 'bakery', 'rusk', 'pav'] },
  { code: '2106', type: 'HSN', description: 'Other food preparations (namkeen, ready mixes)', keywords: ['namkeen', 'snack', 'mixture', 'bhujia', 'food'] },
  { code: '2201', type: 'HSN', description: 'Drinking water, mineral water', keywords: ['water', 'pani', 'mineral', 'bisleri'] },
  { code: '2202', type: 'HSN', description: 'Soft drinks and other non-alcoholic beverages', keywords: ['soft', 'drink', 'cold', 'soda', 'juice', 'beverage'] },
  { code: '2523', type: 'HSN', description: 'Cement', keywords: ['cement'] },
  { code: '3004', type: 'HSN', description: 'Medicines in measured doses or retail packs', keywords: ['medicine', 'dawai', 'tablet', 'capsule', 'syrup', 'pharma'] },
  { code: '3209', type: 'HSN', description: 'Paints and varnishes (water-based)', keywords: ['paint', 'varnish', 'emulsion', 'distemper'] },
  { code: '3304', type: 'HSN', description: 'Beauty, make-up and skin care preparations', keywords: ['cosmetic', 'makeup', 'cream', 'lotion', 'beauty', 'skincare'] },
  { code: '3305', type: 'HSN', description: 'Hair preparations (shampoo, hair oil)', keywords: ['shampoo', 'hair', 'conditioner'] },
  { code: '3306', type: 'HSN', description: 'Toothpaste and oral hygiene', keywords: ['toothpaste', 'tooth', 'dental', 'mouthwash'] },
  { code: '3401', type: 'HSN', description: 'Soap', keywords: ['soap', 'sabun'] },
  { code: '3402', type: 'HSN', description: 'Detergents and washing preparations', keywords: ['detergent', 'surf', 'washing', 'cleaner', 'dishwash'] },
  { code: '3923', type: 'HSN', description: 'Plastic boxes, bags and packaging', keywords: ['plastic', 'packaging', 'bag', 'box', 'container', 'pouch'] },
  { code: '4820', type: 'HSN', description: 'Notebooks, registers and diaries', keywords: ['notebook', 'register', 'diary', 'copy', 'stationery'] },
  { code: '4901', type: 'HSN', description: 'Printed books', keywords: ['book', 'kitab', 'textbook'] },
  { code: '5208', type: 'HSN', description: 'Woven cotton fabric', keywords: ['cotton', 'fabric', 'cloth', 'kapda'] },
  { code: '6109', type: 'HSN', description: 'T-shirts and vests, knitted', keywords: ['tshirt', 't-shirt', 'vest', 'baniyan', 'clothing'] },
  { code: '6203', type: 'HSN', description: "Men's suits, jackets and trousers", keywords: ['trouser', 'pant', 'jeans', 'suit', 'jacket', 'men', 'clothing'] },
  { code: '6204', type: 'HSN', description: "Women's suits, dresses and skirts", keywords: ['dress', 'kurti', 'salwar', 'skirt', 'women', 'clothing'] },
  { code: '6205', type: 'HSN', description: "Men's shirts", keywords: ['shirt', 'men', 'clothing'] },
  { code: '6302', type: 'HSN', description: 'Bed linen, towels and table linen', keywords: ['bedsheet', 'towel', 'linen', 'pillow', 'cover'] },
  { code: '6402', type: 'HSN', description: 'Footwear with rubber or plastic soles and uppers', keywords: ['footwear', 'chappal', 'slipper', 'sandal', 'shoe', 'joota'] },
  { code: '6403', type: 'HSN', description: 'Leather footwear', keywords: ['leather', 'shoe', 'footwear', 'joota'] },
  { code: '6907', type: 'HSN', description: 'Ceramic tiles', keywords: ['tile', 'ceramic', 'flooring'] },
  { code: '7113', type: 'HSN', description: 'Gold and silver jewellery', keywords: ['jewellery', 'jewelry', 'gold', 'silver', 'ornament'] },
  { code: '7117', type: 'HSN', description: 'Imitation jewellery', keywords: ['imitation', 'artificial', 'jewellery', 'jewelry', 'fashion'] },
  { code: '7214', type: 'HSN', description: 'Iron and steel bars and rods (TMT)', keywords: ['tmt', 'steel', 'rod', 'saria', 'sariya', 'bar'] },
  { code: '7323', type: 'HSN', description: 'Steel kitchen utensils', keywords: ['utensil', 'bartan', 'kitchen', 'steel', 'cookware'] },
  { code: '8415', type: 'HSN', description: 'Air conditioners', keywords: ['ac', 'air', 'conditioner'] },
  { code: '8418', type: 'HSN', description: 'Refrigerators and freezers', keywords: ['fridge', 'refrigerator', 'freezer'] },
  { code: '8450', type: 'HSN', description: 'Washing machines', keywords: ['washing', 'machine'] },
  { code: '8471', type: 'HSN', description: 'Computers and laptops', keywords: ['computer', 'laptop', 'desktop', 'pc'] },
  { code: '8504', type: 'HSN', description: 'Chargers, adapters and power supplies', keywords: ['charger', 'adapter', 'inverter', 'ups', 'transformer'] },
  { code: '8517', type: 'HSN', description: 'Mobile phones', keywords: ['mobile', 'phone', 'smartphone', 'cellphone'] },
  { code: '8528', type: 'HSN', description: 'Televisions and monitors', keywords: ['tv', 'television', 'monitor', 'led'] },
  { code: '8539', type: 'HSN', description: 'LED lamps and bulbs', keywords: ['bulb', 'lamp', 'led', 'light', 'tubelight'] },
  { code: '8544', type: 'HSN', description: 'Electric wires and cables', keywords: ['wire', 'cable', 'electrical'] },
  { code: '8703', type: 'HSN', description: 'Cars', keywords: ['car', 'vehicle'] },
  { code: '8711', type: 'HSN', description: 'Motorcycles and scooters', keywords: ['bike', 'motorcycle', 'scooter', 'scooty'] },
  { code: '8712', type: 'HSN', description: 'Bicycles', keywords: ['bicycle', 'cycle'] },
  { code: '9401', type: 'HSN', description: 'Chairs and seats', keywords: ['chair', 'seat', 'sofa', 'furniture'] },
  { code: '9403', type: 'HSN', description: 'Furniture (tables, beds, cupboards)', keywords: ['furniture', 'table', 'bed', 'almirah', 'cupboard', 'wardrobe'] },
  { code: '9503', type: 'HSN', description: 'Toys', keywords: ['toy', 'khilona', 'game'] },
  { code: '995411', type: 'SAC', description: 'Construction of residential buildings', keywords: ['construction', 'building', 'house', 'contractor'] },
  { code: '996311', type: 'SAC', description: 'Hotel room accommodation', keywords: ['hotel', 'room', 'stay', 'lodging', 'accommodation'] },
  { code: '996331', type: 'SAC', description: 'Restaurant, cafe and takeaway services', keywords: ['restaurant', 'cafe', 'food', 'dhaba', 'takeaway', 'catering'] },
  { code: '996511', type: 'SAC', description: 'Road transport of goods', keywords: ['transport', 'truck', 'goods', 'logistics', 'freight', 'delivery'] },
  { code: '996601', type: 'SAC', description: 'Rental of vehicles with driver (cabs, buses)', keywords: ['cab', 'taxi', 'rental', 'vehicle', 'driver', 'bus'] },
  { code: '996812', type: 'SAC', description: 'Courier services', keywords: ['courier', 'parcel', 'delivery'] },
  { code: '997211', type: 'SAC', description: 'Renting of residential property', keywords: ['rent', 'residential', 'flat', 'house'] },
  { code: '997212', type: 'SAC', description: 'Renting of commercial property', keywords: ['rent', 'commercial', 'shop', 'office', 'warehouse'] },
  { code: '9982', type: 'SAC', description: 'Legal and accounting services', keywords: ['legal', 'lawyer', 'advocate', 'ca', 'accounting'] },
  { code: '998222', type: 'SAC', description: 'Accounting and bookkeeping', keywords: ['accounting', 'bookkeeping', 'accountant', 'ca', 'audit'] },
  { code: '998311', type: 'SAC', description: 'Management and business consulting', keywords: ['consulting', 'consultant', 'consultancy', 'management', 'advisory'] },
  { code: '998313', type: 'SAC', description: 'IT consulting and support', keywords: ['it', 'support', 'consulting', 'tech', 'software'] },
  { code: '998314', type: 'SAC', description: 'Software and website design and development', keywords: ['software', 'website', 'app', 'development', 'developer', 'web'] },
  { code: '998315', type: 'SAC', description: 'Hosting and IT infrastructure', keywords: ['hosting', 'server', 'cloud', 'domain'] },
  { code: '998361', type: 'SAC', description: 'Advertising services', keywords: ['advertising', 'ads', 'marketing', 'promotion', 'branding'] },
  { code: '998596', type: 'SAC', description: 'Event, exhibition and trade show management', keywords: ['event', 'exhibition', 'wedding', 'planner', 'decoration'] },
  { code: '9987', type: 'SAC', description: 'Maintenance, repair and installation', keywords: ['repair', 'maintenance', 'service', 'installation', 'servicing'] },
  { code: '999293', type: 'SAC', description: 'Commercial training and coaching', keywords: ['coaching', 'training', 'tuition', 'classes', 'course'] },
  { code: '999721', type: 'SAC', description: 'Hairdressing and barber services', keywords: ['salon', 'haircut', 'barber', 'parlour', 'hair'] },
  { code: '999722', type: 'SAC', description: 'Beauty treatment, manicure and pedicure', keywords: ['beauty', 'parlour', 'spa', 'manicure', 'pedicure', 'facial'] },
];

const words = (text: string) =>
  text.toLowerCase().split(/[^a-z0-9-]+/).filter(Boolean).map((w) => (w.length > 3 ? w.replace(/(es|s)$/, '') : w));

/** Best matches for an item description, or codes starting with the digits typed. */
export function suggestHsn(query: string, limit = 5): Omit<HsnEntry, 'keywords'>[] {
  const q = query.trim();
  const pick = ({ code, type, description }: HsnEntry) => ({ code, type, description });
  if (/^\d+$/.test(q)) return HSN_CODES.filter((e) => e.code.startsWith(q)).slice(0, limit).map(pick);
  const qWords = words(q);
  return HSN_CODES.map((e) => {
    const keys = e.keywords.flatMap(words);
    return { e, score: qWords.filter((w) => keys.includes(w)).length };
  })
    .filter((m) => m.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((m) => pick(m.e));
}
