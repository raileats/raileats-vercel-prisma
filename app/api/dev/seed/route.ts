import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  const token = process.env.SEED_TOKEN;
  const supplied = req.headers.get("x-seed-token");
  if (!token || supplied !== token) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const ndls = await prisma.station.upsert({
    where: { code: "NDLS" },
    update: {},
    create: { code: "NDLS", name: "New Delhi", city: "Delhi", platforms: 16 },
  });
  const pune = await prisma.station.upsert({
    where: { code: "PUNE" },
    update: {},
    create: { code: "PUNE", name: "Pune Jn", city: "Pune", platforms: 6 },
  });

  await prisma.restaurant.create({
    data: {
      name: "Delhi Diner",
      stationId: ndls.id,
      cuisines: ["North Indian", "Thali"],
      items: { create: [
        { name: "Veg Thali", pricePaise: 15900 },
        { name: "Paneer Butter Masala", pricePaise: 21900 },
        { name: "Jeera Rice", pricePaise: 9900 },
      ]},
    },
  });

  await prisma.restaurant.create({
    data: {
      name: "Pune Pizza Co.",
      stationId: pune.id,
      cuisines: ["Pizza", "Fast Food"],
      items: { create: [
        { name: "Margherita", pricePaise: 19900, veg: true },
        { name: "Farmhouse", pricePaise: 25900, veg: true },
      ]},
    },
  });

  return NextResponse.json({ ok: true });
}
