import prisma from "@/prisma/db"
import dynamic from "next/dynamic"
import React from "react"

type Props = {
  params: {id: string}
}

const TicketForm = dynamic(() => import("@/components/TicketForm"), {
  ssr: false,
})

export default async function EditTicket({params}: Props) {
  const ticket = await prisma.ticket.findUnique({
    where: {
      id: parseInt(params.id),
    },
  })

  if (!ticket) {
    return <p className="text-destructive">Ticket Not Found !!!</p>
  }

  return <TicketForm ticket={ticket} />
}
