import {Ticket, User} from "@prisma/client"
import React from "react"
import ReactMarkDown from "react-markdown"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import TicketStatusBadge from "@/components/TicketStatusBadge"
import TicketPriority from "@/components/TicketPriority"
import {dateFormat} from "@/app/utils/format"
import Link from "next/link"
import {buttonVariants} from "@/components/ui/button"
import DeleteButton from "./DeleteButton"
import AssignTicket from "@/components/AssignTicket"

type Props = {
  ticket: Ticket
  users: User[]
}

export default function TicketDetail({ticket, users}: Props) {
  return (
    <div className="lg:grid lg:grid-cols-4">
      <Card className="mx-4 mb-4 lg:col-span-3 lg:mr-4">
        <CardHeader>
          <div className="flex justify-between mb-4">
            <TicketStatusBadge status={ticket.status} />

            <TicketPriority priority={ticket.priority} />
          </div>

          <CardTitle>{ticket.title}</CardTitle>
          <CardDescription>
            Created: {dateFormat(ticket.createdAt)}
          </CardDescription>
        </CardHeader>
        {/* // dark: css for darkmode */}
        <CardContent className="prose dark:prose-invert">
          <ReactMarkDown>{ticket.description}</ReactMarkDown>
        </CardContent>
        <CardFooter>Updated: {dateFormat(ticket.updatedAt)}</CardFooter>
      </Card>

      <div className="flex lg:flex-col mx-4 lg:mx-0 gap-3">
        <AssignTicket ticket={ticket} users={users} />
        <Link
          href={`/tickets/edit/${ticket.id}`}
          className={`${buttonVariants({variant: "default"})}`}
        >
          Edit Ticket
        </Link>
        <DeleteButton ticketId={ticket.id} />
      </div>
    </div>
  )
}
