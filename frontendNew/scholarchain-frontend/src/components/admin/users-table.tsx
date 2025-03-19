/* eslint-disable prettier/prettier */
"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Search,
  UserPlus,
} from "lucide-react";
import { getAllUsers } from "@/services/user.service";
import { User } from "@/lib/types";

export function UsersTable() {
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState<User[] | null>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const _dashData = await getAllUsers();
        setUsers(_dashData);
      } catch (error) {
        console.error("Error while fetching admin dashboard:", error);
      }
    };

    fetchData();
  }, []);

  // Sample user data

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Search className="text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search users..."
            className="h-9 w-[250px] md:w-[300px]"
          />
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              {/* <TableHead>Status</TableHead> */}
              {/* <TableHead className="hidden md:table-cell">Joined</TableHead> */}
              {/* <TableHead className="hidden md:table-cell">
                Last Active
              </TableHead> */}
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.map((user) => (
              <TableRow key={user._id}>
                <TableCell className="font-medium">{user._id}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      user.role === "admin"
                        ? "default"
                        : user.role === "donator"
                          ? "secondary"
                          : "outline"
                    }
                  >
                    {user.role}
                  </Badge>
                </TableCell>
                {/* <TableCell>
                  <Badge
                    variant={user.status === "Active" ? "success" : "secondary"}
                  >
                    {user.status}
                  </Badge>
                </TableCell> */}
                {/* <TableCell className="hidden md:table-cell">
                  {user..)}
                </TableCell> */}
                {/* <TableCell className="hidden md:table-cell">
                  {user.lastActive}
                </TableCell> */}
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
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage(page > 1 ? page - 1 : 1)}
          disabled={page === 1}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <Button variant="outline" size="sm" onClick={() => setPage(page + 1)}>
          Next
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
