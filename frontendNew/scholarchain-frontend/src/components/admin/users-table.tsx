"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronLeft, ChevronRight, MoreHorizontal, Search, UserPlus } from "lucide-react"

export function UsersTable() {
  const [page, setPage] = useState(1)

  // Sample user data
  const users = [
    {
      id: "USR001",
      name: "John Doe",
      email: "john.doe@example.com",
      role: "Donor",
      status: "Active",
      joined: "2022-01-15",
      lastActive: "2023-03-15",
    },
    {
      id: "USR002",
      name: "Sarah Johnson",
      email: "sarah.j@example.com",
      role: "Borrower",
      status: "Active",
      joined: "2022-02-20",
      lastActive: "2023-03-10",
    },
    {
      id: "USR003",
      name: "Michael Smith",
      email: "michael.s@example.com",
      role: "Borrower",
      status: "Active",
      joined: "2022-03-05",
      lastActive: "2023-03-12",
    },
    {
      id: "USR004",
      name: "Emily Davis",
      email: "emily.d@example.com",
      role: "Borrower",
      status: "Pending",
      joined: "2023-03-01",
      lastActive: "2023-03-01",
    },
    {
      id: "USR005",
      name: "Corporate Donor Inc.",
      email: "donations@corp.com",
      role: "Donor",
      status: "Active",
      joined: "2022-01-10",
      lastActive: "2023-03-14",
    },
    {
      id: "USR006",
      name: "Admin User",
      email: "admin@example.com",
      role: "Admin",
      status: "Active",
      joined: "2022-01-01",
      lastActive: "2023-03-15",
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search users..." className="h-9 w-[250px] md:w-[300px]" />
        </div>
        <Button size="sm" className="gap-1">
          <UserPlus className="h-4 w-4" />
          Add User
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Joined</TableHead>
              <TableHead className="hidden md:table-cell">Last Active</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant={user.role === "Admin" ? "default" : user.role === "Donor" ? "secondary" : "outline"}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={user.status === "Active" ? "success" : "secondary"}>{user.status}</Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">{user.joined}</TableCell>
                <TableCell className="hidden md:table-cell">{user.lastActive}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>View Profile</DropdownMenuItem>
                      <DropdownMenuItem>Edit User</DropdownMenuItem>
                      <DropdownMenuItem>Reset Password</DropdownMenuItem>
                      <DropdownMenuItem>Deactivate User</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2">
        <Button variant="outline" size="sm" onClick={() => setPage(page > 1 ? page - 1 : 1)} disabled={page === 1}>
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <Button variant="outline" size="sm" onClick={() => setPage(page + 1)}>
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  )
}

