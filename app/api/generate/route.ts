import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const text = await req.json();

  console.log(text);
  return NextResponse.json(
    { message: "Content summarized", data: text },
    { status: 201 }
  );
};
