import { NextResponse } from "next/server";
import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

/**
 * One-time production seed. Set SETUP_SECRET on Vercel, then:
 * curl -X POST https://YOUR_SITE/api/setup/seed -H "Authorization: Bearer YOUR_SETUP_SECRET"
 * Remove SETUP_SECRET after use.
 */
export async function POST(req: Request) {
  const secret = process.env.SETUP_SECRET;
  const auth = req.headers.get("authorization");

  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const prisma = new PrismaClient();

  try {
    const adminPass = await bcrypt.hash("Admin@123", 12);
    const clientPass = await bcrypt.hash("Client@123", 12);

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

    return NextResponse.json({
      ok: true,
      users: [
        "admin@vsbansalassociates.com / Admin@123",
        "client@vsbansalassociates.com / Client@123",
      ],
    });
  } catch (error) {
    console.error("Setup seed error:", error);
    return NextResponse.json(
      {
        error:
          "Seed failed. Run prisma/neon-setup.sql in Neon SQL editor first, then retry.",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
