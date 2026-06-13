import { NextRequest, NextResponse } from "next/server";
import { getTopupToken, addBalance } from "@/lib/store";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { token, amount } = body;

  if (!token || typeof token !== "string") {
    return NextResponse.json({ error: "Noto'g'ri token" }, { status: 400 });
  }

  const topupToken = getTopupToken(token);
  if (!topupToken) {
    return NextResponse.json({ error: "Token topilmadi yoki muddati o'tgan" }, { status: 404 });
  }

  const parsedAmount = parseFloat(amount);
  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    return NextResponse.json({ error: "Noto'g'ri summa" }, { status: 400 });
  }

  const account = addBalance(Math.round(parsedAmount * 100) / 100);
  return NextResponse.json({ success: true, newBalance: account.balance });
}
