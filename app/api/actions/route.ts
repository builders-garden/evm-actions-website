import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const address = req.nextUrl.searchParams.get("address");

    if (!address) {
      return NextResponse.json(
        { error: "address is required" },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.SUPABASE_URL as string,
      process.env.SUPABASE_KEY as string
    );

    const { data: records } = await supabase
      .from("records")
      .select("*")
      .eq("owner", address);

    console.log(records);

    if (!records) {
      return NextResponse.json({ error: "no records found" }, { status: 404 });
    }

    return NextResponse.json({ result: records });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "failed to fetch records" },
      { status: 500 }
    );
  }
}
