"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/SkeletonLoader';

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
      const response = await fetch('/api/notifications', {
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
      return `A new ${bill.bill_type} bill of ₹${bill.amount} has been generated for ${bill.address}. Due date: ${bill.due_date ? new Date(bill.due_date).toLocaleDateString() : 'N/A'}. Status: ${bill.status || 'N/A'}`;
    } else if (notification.type === 'service' && notification.details) {
      const request = notification.details;
      return `Your service request (${request.service_type}) status has been updated to: ${request.status}. ${request.comment ? `Comment: ${request.comment}` : ''}`;
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
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Notifications</h1>
      
      {notifications.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-500">No notifications yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <Card key={notification.notification_id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">
                    {getNotificationTitle(notification)}
                  </CardTitle>
                  <Badge variant={getBadgeVariant(notification)}>
                    {notification.type === 'bill' ? notification.details?.status || 'N/A' : 
                     notification.type === 'service' ? notification.details?.status || 'N/A' : 
                     'New'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-2">{getNotificationMessage(notification)}</p>
                <p className="text-sm text-gray-500">
                  {formatDate(notification.created_at)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}