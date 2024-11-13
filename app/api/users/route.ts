import prisma from "@/prisma/db"
import {userSchema} from "@/validationSchema/schemaUsers"
import {NextRequest, NextResponse} from "next/server"
import bcrypt from "bcrypt"
import {getServerSession} from "next-auth"
import {OPTIONS} from "../auth/[...nextauth]/route"

export async function POST(req: NextRequest) {
  // check Logged IN ?
  const session = await getServerSession(OPTIONS)
  if (!session) {
    return NextResponse.json({error: "Not authenticated"}, {status: 401})
  }

  // ONLY ADMIN can create new user
  if (session.user.role !== "ADMIN") {
    return NextResponse.json({error: "Not authenticated"}, {status: 401})
  }

  const body = await req.json()
  const validation = userSchema.safeParse(body)

  if (!validation.success) {
    return NextResponse.json(validation.error.format(), {status: 400})
  }

  // 1. check username
  const duplicate = await prisma.user.findUnique({
    where: {
      username: body.username,
    },
  })

  if (duplicate) {
    return NextResponse.json({message: "Duplicate Username"}, {status: 409})
  }

  // 2. create hashPasswaord
  const hashPassword = await bcrypt.hash(body.password, 10)
  body.password = hashPassword

  // 3. create new Suer
  const newUser = await prisma.user.create({
    data: {
      ...body,
    },
  })

  return NextResponse.json(newUser, {status: 201})
}
