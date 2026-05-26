import prisma, { seedDatabase } from './db.js';

async function reseed() {
  console.log("Starting DB Reseed...");
  try {
    // Drop all tables in correct dependency order to prevent FK violations
    await prisma.transaction.deleteMany();
    await prisma.orderItem.deleteMany();
    
    // Clear table activeOrder relations
    await prisma.table.updateMany({ data: { orderId: null } });
    await prisma.order.deleteMany();
    
    await prisma.menuItem.deleteMany();
    await prisma.table.deleteMany();
    console.log("Cleared old MenuItem, Table, Order, OrderItem, and Transaction records.");

    // Seed new luxury data
    await seedDatabase();
    console.log("DB Reseed completed successfully!");
  } catch (err) {
    console.error("Reseed failed:", err);
  } finally {
    await prisma.$disconnect();
  }
}

reseed();
