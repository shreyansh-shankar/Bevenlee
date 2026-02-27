import { NextRequest, NextResponse } from "next/server"

interface Props {
    params: Promise<{ token: string }>
}

export async function GET(_req: NextRequest, { params }: Props) {
    const { token } = await params
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/share/${token}`,
            { cache: "no-store" }
        )

        if (!res.ok) {
            if (res.status === 404) {
                return NextResponse.json({ error: "Not found" }, { status: 404 })
            }
            return NextResponse.json({ error: "Failed to fetch preview" }, { status: 500 })
        }

        const data = await res.json()
        return NextResponse.json(data)
    } catch (err) {
        console.error("Error fetching share preview:", err)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}