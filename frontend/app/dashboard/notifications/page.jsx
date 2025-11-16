"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Trash2, X } from 'lucide-react';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/api/notifications', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }
      
      const data = await response.json();
      setNotifications(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteNotification = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/api/notifications/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete notification');
      }
      
      // Remove the notification from the state
      setNotifications(notifications.filter(notification => notification.notification_id !== id));
    } catch (err) {
      console.error('Error deleting notification:', err);
      alert('Failed to delete notification: ' + err.message);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getNotificationTitle = (notification) => {
    if (notification.type === 'bill') {
      return `New Bill Generated`;
    } else if (notification.type === 'service') {
      return `Service Request Update`;
    }
    return 'Notification';
  };

  const getNotificationMessage = (notification) => {
    if (notification.type === 'bill' && notification.details) {
      const bill = notification.details;
      const dueDate = bill.due_date ? new Date(bill.due_date).toLocaleDateString() : 'N/A';
      const status = bill.status || 'N/A';
      return `A new ${bill.bill_type || 'utility'} bill of ₹${bill.amount || '0.00'} has been generated for ${bill.address || 'your address'}. Due date: ${dueDate}. Status: ${status}`;
    } else if (notification.type === 'service' && notification.details) {
      const request = notification.details;
      const status = request.status || 'N/A';
      const comment = request.comment ? ` Comment: ${request.comment}` : '';
      return `Your service request (${request.service_type || 'N/A'}) status has been updated to: ${status}.${comment}`;
    }
    return 'You have a new notification';
  };

  const getBadgeVariant = (notification) => {
    if (notification.type === 'bill') {
      const status = notification.details?.status?.toLowerCase();
      if (status === 'paid') return 'default';
      if (status === 'overdue') return 'destructive';
      return 'secondary';
    } else if (notification.type === 'service') {
      const status = notification.details?.status?.toLowerCase();
      if (status === 'resolved') return 'default';
      if (status === 'rejected') return 'destructive';
      return 'secondary';
    }
    return 'secondary';
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Notifications</h1>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Notifications</h1>
        <Card>
          <CardContent className="p-6">
            <p className="text-red-500">Error: {error}</p>
            <button 
              onClick={fetchNotifications}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Retry
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
  <div className="container mx-auto py-10 max-w-4xl">
    {/* UPDATED HEADING COLOR */}
    <h1 className="text-4xl font-extrabold mb-10 tracking-tight text-primary">
      Notifications
    </h1>

    {notifications.length === 0 ? (
      <Card className="shadow-md">
        <CardContent className="p-10 text-center">
          <p className="text-gray-500 text-lg">🎉 You're all caught up! No notifications.</p>
        </CardContent>
      </Card>
    ) : (
      <div className="space-y-6">
        {notifications.map((notification) => (
          <Card
            key={notification.notification_id}
            className="relative transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1 border border-gray-200 rounded-xl"
          >
            <CardHeader className="pb-1">
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl font-semibold text-gray-800">
                  {getNotificationTitle(notification)}
                </CardTitle>

                <Badge
                  variant={getBadgeVariant(notification)}
                  className="text-sm py-1 px-3 rounded-full shadow-sm"
                >
                  {notification.type === 'bill' && notification.details?.status
                    ? notification.details.status
                    : notification.type === 'service' && notification.details?.status
                    ? notification.details.status
                    : 'New'}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="relative">
              <p className="text-gray-700 mb-4 leading-relaxed">
                {getNotificationMessage(notification)}
              </p>

              <p className="text-sm text-gray-500 italic">
                {formatDate(notification.created_at)}
              </p>

              {/* UPDATED DELETE BUTTON */}
              <button
                onClick={() => deleteNotification(notification.notification_id)}
                className="
                  absolute bottom-3 right-3 
                  p-2 rounded-full 
                  bg-red-50 text-red-500 
                  hover:bg-red-600 hover:text-white 
                  transition-all duration-200 
                  shadow-sm
                  hover:scale-110 active:scale-95
                "
                aria-label="Delete notification"
              >
                <Trash2 className="h-4 w-4" />
              </button>

            </CardContent>
          </Card>
        ))}
      </div>
    )}
  </div>
);


}