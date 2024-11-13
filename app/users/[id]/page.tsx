import {OPTIONS} from "@/app/api/auth/[...nextauth]/route"
import UserForm from "@/components/UserForm"
import prisma from "@/prisma/db"
import {getServerSession} from "next-auth"
import React from "react"

type Props = {
  params: {id: string}
}

export default async function EditUser({params}: Props) {
  // get authentication USer
  const session = await getServerSession(OPTIONS)
  if (session?.user.role !== "ADMIN") {
    return <p className="text-destructive">Admin Access required</p>
  }

  const user = await prisma?.user.findUnique({
    where: {
      id: parseInt(params.id),
    },
  })

  if (!user) {
    return <p className="text-destructive">User Not Found</p>
  }

  user.password = ""
  return <UserForm user={user} />
}
