import Link from "next/link"

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-xl">
        D
      </div>
      <span className="font-bold text-xl">Designih</span>
    </Link>
  )
}
