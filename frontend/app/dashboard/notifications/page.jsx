"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Trash2 } from 'lucide-react';

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
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!response.ok) throw new Error('Failed to fetch notifications');
      
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
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Failed to delete notification');

      setNotifications((prev) => prev.filter(n => n.notification_id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete: ' + err.message);
    }
  };

  const formatDate = (d) => {
    if (!d) return 'N/A';
    return new Date(d).toLocaleString();
  };

  const getNotificationTitle = (n) => {
    if (n.type === 'bill') return 'New Bill Generated';
    if (n.type === 'service') return 'Service Request Update';
    return 'Notification';
  };

  const getNotificationMessage = (n) => {
    if (n.type === "bill" && n.details) {
      const bill = n.details;
      const due = bill.due_date ? new Date(bill.due_date).toLocaleDateString() : "N/A";
      return `A new ${bill.bill_type || "utility"} bill of ₹${bill.amount || "0.00"} was generated. Due: ${due}. Status: ${bill.status || "N/A"}.`;
    }

    if (n.type === "service" && n.details) {
      const req = n.details;
      const comment = req.comment ? ` Comment: ${req.comment}` : "";
      return `Your request (${req.service_type || "N/A"}) is now: ${req.status || "N/A"}.${comment}`;
    }

    return "You have a new notification.";
  };

  const getBadgeVariant = (n) => {
    const status = n.details?.status?.toLowerCase();

    if (n.type === "bill") {
      if (status === "paid") return "default";
      if (status === "overdue") return "destructive";
      return "secondary";
    }
    if (n.type === "service") {
      if (status === "resolved") return "default";
      if (status === "rejected") return "destructive";
      return "secondary";
    }

    return "secondary";
  };

  /* ================================================================ */
  /* LOADING STATE (Consistent With Other Pages)                      */
  /* ================================================================ */
  if (loading) {
    return (
      <section className="w-full py-12 bg-background">
        <div className="container max-w-4xl px-4 mx-auto">
          <h1 className="text-4xl font-bold text-primary mb-8">Notifications</h1>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  /* ================================================================ */
  /* ERROR STATE                                                      */
  /* ================================================================ */
  if (error) {
    return (
      <section className="w-full py-12 bg-background">
        <div className="container max-w-4xl px-4 mx-auto">
          <h1 className="text-4xl font-bold text-primary mb-6">Notifications</h1>
          <Card className="bg-background">
            <CardContent className="p-6">
              <p className="text-red-500">{error}</p>
              <button
                onClick={fetchNotifications}
                className="mt-4 px-4 py-2 bg-acc-blue text-white rounded hover:bg-acc-blue/90"
              >
                Retry
              </button>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  /* ================================================================ */
  /* MAIN CONTENT                                                     */
  /* ================================================================ */
  return (
    <section className="w-full py-12 bg-background">
      <div className="container max-w-4xl px-4 mx-auto">

        {/* PAGE TITLE */}
        <h1 className="text-4xl font-bold text-primary mb-10">Notifications</h1>

        {/* EMPTY STATE */}
        {notifications.length === 0 ? (
          <Card className="bg-card shadow-md">
            <CardContent className="p-10 text-center">
              <p className="text-muted-foreground text-lg">
                🎉 You're all caught up! No notifications.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">

            {notifications.map((n) => (
              <Card
                key={n.notification_id}
                className="bg-background border shadow transition-all duration-200 
                           hover:shadow-lg hover:-translate-y-1 rounded-xl"
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl font-semibold text-primary">
                      {getNotificationTitle(n)}
                    </CardTitle>

                    <Badge variant={getBadgeVariant(n)} className="px-3 py-1">
                      {n.details?.status || "New"}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="relative">

                  <p className="text-muted-foreground leading-relaxed mb-3">
                    {getNotificationMessage(n)}
                  </p>

                  <p className="text-sm text-gray-500 italic">
                    {formatDate(n.created_at)}
                  </p>

                  {/* DELETE BUTTON */}
                  <button
                    onClick={() => deleteNotification(n.notification_id)}
                    className="absolute bottom-3 right-3 p-2 bg-red-50 text-red-500
                               rounded-full hover:bg-red-600 hover:text-white 
                               transition-all shadow-sm"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>

                </CardContent>
              </Card>
            ))}

          </div>
        )}

      </div>
    </section>
  );
}

/* --------------------------------------------------------------- */
/* CONSISTENT LOADING COMPONENT                                   */
/* --------------------------------------------------------------- */
function LoadingState() {
  return (
    <section className="w-full py-12 bg-background">
      <div className="container max-w-4xl px-4 mx-auto">
        <h1 className="text-4xl font-bold text-primary mb-8">Notifications</h1>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      </div>
    </section>
  );
}
