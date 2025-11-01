"use client"

import { useState, useEffect } from "react"
import AdminLayout from "../components/admin/AdminLayout"
import ContactMessages from "../components/admin/ContactMessages"
import { contactAPI } from "../services/api"

const AdminMessages = () => {
  const [unreadCount, setUnreadCount] = useState(0)

  const fetchUnreadCount = async () => {
    try {
      const response = await contactAPI.getAll()
      const unread = response.data.filter((msg) => !msg.read).length
      setUnreadCount(unread)
    } catch (error) {
      console.error("Failed to fetch unread count:", error)
    }
  }

  useEffect(() => {
    fetchUnreadCount()
  }, [])

  const handleMessagesUpdate = () => {
    fetchUnreadCount()
  }

  return (
    <AdminLayout unreadMessages={unreadCount}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          <p className="mt-2 text-gray-600">View and manage contact form submissions</p>
        </div>
        <ContactMessages onMessagesUpdate={handleMessagesUpdate} />
      </div>
    </AdminLayout>
  )
}

export default AdminMessages
