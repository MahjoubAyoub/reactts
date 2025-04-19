import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Clock, Star, Share2 } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Link href="/editor/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Design
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Recent Designs</CardTitle>
            <CardDescription>Your recently edited designs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded bg-muted"></div>
                  <div>
                    <p className="text-sm font-medium">Design {i}</p>
                    <p className="text-xs text-muted-foreground">Edited 2 days ago</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/dashboard/designs">
              <Button variant="ghost" size="sm" className="gap-1">
                <Clock className="h-4 w-4" />
                View all
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Favorite Templates</CardTitle>
            <CardDescription>Your favorite templates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded bg-muted"></div>
                  <div>
                    <p className="text-sm font-medium">Template {i}</p>
                    <p className="text-xs text-muted-foreground">Social Media</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/dashboard/templates">
              <Button variant="ghost" size="sm" className="gap-1">
                <Star className="h-4 w-4" />
                View all
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Shared with You</CardTitle>
            <CardDescription>Designs shared by others</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded bg-muted"></div>
                  <div>
                    <p className="text-sm font-medium">Shared Design {i}</p>
                    <p className="text-xs text-muted-foreground">By User {i}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/dashboard/shared">
              <Button variant="ghost" size="sm" className="gap-1">
                <Share2 className="h-4 w-4" />
                View all
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      <div>
        <h2 className="text-xl font-bold tracking-tight mb-4">Quick Start Templates</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Link href={`/editor/template/${i}`} key={i}>
              <div className="group cursor-pointer">
                <div className="aspect-[3/4] rounded-lg border bg-muted overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    Template {i}
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-sm font-medium group-hover:underline">Template {i}</p>
                  <p className="text-xs text-muted-foreground">Category</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
