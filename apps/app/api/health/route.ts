import { NextResponse } from "next/server";
import { getPostgresPool } from "@/lib/db";

export async function GET() {
  try {
    await getPostgresPool().query("SELECT 1");
    return NextResponse.json({ status: "ok", database: "connected" });
  } catch (error) {
    console.error("Database health check failed:", error);
    return NextResponse.json(
      { status: "error", database: "unavailable" },
      { status: 503 },
    );
  }
}
