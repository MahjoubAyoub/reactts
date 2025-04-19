import { SelectItem } from "@/components/ui/select"
import { SelectContent } from "@/components/ui/select"
import { SelectValue } from "@/components/ui/select"
import { SelectTrigger } from "@/components/ui/select"
import { Select } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences.</p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="w-full border-b pb-0">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6 pt-4">
          <div className="flex flex-col gap-6 md:flex-row">
            <div className="flex-1 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" defaultValue="John Doe" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" defaultValue="john@example.com" type="email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  defaultValue="I'm a designer and developer based in New York."
                  className="min-h-[100px]"
                />
              </div>
            </div>

            <div className="flex flex-col items-center gap-4">
              <Avatar className="h-32 w-32">
                <AvatarImage src="/placeholder.svg" alt="User" />
                <AvatarFallback className="text-4xl">JD</AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm">
                Change Avatar
              </Button>
            </div>
          </div>

          <Separator />

          <div className="flex justify-end">
            <Button>Save Changes</Button>
          </div>
        </TabsContent>

        <TabsContent value="account" className="space-y-6 pt-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Change Password</h3>
              <p className="text-sm text-muted-foreground">Update your password to keep your account secure.</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input id="confirm-password" type="password" />
              </div>
            </div>

            <Button>Update Password</Button>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-destructive">Delete Account</h3>
              <p className="text-sm text-muted-foreground">Permanently delete your account and all of your content.</p>
            </div>

            <Button variant="destructive">Delete Account</Button>
          </div>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6 pt-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Subscription Plan</h3>
              <p className="text-sm text-muted-foreground">You are currently on the Free plan.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg border p-4">
                <div className="mb-4">
                  <h4 className="text-lg font-medium">Free</h4>
                  <p className="text-sm text-muted-foreground">Basic features for personal use</p>
                </div>
                <div className="mb-4">
                  <p className="text-3xl font-bold">$0</p>
                  <p className="text-sm text-muted-foreground">per month</p>
                </div>
                <ul className="mb-4 space-y-2 text-sm">
                  <li>5 designs</li>
                  <li>Basic templates</li>
                  <li>Limited exports</li>
                </ul>
                <Button variant="outline" className="w-full" disabled>
                  Current Plan
                </Button>
              </div>

              <div className="rounded-lg border p-4 shadow-md">
                <div className="mb-4">
                  <h4 className="text-lg font-medium">Pro</h4>
                  <p className="text-sm text-muted-foreground">Advanced features for professionals</p>
                </div>
                <div className="mb-4">
                  <p className="text-3xl font-bold">$12</p>
                  <p className="text-sm text-muted-foreground">per month</p>
                </div>
                <ul className="mb-4 space-y-2 text-sm">
                  <li>Unlimited designs</li>
                  <li>All templates</li>
                  <li>High-quality exports</li>
                  <li>Collaboration features</li>
                </ul>
                <Button className="w-full">Upgrade to Pro</Button>
              </div>

              <div className="rounded-lg border p-4">
                <div className="mb-4">
                  <h4 className="text-lg font-medium">Team</h4>
                  <p className="text-sm text-muted-foreground">For teams and organizations</p>
                </div>
                <div className="mb-4">
                  <p className="text-3xl font-bold">$49</p>
                  <p className="text-sm text-muted-foreground">per month</p>
                </div>
                <ul className="mb-4 space-y-2 text-sm">
                  <li>Everything in Pro</li>
                  <li>Team collaboration</li>
                  <li>Admin controls</li>
                  <li>Priority support</li>
                </ul>
                <Button variant="outline" className="w-full">
                  Contact Sales
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="team" className="space-y-6 pt-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Team Members</h3>
              <p className="text-sm text-muted-foreground">Invite team members to collaborate on your designs.</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Input placeholder="Email address" type="email" />
                <Button>Invite</Button>
              </div>

              <div className="rounded-md border">
                <div className="p-4">
                  <h4 className="font-medium">Current Team Members</h4>
                </div>
                <div className="divide-y">
                  {[
                    { name: "John Doe", email: "john@example.com", role: "Owner" },
                    { name: "Jane Smith", email: "jane@example.com", role: "Editor" },
                    { name: "Bob Johnson", email: "bob@example.com", role: "Viewer" },
                  ].map((member, i) => (
                    <div key={i} className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-muted-foreground">{member.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Select defaultValue={member.role.toLowerCase()}>
                          <SelectTrigger className="w-[110px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="owner">Owner</SelectItem>
                            <SelectItem value="editor">Editor</SelectItem>
                            <SelectItem value="viewer">Viewer</SelectItem>
                          </SelectContent>
                        </Select>
                        {member.role !== "Owner" && (
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                            <span className="sr-only">Remove</span>×
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
