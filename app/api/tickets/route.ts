import prisma from "@/prisma/db"
import {ticketSchema} from "@/validationSchema/schemaTicket"
import {NextRequest, NextResponse} from "next/server"
import {OPTIONS} from "../auth/[...nextauth]/route"
import {getServerSession} from "next-auth"

export async function POST(req: NextRequest) {
  // check Logged IN ?
  const session = await getServerSession(OPTIONS)
  if (!session) {
    return NextResponse.json({error: "Not authenticated"}, {status: 401})
  }

  const body = await req.json()
  const validation = ticketSchema.safeParse(body)

  if (!validation.success) {
    return NextResponse.json(validation.error.format(), {status: 400})
  }

  const newTicket = await prisma.ticket.create({
    data: {
      ...body,
    },
  })

  return NextResponse.json(newTicket, {status: 201})
}
