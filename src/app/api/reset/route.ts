import { NextResponse } from "next/server";
import { resetBalance } from "@/lib/store";

export async function POST() {
  const account = resetBalance();
  return NextResponse.json(account);
}
