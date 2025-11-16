const prisma = require('../lib/prisma');

// Get notifications for the current user
async function getUserNotifications(req, res) {
  try {
    // Get user data from JWT token
    const tokenData = req.user;
    
    if (!tokenData || !tokenData.email) {
      return res.status(401).json({ error: "Not logged in" });
    }

    console.log(tokenData);
    
    // Fetch login info to get login_id
    const loginInfo = await prisma.login.findUnique({
      where: {
        email: tokenData.email,
      },
      select: {
        login_id: true,
        citizen_id: true,
        role: true
      }
    });
    
    if (!loginInfo) {
      return res.status(404).json({ error: "User not found" });
    }
    
    // Fetch notifications for this user
    const notifications = await prisma.notifications.findMany({
      where: {
        login_id: loginInfo.login_id
      },
      orderBy: {
        created_at: 'desc'
      },
      include: {
        citizen: {
          select: {
            full_name: true
          }
        }
      }
    });
    
    // Enhance notifications with detailed information based on type
    const enhancedNotifications = await Promise.all(notifications.map(async (notification) => {
      let details = {};
      
      try {
        if (notification.type === 'bill') {
          // Fetch bill details
          const bill = await prisma.bill.findUnique({
            where: {
              bill_id: notification.type_id
            },
            include: {
              utility: {
                select: {
                  type: true
                }
              },
              address: {
                select: {
                  flat_no: true,
                  building: {
                    select: {
                      building_name: true
                    }
                  }
                }
              }
            }
          });
          
          if (bill) {
            details = {
              bill_id: bill.bill_id,
              bill_type: bill.utility?.type || 'N/A',
              amount: bill.amount,
              due_date: bill.due_date,
              status: bill.status,
              address: `${bill.address?.building?.building_name || 'N/A'} - ${bill.address?.flat_no || 'N/A'}`
            };
          }
        } else if (notification.type === 'service') {
          // Fetch request details
          const request = await prisma.request.findUnique({
            where: {
              request_id: notification.type_id
            }
          });
          
          if (request) {
            details = {
              request_id: request.request_id,
              service_type: request.service_type,
              details: request.details,
              status: request.status,
              comment: request.comment,
              created_at: request.created_at,
              updated_at: request.updated_at
            };
          }
        }
      } catch (error) {
        console.error('Error fetching details for ' + notification.type + ' notification with type_id ' + notification.type_id + ':', error);
        // Continue with empty details if fetching fails
      }
      
      return {
        ...notification,
        details
      };
    }));
    
    res.status(200).json(enhancedNotifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
}

// Delete a notification
async function deleteNotification(req, res) {
  try {
    const { id } = req.params;
    const tokenData = req.user;
    
    if (!tokenData || !tokenData.email) {
      return res.status(401).json({ error: "Not logged in" });
    }
    
    // Fetch login info to get login_id
    const loginInfo = await prisma.login.findUnique({
      where: {
        email: tokenData.email,
      },
      select: {
        login_id: true
      }
    });
    
    if (!loginInfo) {
      return res.status(404).json({ error: "User not found" });
    }
    
    // Delete the notification only if it belongs to the user
    const deletedNotification = await prisma.notifications.delete({
      where: {
        notification_id: parseInt(id),
        login_id: loginInfo.login_id
      }
    });
    
    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.error("Error deleting notification:", error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: "Notification not found or you don't have permission to delete it" });
    }
    res.status(500).json({ error: "Failed to delete notification" });
  }
}

module.exports = {
  getUserNotifications,
  deleteNotification
};