import React from "react"
import prisma from "@/prisma/db"
import TicketDetail from "./TicketDetail"

type Props = {
  params: {id: string}
}

export default async function ViewTicket({params}: Props) {
  const ticket = await prisma.ticket.findUnique({
    where: {
      id: parseInt(params.id),
    },
  })

  const users = await prisma.user.findMany()

  if (!ticket) {
    return <p className="text-destructive">Ticket Not Found !!!</p>
  }

  return <TicketDetail ticket={ticket} users={users} />
}
