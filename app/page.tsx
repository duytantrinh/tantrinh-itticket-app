import React from "react"
import prisma from "@/prisma/db"
import DashRecentTicket from "@/components/DashRecentTicket"
import DashChart from "@/components/DashChart"

async function Dashboard() {
  const tickets = await prisma.ticket.findMany({
    where: {
      NOT: [{status: "CLOSED"}],
    },

    orderBy: {
      updatedAt: "desc",
    },

    skip: 0,
    take: 5, // show 5 last ticket
    include: {
      assignedToUser: true,
    },
  })

  const groupTicket = await prisma.ticket.groupBy({
    by: ["status"],
    _count: {
      id: true,
    },
  })

  // console.log(groupTicket)

  const data = groupTicket.map((item) => {
    return {
      name: item.status,
      total: item._count.id,
    }
  })

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2 px-2 my-5">
        <div>
          <DashRecentTicket tickets={tickets} />
        </div>
        <div>
          <DashChart data={data} />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
