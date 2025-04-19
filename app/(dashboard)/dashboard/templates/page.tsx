import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Star, StarOff } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function TemplatesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Templates</h1>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Templates</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
          <TabsTrigger value="print">Print</TabsTrigger>
          <TabsTrigger value="presentation">Presentation</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
        </TabsList>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mt-4">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search templates..." className="w-full sm:w-[300px] pl-8" />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Select defaultValue="popular">
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Popular</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="a-z">A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className="group relative">
                <Link href={`/editor/template/${i}`}>
                  <div className="aspect-[3/4] rounded-lg border bg-muted overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      Template {i + 1}
                    </div>
                  </div>
                </Link>
                <div className="mt-2 flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium group-hover:underline">Template {i + 1}</p>
                    <p className="text-xs text-muted-foreground">Category</p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    {i % 3 === 0 ? <Star className="h-4 w-4 fill-primary" /> : <StarOff className="h-4 w-4" />}
                    <span className="sr-only">Favorite</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="social" className="mt-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="group relative">
                <Link href={`/editor/template/${i}`}>
                  <div className="aspect-[3/4] rounded-lg border bg-muted overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      Social {i + 1}
                    </div>
                  </div>
                </Link>
                <div className="mt-2 flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium group-hover:underline">Social Template {i + 1}</p>
                    <p className="text-xs text-muted-foreground">Social Media</p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    {i % 3 === 0 ? <Star className="h-4 w-4 fill-primary" /> : <StarOff className="h-4 w-4" />}
                    <span className="sr-only">Favorite</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="favorites" className="mt-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="group relative">
                <Link href={`/editor/template/${i}`}>
                  <div className="aspect-[3/4] rounded-lg border bg-muted overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      Favorite {i + 1}
                    </div>
                  </div>
                </Link>
                <div className="mt-2 flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium group-hover:underline">Favorite Template {i + 1}</p>
                    <p className="text-xs text-muted-foreground">Category</p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Star className="h-4 w-4 fill-primary" />
                    <span className="sr-only">Unfavorite</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
