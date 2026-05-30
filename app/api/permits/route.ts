import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { protectApiRoute } from "@/proxy";

export async function GET(req: NextRequest) {
  const auth = protectApiRoute(req);
  if (!auth.authorized || !auth.user) {
    return auth.response!;
  }

  try {
    if (auth.user.role === "ADMIN") {
      const permits = await db.permit.findMany({
        include: {
          user: {
            select: {
              username: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      return NextResponse.json(permits);
    } else {
      const permits = await db.permit.findMany({
        where: {
          userId: auth.user.id,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      return NextResponse.json(permits);
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal mengambil data" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const auth = protectApiRoute(req, ["USER"]);
  if (!auth.authorized || !auth.user) {
    return auth.response!;
  }

  try {
    const { title, description, date } = await req.json();

    if (!title || !description || !date) {
      return NextResponse.json(
        { error: "Data tidak lengkap" },
        { status: 400 }
      );
    }

    const newPermit = await db.permit.create({
      data: {
        title,
        description,
        date,
        status: "PENDING",
        userId: auth.user.id,
      },
    });

    return NextResponse.json(newPermit, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal membuat pengajuan" },
      { status: 500 }
    );
  }
}
