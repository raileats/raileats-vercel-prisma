import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const stationId = String(searchParams.get("stationId") ?? "");
  if (!stationId) return NextResponse.json({ error: "stationId required" }, { status: 400 });
  const list = await prisma.restaurant.findMany({
    where: { stationId, isActive: true },
    include: { items: true },
  });
  return NextResponse.json(list);
}
