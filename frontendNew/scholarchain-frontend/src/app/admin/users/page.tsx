/* eslint-disable prettier/prettier */
"use client";

import { DashboardHeader } from "@/components/admin/dashboard-header";
import DashboardShell from "@/components/admin/dashboard-shell";
import { UserFilter } from "@/components/admin/user-filter";
import { UsersTable } from "@/components/admin/users-table";
import { User } from "@/lib/types";
import { getAllUsers } from "@/services/user.service";
import { useEffect, useState } from "react";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filterChecked, setFilterChecked] = useState<string>("all");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const _dashData = await getAllUsers();
        setUsers(_dashData);
        setFilteredUsers(_dashData);
      } catch (error) {
        console.error("Error while fetching admin dashboard:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const _filteredUsers =
      filterChecked == "all"
        ? users
        : users.filter((user) => user.role === filterChecked);
    setFilteredUsers(_filteredUsers);
  }, [filterChecked]);

  return (
    <DashboardShell>
      <DashboardHeader
        heading="User Management"
        text="Manage donors, borrowers, and administrators."
      />
      <div className="mb-4">
        <UserFilter
          filterChecked={filterChecked}
          setFilterChecked={setFilterChecked}
        />
      </div>
      <UsersTable filterChecked={filterChecked} users={filteredUsers} />
    </DashboardShell>
  );
}
