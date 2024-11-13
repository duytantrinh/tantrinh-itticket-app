import prisma from "@/prisma/db"
import {ticketPatchSchema, ticketSchema} from "@/validationSchema/schemaTicket"
import {getServerSession} from "next-auth"
import {NextRequest, NextResponse} from "next/server"
import {OPTIONS} from "../../auth/[...nextauth]/route"

type Props = {
  params: {id: string}
}

export async function PATCH(req: NextRequest, {params}: Props) {
  // check Logged IN ?
  const session = await getServerSession(OPTIONS)
  if (!session) {
    return NextResponse.json({error: "Not authenticated"}, {status: 401})
  }

  const body = await req.json()
  const validation = ticketPatchSchema.safeParse(body)

  if (!validation.success) {
    return NextResponse.json(validation.error.format(), {status: 400})
  }

  const ticket = await prisma.ticket.findUnique({
    where: {
      id: parseInt(params.id),
    },
  })

  if (!ticket) {
    return NextResponse.json({error: "Ticket not found!!!"}, {status: 400})
  }

  if (body?.assignedToUserId) {
    body.assignedToUserId = parseInt(body.assignedToUserId)
  }

  const updateTicket = await prisma.ticket.update({
    where: {
      id: ticket.id,
    },
    data: {
      ...body,
    },
  })

  return NextResponse.json(updateTicket)
}

export async function DELETE(req: NextRequest, {params}: Props) {
  // check Logged IN ?
  const session = await getServerSession(OPTIONS)
  if (!session) {
    return NextResponse.json({error: "Not authenticated"}, {status: 401})
  }

  const ticket = await prisma.ticket.findUnique({
    where: {
      id: parseInt(params.id),
    },
  })

  if (!ticket) {
    return NextResponse.json({error: "Ticket not found!!!"}, {status: 400})
  }

  await prisma.ticket.delete({
    where: {
      id: ticket.id,
    },
  })

  return NextResponse.json({message: "Ticket Deleted"})
}
