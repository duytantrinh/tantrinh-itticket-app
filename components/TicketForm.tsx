"use client"

import React, {useState} from "react"
import {Form, FormControl, FormField, FormItem, FormLabel} from "./ui/form"
import {ticketSchema} from "@/validationSchema/schemaTicket"
import {z} from "zod"
import {Controller, useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import {Input} from "./ui/input"
import SimpleMDE from "react-simplemde-editor"
import "easymde/dist/easymde.min.css"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import {Button} from "./ui/button"
import axios from "axios"
import {useRouter} from "next/navigation"
import {Ticket} from "@prisma/client"

type TicketFormData = z.infer<typeof ticketSchema>

type Props = {
  ticket?: Ticket
}

export default function TicketForm({ticket}: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const form = useForm<TicketFormData>({
    resolver: zodResolver(ticketSchema),
  })

  async function onSubmit(values: z.infer<typeof ticketSchema>) {
    try {
      setIsSubmitting(true)
      setError("")

      if (ticket) {
        // edit - call PATCH REQUEST at api/ticket/[id]/route
        await axios.patch("/api/tickets/" + ticket.id, values)
      } else {
        // passing formData to api/tickets/route - create new
        await axios.post("/api/tickets", values)
      }

      setIsSubmitting(false)

      // redirect back "tickets"
      router.push("/tickets")
      router.refresh()
    } catch (error) {
      setError("Unknown Error occured")
      setIsSubmitting(false)
    }
  }

  return (
    <div className="rounded-md border w-full p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            defaultValue={ticket?.title}
            render={({field}) => (
              <FormItem>
                <FormLabel className="text-gray-500">Ticket Title</FormLabel>
                <FormControl>
                  <Input placeholder="Ticket title..." {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          {/* // Description */}
          <Controller
            name="description"
            control={form.control}
            defaultValue={ticket?.description}
            render={({field}) => (
              <SimpleMDE placeholder="Description" {...field} />
            )}
          />

          <div className="flex w-full space-x-4">
            {/* /// Status */}
            <FormField
              control={form.control}
              name="status"
              defaultValue={ticket?.status}
              render={({field}) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder="Status...."
                          defaultValue={ticket?.status}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="OPEN">Open</SelectItem>
                      <SelectItem value="STARTED">Started</SelectItem>
                      <SelectItem value="CLOSED">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {/* Priority */}
            <FormField
              control={form.control}
              name="priority"
              defaultValue={ticket?.priority}
              render={({field}) => (
                <FormItem>
                  <FormLabel>Priority</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder="Priority...."
                          defaultValue={ticket?.priority}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="LOW">Low</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="HIGH">High</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {ticket ? "Update Ticket" : "Create New"}
          </Button>
        </form>
      </Form>

      <p className="text-destructive mt-5">{error}</p>
    </div>
  )
}
