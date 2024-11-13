"use client"
import React from "react"
import {Button} from "./ui/button"
import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import {useRouter, useSearchParams} from "next/navigation"

type Props = {
  itemCount: number
  pageSize: number
  currentPage: number
}

export default function Pagination({itemCount, pageSize, currentPage}: Props) {
  const pageCount = Math.ceil(itemCount / pageSize)

  // create Functional
  const router = useRouter()
  const searchParams = useSearchParams()

  if (pageCount <= 1) return null

  const changePage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())

    params.set("page", page.toString()) // create page=string
    router.push("?" + params.toString())
  }

  return (
    <div>
      <div className="mt-4">
        <Button
          variant="outline"
          disabled={currentPage === 1}
          onClick={() => changePage(1)}
        >
          <ChevronFirst />
        </Button>
        <Button
          variant="outline"
          disabled={currentPage === 1}
          onClick={() => changePage(currentPage - 1)}
        >
          <ChevronLeft />
        </Button>

        <Button
          variant="outline"
          disabled={currentPage === pageCount}
          onClick={() => changePage(currentPage + 1)}
        >
          <ChevronRight />
        </Button>
        <Button
          variant="outline"
          disabled={currentPage === pageCount}
          onClick={() => changePage(pageCount)}
        >
          <ChevronLast />
        </Button>
      </div>
      <div>
        <p>
          Page {currentPage} of {pageCount}
        </p>
      </div>
    </div>
  )
}
