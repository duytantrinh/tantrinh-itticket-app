"use client"

import React, {useState} from "react"
import {Form, FormControl, FormField, FormItem, FormLabel} from "./ui/form"

import {z} from "zod"
import {Controller, useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import {Input} from "./ui/input"

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
import {User} from "@prisma/client"
import {userSchema} from "@/validationSchema/schemaUsers"

type UserFormData = z.infer<typeof userSchema>

type Props = {
  user?: User
}

export default function UserForm({user}: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  })

  async function onSubmit(values: z.infer<typeof userSchema>) {
    try {
      setIsSubmitting(true)
      setError("")

      if (user) {
        // edit - call PATCH REQUEST at api/user/[id]/route
        await axios.patch("/api/users/" + user.id, values)
      } else {
        // passing formData to api/users/route - create new
        await axios.post("/api/users", values)
      }

      setIsSubmitting(false)

      // redirect back "users"
      router.push("/users")
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
            name="name"
            defaultValue={user?.name}
            render={({field}) => (
              <FormItem>
                <FormLabel className="text-gray-500">FullName</FormLabel>
                <FormControl>
                  <Input placeholder="Enter fullname..." {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="username"
            defaultValue={user?.username}
            render={({field}) => (
              <FormItem>
                <FormLabel className="text-gray-500">Username</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Username..." {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            defaultValue={user?.password}
            render={({field}) => (
              <FormItem>
                <FormLabel className="text-gray-500">Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    required={user ? false : true} // new user -> create password, update -> NO
                    placeholder="Enter password..."
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="flex w-full space-x-4">
            {/* /// Status */}
            <FormField
              control={form.control}
              name="role"
              defaultValue={user?.role}
              render={({field}) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder="Status...."
                          defaultValue={user?.role}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="USER">User</SelectItem>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                      <SelectItem value="TECH">Tech</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {user ? "Update User" : "Create New"}
          </Button>
        </form>
      </Form>
      <p className="text-destructive">{error}</p>
    </div>
  )
}
