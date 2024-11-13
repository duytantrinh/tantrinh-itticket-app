"use client"
import {useRouter, useSearchParams} from "next/navigation"
import React from "react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select"

const statuses: {label: string; value?: string}[] = [
  {label: "Open / Started"},
  {label: "Open", value: "OPEN"},
  {label: "Started", value: "STARTED"},
  {label: "Closed", value: "CLOSED"},
]

export default function StatusFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()

  console.log(searchParams)

  return (
    <Select
      defaultValue={searchParams.get("status") || ""}
      onValueChange={(status) => {
        const params = new URLSearchParams()
        if (status) params.append("status", status)

        // ?status=0 : for label: "Open / Started"
        const query = params.size ? `?${params.toString()}` : "0"

        router.push(`/tickets${query}`)
      }}
    >
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Filter by Status...." />

        <SelectContent>
          <SelectGroup>
            {statuses.map((status) => (
              <SelectItem key={status.value || "0"} value={status.value || "0"}>
                {status.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </SelectTrigger>
    </Select>
  )
}
