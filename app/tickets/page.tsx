import React from "react"
import prisma from "@/prisma/db"
import DataTable from "./DataTable"
import Link from "next/link"
import {buttonVariants} from "@/components/ui/button"
import Pagination from "@/components/Pagination"
import StatusFilter from "@/components/StatusFilter"
import {Status, Ticket} from "@prisma/client"

export type SearchParams = {
  status: Status
  page: string
  orderBy: keyof Ticket
}

export default async function Tickets({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const pageSize = 10
  const currentPage = parseInt(searchParams.page) || 1

  // for status filter
  const statuses = Object.values(Status)

  // for orderBy filter
  const orderBy = searchParams.orderBy ? searchParams.orderBy : "createdAt"

  // check Status type in prisma  status on url ?
  const status = statuses.includes(searchParams.status)
    ? searchParams.status
    : undefined // // no Status on url http://localhost:3000/tickets

  // for filter status
  let where = {}
  if (status) {
    where = {
      status,
    }
  } else {
    where = {
      NOT: [{status: "CLOSED" as Status}], // no Status on url , showing OPEN and STARTED status
    }
  }

  const tickets = await prisma.ticket.findMany({
    // for filter status
    where,
    // for showign and pagination
    take: pageSize, // number of item per page
    skip: (currentPage - 1) * pageSize, // number of skip item

    // for orderBy filter
    orderBy: {
      [orderBy]: "desc", //[orderBy] : cách truyền variable trong db query
    },
  })

  // Find total iticket after filtering
  const ticketCount = await prisma.ticket.count({
    where,
  })
  // console.log(ticketCount)

  return (
    <div>
      <div className="flex gap-4 ">
        <Link
          href="/tickets/new"
          className={buttonVariants({variant: "default"})}
        >
          New Ticket
        </Link>

        <StatusFilter />
      </div>

      <DataTable tickets={tickets} searchParams={searchParams} />

      <Pagination
        itemCount={ticketCount}
        pageSize={pageSize}
        currentPage={currentPage}
      />
    </div>
  )
}
