

import { useState, useEffect } from "react"
import toast from "react-hot-toast"
import { contactAPI } from "../../services/api"

const ContactMessages = ({ onMessagesUpdate }) => {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    try {
      const response = await contactAPI.getAll()
      setMessages(response.data)
      if (onMessagesUpdate) {
        onMessagesUpdate()
      }
    } catch (error) {
      toast.error("Failed to fetch messages")
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (id) => {
    try {
      await contactAPI.markAsRead(id)
      await fetchMessages()
      toast.success("Message marked as read")
    } catch (error) {
      toast.error("Failed to mark message as read")
    }
  }

  const deleteMessage = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return

    try {
      await contactAPI.delete(id)
      await fetchMessages()
      toast.success("Message deleted successfully")
    } catch (error) {
      toast.error("Failed to delete message")
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-300 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border rounded-lg p-4">
                <div className="h-4 bg-gray-300 rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Contact Messages</h2>

      {messages.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No messages found.</div>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message._id}
              className={`border rounded-lg p-4 ${message.read ? "bg-gray-50" : "bg-blue-50 border-blue-200"}`}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {message.name}
                    {!message.read && (
                      <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        New
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-gray-600">{message.email}</p>
                  <p className="text-sm text-gray-500">{formatDate(message.createdAt)}</p>
                </div>
                <div className="flex space-x-2">
                  {!message.read && (
                    <button
                      onClick={() => markAsRead(message._id)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Mark as Read
                    </button>
                  )}
                  <button
                    onClick={() => deleteMessage(message._id)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="mb-3">
                <h4 className="font-medium text-gray-900 mb-1">Subject:</h4>
                <p className="text-gray-700">{message.subject}</p>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-1">Message:</h4>
                <p className="text-gray-700 whitespace-pre-wrap">{message.message}</p>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-200">
                <a
                  href={`mailto:${message.email}?subject=Re: ${message.subject}`}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Reply via Email
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ContactMessages
