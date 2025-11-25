import { query } from "@/lib/connectDb";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const res = await query("SELECT * FROM employees");
    console.log("response!!!", res);

    return NextResponse.json(res.rows);
  } catch (error) {
    console.log("Error", error);
  }
};
