import { prisma } from "@/lib/db";
import { getUid } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const uid = getUid();
  if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { stationId, restaurantId, items, totalPaise, trainNo, coach, seat, eta } = await req.json();
  if (!stationId || !restaurantId || !Array.isArray(items) || !totalPaise || !trainNo) {
    return NextResponse.json({ error: "missing required fields" }, { status: 400 });
  }
  const order = await prisma.order.create({
    data: {
      userId: uid,
      stationId,
      restaurantId,
      items,
      totalPaise,
      trainNo,
      coach,
      seat,
      eta: eta ? new Date(eta) : null,
    },
  });
  return NextResponse.json(order);
}

export async function GET() {
  const uid = getUid();
  if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const list = await prisma.order.findMany({
    where: { userId: uid },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(list);
}
