import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { protectApiRoute } from "@/proxy";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = protectApiRoute(req, ["ADMIN"]);
  if (!auth.authorized) {
    return auth.response!;
  }

  try {
    const { status } = await req.json();
    const { id } = await params;

    if (!status || !["APPROVED", "REJECTED"].includes(status)) {
      return NextResponse.json(
        { error: "Status tidak valid" },
        { status: 400 }
      );
    }

    const updatedPermit = await db.permit.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(updatedPermit);
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal memperbarui status pengajuan" },
      { status: 500 }
    );
  }
}
