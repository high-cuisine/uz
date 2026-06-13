import { NextRequest, NextResponse } from "next/server";
import { getTopupToken, addBalance } from "@/lib/store";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { token, amount } = body;

  if (!token || typeof token !== "string") {
    return NextResponse.json({ error: "Неверный токен" }, { status: 400 });
  }

  const topupToken = getTopupToken(token);
  if (!topupToken) {
    return NextResponse.json({ error: "Токен не найден или истёк" }, { status: 404 });
  }

  const parsedAmount = parseFloat(amount);
  if (isNaN(parsedAmount) || parsedAmount <= 0 || parsedAmount > 1_000_000) {
    return NextResponse.json({ error: "Неверная сумма" }, { status: 400 });
  }

  const account = addBalance(Math.round(parsedAmount * 100) / 100);
  return NextResponse.json({ success: true, newBalance: account.balance });
}
