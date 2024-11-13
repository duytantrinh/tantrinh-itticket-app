import Link from "next/link"

import {ToggleMode} from "./ToggleMode"
import MainNavLink from "./MainNavLink"
import {getServerSession} from "next-auth"
import {OPTIONS} from "@/app/api/auth/[...nextauth]/route"

const MainNav = async () => {
  // get authentication USer
  const session = await getServerSession(OPTIONS)
  // console.log(session)

  return (
    <div className="flex justify-between items-center flex-wrap">
      <MainNavLink role={session?.user.role} />
      <div className="text-primary">
        Login with username: tantrinh - pass: 123456 for using full App features
      </div>
      <div className="flex items-center gap-2">
        {session ? (
          <Link href="/api/auth/signout?callbackUrl=/">Logout</Link>
        ) : (
          <Link href="/api/auth/signin">Login</Link>
        )}

        <ToggleMode />
      </div>
    </div>
  )
}

export default MainNav
