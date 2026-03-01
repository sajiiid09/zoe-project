"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { MagnifyingGlass, Trash } from "@phosphor-icons/react"

const mockUsers = [
  { id: 1, name: "John Doe", email: "john@example.com", joinDate: "2024-01-15", status: "Active" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", joinDate: "2024-02-20", status: "Active" },
  { id: 3, name: "Bob Johnson", email: "bob@example.com", joinDate: "2024-03-10", status: "Inactive" },
  { id: 4, name: "Alice Williams", email: "alice@example.com", joinDate: "2024-01-25", status: "Active" },
]

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [users, setUsers] = useState(mockUsers)

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const deleteUser = (id: number) => {
    setUsers(users.filter((u) => u.id !== id))
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#3D5A3E]">Users Management</h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg p-6 shadow-sm border border-[#E8E3DA]"
      >
        <div className="mb-6 flex items-center gap-2 bg-[#F5F2ED] px-4 py-2 rounded-lg">
          <MagnifyingGlass size={20} weight="bold" className="text-[#6B7C5E]" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent outline-none text-[#3D5A3E] flex-1"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E8E3DA]">
                <th className="text-left py-3 px-4 font-semibold text-[#3D5A3E]">Name</th>
                <th className="text-left py-3 px-4 font-semibold text-[#3D5A3E]">Email</th>
                <th className="text-left py-3 px-4 font-semibold text-[#3D5A3E]">Join Date</th>
                <th className="text-left py-3 px-4 font-semibold text-[#3D5A3E]">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-[#3D5A3E]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-[#E8E3DA] hover:bg-[#F5F2ED] transition"
                >
                  <td className="py-3 px-4 font-semibold text-[#3D5A3E]">{user.name}</td>
                  <td className="py-3 px-4 text-[#6B7C5E]">{user.email}</td>
                  <td className="py-3 px-4 text-[#3D5A3E]">{user.joinDate}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => deleteUser(user.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded transition"
                    >
                      <Trash size={18} weight="bold" />
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}
