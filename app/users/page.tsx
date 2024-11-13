import UserForm from "@/components/UserForm"
import React from "react"
import UserDataTable from "./UserDataTable"
import prisma from "@/prisma/db"
import {getServerSession} from "next-auth"
import {OPTIONS} from "../api/auth/[...nextauth]/route"

export default async function Users() {
  // get authentication USer
  // const session = await getServerSession(OPTIONS)
  // if (session?.user.role !== "ADMIN") {
  //   return <p className="text-destructive">Admin Access required</p>
  // }

  const users = await prisma.user.findMany()

  return (
    <div>
      <UserForm />
      <UserDataTable users={users} />
    </div>
  )
}
