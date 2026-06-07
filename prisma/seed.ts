import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminPass = await bcrypt.hash("Admin@123", 12);
  await prisma.user.upsert({
    where: { email: "admin@vsbansalassociates.com" },
    create: {
      email: "admin@vsbansalassociates.com",
      name: "Portal Admin",
      passwordHash: adminPass,
      role: UserRole.ADMIN,
      emailVerified: new Date(),
    },
    update: {
      passwordHash: adminPass,
      role: UserRole.ADMIN,
    },
  });

  const clientPass = await bcrypt.hash("Client@123", 12);
  await prisma.user.upsert({
    where: { email: "client@vsbansalassociates.com" },
    create: {
      email: "client@vsbansalassociates.com",
      name: "Sample Client",
      passwordHash: clientPass,
      role: UserRole.CLIENT,
      company: "Sample Trading Pvt Ltd",
      emailVerified: new Date(),
    },
    update: {
      passwordHash: clientPass,
      role: UserRole.CLIENT,
    },
  });

  await prisma.lead.create({
    data: {
      name: "Demo Lead",
      email: "prospect@example.com",
      phone: "+91 93546 32052",
      service: "GST Filing & Compliance",
      message: "Interested in monthly GST and bookkeeping support for a 40-person team.",
      source: "seed",
    },
  });

  console.info(
    "Seeded admin (admin@vsbansalassociates.com / Admin@123), client (client@vsbansalassociates.com / Client@123), sample lead."
  );
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
