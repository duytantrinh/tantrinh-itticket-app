import prisma from "@/prisma/db"
import {userSchema} from "@/validationSchema/schemaUsers"
import bcrypt from "bcrypt"
import {getServerSession} from "next-auth"
import {NextRequest, NextResponse} from "next/server"
import {OPTIONS} from "../../auth/[...nextauth]/route"

// id get from url
type Props = {
  params: {id: string}
}

export async function PATCH(req: NextRequest, {params}: Props) {
  // check Logged IN ?
  const session = await getServerSession(OPTIONS)
  if (!session) {
    return NextResponse.json({error: "Not authenticated"}, {status: 401})
  }

  const body = await req.json() // (body is new updateddata from UserForm)
  const validation = userSchema.safeParse(body)

  if (!validation.success) {
    return NextResponse.json(validation.error.format(), {status: 400})
  }

  // 1. find userId want to update based on params:id on url
  const user = await prisma.user.findUnique({
    where: {
      id: parseInt(params.id),
    },
  })

  if (!user) {
    return NextResponse.json({error: "User not found!!!"}, {status: 400})
  }

  // 2. update new Password (optional) - password empty => No update
  if (body?.password && body.password != "") {
    const hashPassword = await bcrypt.hash(body.password, 10)
    body.password = hashPassword
  } else {
    delete body.password
  }

  //   console.log(body)

  // 3. update new username (optional)
  if (user.username !== body.username) {
    const duplicateUsername = await prisma.user.findUnique({
      where: {
        username: body.username,
      },
    })

    if (duplicateUsername) {
      return NextResponse.json({message: "Duplicate Username"}, {status: 409})
    }
  }

  // 4. update whole user form
  const updateUser = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      ...body, // (body is new updated data from UserForm)
    },
  })

  return NextResponse.json(updateUser)
}
