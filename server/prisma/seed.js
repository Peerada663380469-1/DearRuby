import seedrandom from 'seedrandom';
import prisma from '../db.js';
import bcrypt from 'bcryptjs';

const rng = seedrandom('CY36-PHASE2');

function sample(pool, n) {
  const copy = [...pool];
  const out = [];
  for (let i = 0; i < n; i++) {
    out.push(...copy.splice(Math.floor(rng() * copy.length), 1));
  }
  return out.sort((a, b) => a - b);
}

function generateRandomPhone() {
  return `08${Math.floor(rng() * 90000000 + 10000000)}`;
}

async function main() {
  console.log('Clearing database...');
  await prisma.reservation.deleteMany();
  await prisma.eventInquiry.deleteMany();
  await prisma.user.deleteMany();
  await prisma.menuItem.deleteMany();

  console.log('Seeding Users and Reservations...');
  const pinHash = bcrypt.hashSync('1234', 10);
  
  // Create 50 Users
  const users = [];
  users.push(await prisma.user.create({ data: { name: 'Power User', email: 'power_user@test.com', pin_hash: pinHash } }));
  users.push(await prisma.user.create({ data: { name: 'Export User', email: 'export_user@test.com', pin_hash: pinHash } }));
  users.push(await prisma.user.create({ data: { name: 'API User', email: 'api_user@test.com', pin_hash: pinHash } }));
  
  for (let i = 4; i <= 50; i++) {
    users.push(await prisma.user.create({ data: { name: `Customer ${i}`, email: `customer${i}@test.com`, pin_hash: pinHash } }));
  }

  // Define Reservation ID Pools
  const exportBlock = Array.from({ length: 45 }, (_, i) => 500 + i);
  let rest = Array.from({ length: 1200 }, (_, i) => i + 1).filter(id => !exportBlock.includes(id));
  
  const powerIds = sample(rest, 60);
  rest = rest.filter(i => !powerIds.includes(i));
  
  const apiIds = sample(rest, 25);
  rest = rest.filter(i => !apiIds.includes(i));

  const allReservations = [];

  // Helper to create reservation object
  const makeRes = (id, user) => ({
    id,
    userId: user.id,
    firstName: user.name.split(' ')[0],
    lastName: user.name.split(' ')[1] || 'Test',
    email: user.email,
    phone: generateRandomPhone(),
    date: '2026-10-15',
    time: '19:00',
    guests: Math.floor(rng() * 4) + 1,
    status: 'pending'
  });

  // Assign IDs to special users
  exportBlock.forEach(id => allReservations.push(makeRes(id, users[1]))); // export_user
  powerIds.forEach(id => allReservations.push(makeRes(id, users[0])));    // power_user
  apiIds.forEach(id => allReservations.push(makeRes(id, users[2])));      // api_user

  // Distribute remaining to other 47 users (~12 each)
  let currentUserIdx = 3;
  let countForUser = 0;
  
  for (let i = 0; i < rest.length; i++) {
    if (countForUser >= 12) {
      currentUserIdx++;
      countForUser = 0;
      if (currentUserIdx >= users.length) break; // Reached max users
    }
    allReservations.push(makeRes(rest[i], users[currentUserIdx]));
    countForUser++;
  }

  // Insert Reservations in batches to avoid query limits
  console.log(`Inserting ${allReservations.length} reservations...`);
  for (let i = 0; i < allReservations.length; i += 100) {
    await prisma.reservation.createMany({
      data: allReservations.slice(i, i + 100)
    });
  }

  // Seed Event Inquiries: ~240 records over ID range 1-400 (~60% density, mirrors reservations)
  // Without this, V5 (GET /api/events/:id) and P3 (/events/:id/manage) always return 404.
  console.log('Seeding Event Inquiries...');
  const eventDetailsSamples = [
    'Corporate year-end celebration dinner.',
    'Wedding anniversary private dinner.',
    'Birthday party, request a private zone.',
    'Business meeting with international clients.',
    'Family gathering, prefer indoor seating.',
  ];
  const eventIds = sample(Array.from({ length: 400 }, (_, i) => i + 1), 240);
  const makeEvent = (id) => {
    const user = users[Math.floor(rng() * users.length)];
    return {
      id,
      userId: user.id,
      firstName: user.name.split(' ')[0],
      lastName: user.name.split(' ')[1] || 'Test',
      email: user.email,
      phone: generateRandomPhone(),
      guestCount: Math.floor(rng() * 40) + 10,
      eventDate: '2026-11-20',
      eventDetails: eventDetailsSamples[Math.floor(rng() * eventDetailsSamples.length)],
      status: 'pending',
    };
  };
  const allEvents = eventIds.map(makeEvent);
  console.log(`Inserting ${allEvents.length} event inquiries...`);
  for (let i = 0; i < allEvents.length; i += 100) {
    await prisma.eventInquiry.createMany({
      data: allEvents.slice(i, i + 100)
    });
  }

  // Seed public MenuItem catalog (no owner — public data, not an IDOR surface).
  // Names + images MUST match the frontend demoMenuData in client/src/pages/MenuPage.jsx
  // so every item resolves its image (mismatched names fall back to a generic photo).
  console.log('Seeding Menu Items...');
  const menuItems = [
    // Starters
    { name: 'Burrata & Heirloom Tomato', price: 680, category: 'Starters', isVegetarian: true, image: '/images/Burrata-Heirloom-Tomato.png' },
    { name: 'Pan-Seared Foie Gras', price: 1250, category: 'Starters', image: '/images/Pan-Seared-Foie-Gras.png' },
    { name: 'Truffle Mushroom Arancini', price: 550, category: 'Starters', isVegetarian: true, image: '/images/TruffleMushroom-Arancini.png' },
    { name: 'Spicy Wagyu Carpaccio', price: 780, category: 'Starters', isSpicy: true, image: '/images/SpicyWagyuCarpaccio.png' },
    { name: 'Pan-Seared Hokkaido Scallops', price: 850, category: 'Starters', image: '/images/Pan-SearedHokkaidoScallops.png' },
    // Mains
    { name: 'A5 Wagyu Beef Tenderloin', price: 3500, category: 'Mains', image: '/images/A5WagyuBeefTenderloin.png' },
    { name: 'Maine Lobster Ravioli', price: 1450, category: 'Mains', image: '/images/MaineLobsterRavioli.png' },
    { name: 'Spicy Blue Crab Tagliolini', price: 950, category: 'Mains', isSpicy: true, image: '/images/SpicyBlueCrabTagliolini.png' },
    { name: 'Mediterranean Pan-Seared Seabass', price: 980, category: 'Mains', image: '/images/Mediterranean Pan-Seared Seabass.png' },
    { name: 'Pan-Seared Duck Breast', price: 890, category: 'Mains', image: '/images/Pan-Seared Duck Breast.png' },
    // Artisan Pizza
    { name: 'Pizza Margherita D.O.C.', price: 550, category: 'Artisan Pizza', isVegetarian: true, image: '/images/Pizza Margherita D.O.C..png' },
    { name: 'Pizza Black Truffle & Porcini', price: 890, category: 'Artisan Pizza', isVegetarian: true, image: '/images/Pizza Black Truffle & Porcini.png' },
    { name: 'Pizza Diavola & Spicy Nduja', price: 690, category: 'Artisan Pizza', isSpicy: true, image: '/images/Pizza Diavola & Spicy Nduja.png' },
    { name: 'Pizza Prosciutto di Parma & Burrata', price: 850, category: 'Artisan Pizza', image: '/images/Pizza Prosciutto di Parma & Burrata.png' },
    { name: 'Pizza 4 Formaggi & Organic Honey', price: 680, category: 'Artisan Pizza', isVegetarian: true, image: '/images/Pizza 4 Formaggi & Organic Honey.png' },
    { name: 'Pizza Spicy Seafood Marinara', price: 890, category: 'Artisan Pizza', isSpicy: true, image: '/images/Pizza Spicy Seafood Marinara.png' },
    // Desserts
    { name: 'Signature Deconstructed Tiramisu', price: 450, category: 'Desserts', isVegetarian: true, image: '/images/Signature Deconstructed Tiramisu.png' },
    { name: 'Deconstructed Lemon Meringue Tart', price: 420, category: 'Desserts', isVegetarian: true, image: '/images/Deconstructed Lemon Meringue Tart.png' },
    { name: 'Warm Belgian Chocolate Lava Cake', price: 480, category: 'Desserts', isVegetarian: true, image: '/images/Warm Belgian Chocolate Lava Cake.png' },
    { name: 'Madagascar Vanilla Crème Brûlée', price: 420, category: 'Desserts', isVegetarian: true, image: '/images/Madagascar Vanilla Crème Brûlée.png' },
    // Drinks
    { name: 'Ruby Signature Cocktail', price: 550, category: 'Drinks', isVegetarian: true, image: '/images/Ruby Signature Cocktail.png' },
    { name: 'Smoked Rosemary Old Fashioned', price: 620, category: 'Drinks', isVegetarian: true, image: '/images/Smoked Rosemary Old Fashioned.png' },
    { name: 'Evian Mineral Water', price: 150, category: 'Drinks', isVegetarian: true, image: '/images/Evian Mineral Water.png' },
    { name: 'Tokyo Sour', price: 480, category: 'Drinks', isVegetarian: true, image: '/images/Tokyo Sour.png' },
    { name: 'Lychee Martini', price: 450, category: 'Drinks', isVegetarian: true, image: '/images/Lychee Martini.png' },
    { name: 'Midnight Espresso Martini', price: 480, category: 'Drinks', isVegetarian: true, image: '/images/Midnight Espresso Martini.png' },
    { name: 'Sunset Aperol Spritz', price: 520, category: 'Drinks', isVegetarian: true, image: '/images/Sunset Aperol Spritz.png' },
    { name: 'Spicy Mango Margarita', price: 460, category: 'Drinks', isVegetarian: true, isSpicy: true, image: '/images/Spicy Mango Margarita.png' },
    // Premium Wines
    { name: 'Alta Vigna - Cannonau di Sardegna', price: 2560, category: 'Premium Wines', isVegetarian: true, image: '/images/Alta Vigna - Cannonau di Sardegna.png' },
    { name: 'Vento Rosso - Sardinian Rosé', price: 1820, category: 'Premium Wines', isVegetarian: true, image: '/images/Vento Rosso - Sardinian Rosé wine.png' },
    { name: 'Luce Di Terra - Isola dei Nuraghi', price: 3200, category: 'Premium Wines', isVegetarian: true, image: '/images/Luce Di Terra - Isola dei Nuraghi.png' },
  ];
  console.log(`Inserting ${menuItems.length} menu items...`);
  await prisma.menuItem.createMany({ data: menuItems });

  // ⚠️ Important for PostgreSQL: Reset sequence so POST creation doesn't crash on ID conflict
  console.log('Resetting PostgreSQL sequences...');
  await prisma.$executeRawUnsafe(`
    SELECT setval(pg_get_serial_sequence('"Reservation"', 'id'), (SELECT COALESCE(MAX(id), 1) FROM "Reservation"));
  `);
  await prisma.$executeRawUnsafe(`
    SELECT setval(pg_get_serial_sequence('"EventInquiry"', 'id'), (SELECT COALESCE(MAX(id), 1) FROM "EventInquiry"));
  `);
  await prisma.$executeRawUnsafe(`
    SELECT setval(pg_get_serial_sequence('"User"', 'id'), (SELECT COALESCE(MAX(id), 1) FROM "User"));
  `);

  console.log('Seeding completed deterministically! ✅');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
