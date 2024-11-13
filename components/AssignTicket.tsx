"use client"

import {Ticket, User} from "@prisma/client"
import React, {use, useState} from "react"
import axios from "axios"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select"

export default function AssignTicket({
  ticket,
  users,
}: {
  ticket: Ticket
  users: User[]
}) {
  const [isAssigning, setIsAssigning] = useState(false)
  const [error, setError] = useState("")

  const assignTicket = async (userId: string) => {
    setError("")
    setIsAssigning(true)

    // use axios to connect to backend
    await axios
      .patch(`/api/tickets/${ticket.id}`, {
        assignedToUserId: userId === "0" ? null : Number(userId), // unassign || userId
      })
      .catch(() => {
        setError("Unable to assign user")
      })

    setIsAssigning(false)
  }

  return (
    <>
      <Select
        defaultValue={ticket.assignedToUserId?.toString() || "0"}
        onValueChange={assignTicket}
        disabled={isAssigning}
      >
        <SelectTrigger>
          <SelectValue
            placeholder="Select User...."
            defaultValue={ticket.assignedToUserId?.toString() || "0"}
          ></SelectValue>
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="0">Unassigned</SelectItem>
          {users.map((user) => (
            <SelectItem key={user.id} value={user.id.toString()}>
              {user.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-destructive">{error}</p>
    </>
  )
}
