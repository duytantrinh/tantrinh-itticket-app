import dynamic from "next/dynamic"
import React from "react"

const TicketForm = dynamic(() => import("@/components/TicketForm"), {
  ssr: false,
})

export default function NewTicket() {
  return <TicketForm />
}
