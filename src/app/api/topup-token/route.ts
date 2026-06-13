import { NextResponse } from "next/server";
import { createTopupToken } from "@/lib/store";

export async function POST() {
  const token = createTopupToken("main");
  return NextResponse.json({ token });
}
