import { query } from "@/lib/connectDb";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = async () => {
  const res = await prisma.employees.findMany();
  /*try {
    const res = await query("SELECT * FROM employees");
    console.log("response!!!", res);

    return NextResponse.json(res.rows);
  } catch (error) {
    console.log("Error", error);
  }*/
};
