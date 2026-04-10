import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/finsheet";
const adapter = new PrismaPg(connectionString);
const prisma = new PrismaClient({ adapter });

async function main() {
  const hashedPassword = await bcrypt.hash("password123", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@finsheet.com" },
    update: {},
    create: {
      email: "admin@finsheet.com",
      name: "Admin FinSheet",
      password: hashedPassword,
      role: "SUPER_ADMIN",
    },
  });

  const staff = await prisma.user.upsert({
    where: { email: "keuangan@finsheet.com" },
    update: {},
    create: {
      email: "keuangan@finsheet.com",
      name: "Staff Keuangan",
      password: hashedPassword,
      role: "ADMIN_KEUANGAN",
    },
  });

  await prisma.user.upsert({
    where: { email: "manajer@finsheet.com" },
    update: {},
    create: {
      email: "manajer@finsheet.com",
      name: "Manajer Keuangan",
      password: hashedPassword,
      role: "MANAJER",
    },
  });

  await prisma.user.upsert({
    where: { email: "viewer@finsheet.com" },
    update: {},
    create: {
      email: "viewer@finsheet.com",
      name: "Viewer",
      password: hashedPassword,
      role: "VIEWER",
    },
  });

  const incomeCategories = [
    { name: "Penjualan Produk", icon: "🛒", color: "#22C55E" },
    { name: "Jasa / Layanan", icon: "💼", color: "#10B981" },
    { name: "Investasi", icon: "📈", color: "#059669" },
    { name: "Pendapatan Bunga", icon: "🏦", color: "#047857" },
    { name: "Pendapatan Lainnya", icon: "💰", color: "#34D399" },
  ];

  const expenseCategories = [
    { name: "Gaji Karyawan", icon: "👥", color: "#EF4444" },
    { name: "Sewa & Utilitas", icon: "🏢", color: "#F59E0B" },
    { name: "Operasional", icon: "⚙️", color: "#F97316" },
    { name: "Marketing", icon: "📣", color: "#8B5CF6" },
    { name: "Transportasi", icon: "🚗", color: "#06B6D4" },
    { name: "Perlengkapan Kantor", icon: "📎", color: "#EC4899" },
    { name: "Teknologi & IT", icon: "💻", color: "#3B82F6" },
    { name: "Pengeluaran Lainnya", icon: "📦", color: "#6B7280" },
  ];

  const createdIncomeCategories = [];
  for (const cat of incomeCategories) {
    const existing = await prisma.category.findFirst({
      where: { name: cat.name, type: "INCOME" },
    });
    if (existing) {
      createdIncomeCategories.push(existing);
    } else {
      const created = await prisma.category.create({
        data: { ...cat, type: "INCOME" },
      });
      createdIncomeCategories.push(created);
    }
  }

  const createdExpenseCategories = [];
  for (const cat of expenseCategories) {
    const existing = await prisma.category.findFirst({
      where: { name: cat.name, type: "EXPENSE" },
    });
    if (existing) {
      createdExpenseCategories.push(existing);
    } else {
      const created = await prisma.category.create({
        data: { ...cat, type: "EXPENSE" },
      });
      createdExpenseCategories.push(created);
    }
  }

  const txCount = await prisma.transaction.count();
  if (txCount === 0) {
    const now = new Date();
    const transactions = [];

    for (let i = 0; i < 30; i++) {
      const date = new Date(now.getFullYear(), now.getMonth(), Math.max(1, now.getDate() - i));
      const isIncome = Math.random() > 0.4;

      if (isIncome) {
        const cat = createdIncomeCategories[Math.floor(Math.random() * createdIncomeCategories.length)];
        transactions.push({
          type: "INCOME" as const,
          amount: Math.round((Math.random() * 50_000_000 + 1_000_000) / 1000) * 1000,
          date,
          description: `Pendapatan ${cat.name} #${i + 1}`,
          categoryId: cat.id,
          userId: staff.id,
          paymentMethod: ["bank_transfer", "cash"][Math.floor(Math.random() * 2)],
          reference: `INV-${String(now.getFullYear()).slice(2)}${String(now.getMonth() + 1).padStart(2, "0")}-${String(i + 1).padStart(3, "0")}`,
          tags: [],
        });
      } else {
        const cat = createdExpenseCategories[Math.floor(Math.random() * createdExpenseCategories.length)];
        transactions.push({
          type: "EXPENSE" as const,
          amount: Math.round((Math.random() * 20_000_000 + 500_000) / 1000) * 1000,
          date,
          description: `Pembayaran ${cat.name} #${i + 1}`,
          categoryId: cat.id,
          userId: staff.id,
          paymentMethod: ["bank_transfer", "cash", "credit_card"][Math.floor(Math.random() * 3)],
          reference: `EXP-${String(now.getFullYear()).slice(2)}${String(now.getMonth() + 1).padStart(2, "0")}-${String(i + 1).padStart(3, "0")}`,
          tags: [],
        });
      }
    }

    for (const tx of transactions) {
      await prisma.transaction.create({ data: tx });
    }
  }

  const budgetCount = await prisma.budget.count();
  if (budgetCount === 0) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    for (const cat of createdExpenseCategories.slice(0, 5)) {
      await prisma.budget.create({
        data: {
          amount: Math.round((Math.random() * 30_000_000 + 5_000_000) / 1000) * 1000,
          period: "MONTHLY",
          startDate: startOfMonth,
          endDate: endOfMonth,
          categoryId: cat.id,
          userId: admin.id,
        },
      });
    }
  }

  console.log("Seed completed successfully!");
  console.log("Users: admin@finsheet.com, keuangan@finsheet.com, manajer@finsheet.com, viewer@finsheet.com");
  console.log("Password: password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
