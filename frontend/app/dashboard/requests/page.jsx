"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Plus, Edit, Trash2, Search, AlertCircle, ArrowLeft, User, Calendar } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";

export default function RequestsPage() {
  const { user, loading } = useUser();
  const router = useRouter();
  
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [formData, setFormData] = useState({
    service_type: "",
    details: "",
    status: "PENDING",
    comment: ""
  });
  // New state for utility types
  const [utilityTypes, setUtilityTypes] = useState([]);
  const [utilitiesLoading, setUtilitiesLoading] = useState(true);
  const [utilitiesError, setUtilitiesError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("ALL");
  
  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  // Fetch utility types when component mounts
  useEffect(() => {
    fetchUtilityTypes();
  }, []);

  useEffect(() => {
    if (user) fetchRequests();
  }, [user]);

  useEffect(() => {
    const filtered = searchTerm || statusFilter !== "ALL"
      ? requests.filter(request => {
          const matchesSearch = !searchTerm || 
            request.service_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            request.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            request.citizen_id?.toString().includes(searchTerm);
            
          const matchesStatus = statusFilter === "ALL" || request.status === statusFilter;
          
          return matchesSearch && matchesStatus;
        })
      : requests;
    setFilteredRequests(filtered);
  }, [searchTerm, requests, statusFilter]);

  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      let url = "http://localhost:8000/api/requests";
      
      // If user is a citizen, only fetch their requests
      if (user?.role === "CITIZEN") {
        url += `/citizen/${user.citizen_id}`;
      }
      
      const response = await fetch(url, { 
        method: "GET", 
        credentials: "include" 
      });
      if (!response.ok) throw new Error("Failed to fetch requests");
      const data = await response.json();
      setRequests(data);
      setFilteredRequests(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch utility types from backend
  const fetchUtilityTypes = async () => {
    try {
      setUtilitiesLoading(true);
      setUtilitiesError(null);
      
      const response = await fetch("http://localhost:8000/api/utilities/types", {
        method: "GET",
        credentials: "include"
      });
      
      if (!response.ok) throw new Error("Failed to fetch utility types");
      
      const data = await response.json();
      setUtilityTypes(data);
    } catch (err) {
      console.error('Error fetching utility types:', err);
      setUtilitiesError("Failed to load service types");
      setUtilityTypes([]);
    } finally {
      setUtilitiesLoading(false);
    }
  };

  const handleCreateRequest = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          citizen_id: user?.citizen_id, // Use citizen ID from user context
          service_type: formData.service_type,
          details: formData.details,
          comment: formData.comment,
          status: "PENDING" // Default to PENDING for new requests
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Failed to create request" }));
        throw new Error(errorData.error || "Failed to create request");
      }
      
      const result = await response.json();
      await fetchRequests();
      setIsCreateDialogOpen(false);
      resetForm();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handleUpdateRequest = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8000/api/requests/${selectedRequest.request_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          status: formData.status,
          comment: formData.comment
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Failed to update request" }));
        throw new Error(errorData.error || `Failed to update request: ${response.status} ${response.statusText}`);
      }
      
      await fetchRequests();
      setIsEditDialogOpen(false);
      resetForm();
    } catch (err) {
      console.error("Update request error:", err);
      alert("Error: " + err.message);
    }
  };

  const handleDeleteRequest = async (requestId) => {
    if (!confirm("Delete this request?")) return;
    try {
      const response = await fetch(`http://localhost:8000/api/requests/${requestId}`, {
        method: "DELETE",
        credentials: "include"
      });
      if (!response.ok) throw new Error("Failed to delete request");
      await fetchRequests();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const openEditDialog = (request) => {
    setSelectedRequest(request);
    setFormData({
      service_type: request.service_type,
      details: request.details,
      status: request.status,
      comment: request.comment || ""
    });
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({ service_type: "", details: "", status: "PENDING", comment: "" });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "APPROVED": return "bg-blue-100 text-blue-800";
      case "PENDING": return "bg-yellow-100 text-yellow-800";
      case "RESOLVED": return "bg-green-100 text-green-800";
      case "REJECTED": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const calculateStats = () => {
    const total = filteredRequests.length;
    const pending = filteredRequests.filter(r => r.status === "PENDING").length;
    const approved = filteredRequests.filter(r => r.status === "APPROVED").length;
    const resolved = filteredRequests.filter(r => r.status === "RESOLVED").length;
    return { total, pending, approved, resolved };
  };

  const stats = calculateStats();

  if (loading || isLoading) {
    return (
      <main className="flex flex-col items-center min-h-screen w-full">
        <section className="w-full py-12 md:py-16 bg-background">
          <div className="container px-4 md:px-6 mx-auto max-w-6xl">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div>
              <div className="flex-1">
                <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
              </div>
              {user?.role === "CITIZEN" && (
                <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="border-t-4 border-t-gray-200">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-6 w-6 bg-gray-200 rounded animate-pulse"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-6 w-8 bg-gray-200 rounded animate-pulse"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        <section className="w-full py-12 bg-muted-background">
          <div className="container px-4 md:px-6 mx-auto max-w-6xl">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-9 w-48 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <Card key={i} className="h-48 bg-gray-200 rounded animate-pulse"></Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    );
  }
  if (!user) return null;

  return (
    <main className="flex flex-col items-center min-h-screen w-full">
      <section className="w-full py-12 md:py-16 bg-background">
        <div className="container px-4 md:px-6 mx-auto max-w-6xl">
          <Button variant="outline" onClick={() => router.back()} className="flex items-center gap-2 mb-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          <div className="flex items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-primary mb-2">
                {user?.role === "CITIZEN" ? "My Requests" : "Requests Management"}
              </h1>
              <p className="text-muted-foreground">
                {user?.role === "CITIZEN" 
                  ? "View and submit service requests" 
                  : "View and manage service requests"}
              </p>
              <div className="w-24 h-1 bg-acc-blue mt-4 mb-6 rounded-full"></div>
            </div>
            {user?.role === "CITIZEN" && (
              <Button 
                className="bg-acc-blue hover:bg-acc-blue/90"
                onClick={() => setIsCreateDialogOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                New Request
              </Button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <Card className="border-t-4 border-t-acc-blue">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
                <FileText className="h-6 w-6 text-acc-blue" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
              </CardContent>
            </Card>
            <Card className="border-t-4 border-t-yellow-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <AlertCircle className="h-6 w-6 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pending}</div>
              </CardContent>
            </Card>
            {user?.role === "CITIZEN" ? (
              <>
                <Card className="border-t-4 border-t-blue-500">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Approved</CardTitle>
                    <User className="h-6 w-6 text-blue-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.approved}</div>
                  </CardContent>
                </Card>
                <Card className="border-t-4 border-t-green-500">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Resolved</CardTitle>
                    <Calendar className="h-6 w-6 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.resolved}</div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <>
                <Card className="border-t-4 border-t-blue-500">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Approved</CardTitle>
                    <User className="h-6 w-6 text-blue-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.approved}</div>
                  </CardContent>
                </Card>
                <Card className="border-t-4 border-t-red-500">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Rejected</CardTitle>
                    <Trash2 className="h-6 w-6 text-red-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {filteredRequests.filter(r => r.status === "REJECTED").length}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="w-full py-12 bg-muted-background">
        <div className="container px-4 md:px-6 mx-auto max-w-6xl">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <CardTitle>
                    {user?.role === "CITIZEN" ? "My Requests" : "All Requests"}
                  </CardTitle>
                  <CardDescription>
                    {user?.role === "CITIZEN" 
                      ? "List of your service requests" 
                      : "List of all service requests in the system"}
                  </CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search Requests..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="max-w-sm bg-background"
                    />
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs"
                    >
                      <option value="ALL">All Statuses</option>
                      <option value="PENDING">Pending</option>
                      <option value="APPROVED">Approved</option>
                      <option value="RESOLVED">Resolved</option>
                      {user?.role === "ADMIN" && <option value="REJECTED">Rejected</option>}
                    </select>
                    {(searchTerm || statusFilter !== "ALL") && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => {
                          setSearchTerm("");
                          setStatusFilter("ALL");
                        }}
                      >
                        Clear
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {error ? (
                <div className="text-center py-8 text-red-500">Error: {error}</div>
              ) : filteredRequests.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">No requests found</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {searchTerm || statusFilter !== "ALL" 
                      ? "No requests match your current filters." 
                      : user?.role === "CITIZEN"
                        ? "You haven't submitted any requests yet."
                        : "There are no requests in the system."}
                  </p>
                  {user?.role === "CITIZEN" && !searchTerm && statusFilter === "ALL" && (
                    <div className="mt-6">
                      <Button onClick={() => setIsCreateDialogOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Request
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                // Unified card layout for both citizen and admin
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredRequests.map((request) => (
                    <Card 
                      key={request.request_id} 
                      className="hover:shadow-md transition-shadow bg-white"
                    >
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">Request #{request.request_id}</CardTitle>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            request.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                            request.status === 'APPROVED' ? 'bg-blue-100 text-blue-800' :
                            request.status === 'RESOLVED' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {request.status}
                          </span>
                        </div>
                        <CardDescription className="text-sm mt-1">
                          {user?.role === "CITIZEN" 
                            ? request.service_type 
                            : `Citizen ID: ${request.citizen_id}`}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Service</p>
                            <p className="text-sm font-medium">{request.service_type}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Details</p>
                            <p className="text-sm">{request.details || "No details provided"}</p>
                          </div>
                          {request.comment && (
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">
                                {user?.role === "CITIZEN" ? "Your Comment" : "Comment"}
                              </p>
                              <p className="text-sm">{request.comment}</p>
                            </div>
                          )}
                          {user?.role === "CITIZEN" && request.status === "REJECTED" && request.comment && (
                            <div className="border-l-2 border-red-500 pl-2">
                              <p className="text-sm font-medium text-red-500">Admin Comment</p>
                              <p className="text-sm">{request.comment}</p>
                            </div>
                          )}
                          <div className="flex justify-between items-center pt-2">
                            <div className="text-xs text-muted-foreground">
                              {request.created_at ? new Date(request.created_at).toLocaleDateString() : 'N/A'}
                            </div>
                            {user?.role === "ADMIN" ? (
                              <Button variant="outline" size="sm" onClick={() => openEditDialog(request)}>
                                Update
                              </Button>
                            ) : request.status === "RESOLVED" ? (
                              <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                Completed
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {user?.role === "CITIZEN" && (
        <Dialog open={isCreateDialogOpen} onOpenChange={(open) => {
          setIsCreateDialogOpen(open);
          if (open) resetForm();
        }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Request</DialogTitle>
              <DialogDescription>Submit a new service request</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateRequest}>
              <div className="grid gap-4 py-4">
                <div>
                  <Label htmlFor="service_type">Service Type</Label>
                  {utilitiesLoading ? (
                    <Input 
                      id="service_type" 
                      value="Loading services..." 
                      disabled 
                    />
                  ) : utilitiesError || utilityTypes.length === 0 ? (
                    <Input 
                      id="service_type" 
                      value="No available services" 
                      disabled 
                    />
                  ) : (
                    <select
                      id="service_type"
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs"
                      value={formData.service_type || ""}
                      onChange={(e) => setFormData({...formData, service_type: e.target.value})}
                      required
                    >
                      <option value="">Select a service type</option>
                      {utilityTypes.map((type, index) => (
                        <option key={index} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
                <div>
                  <Label htmlFor="details">Details</Label>
                  <Textarea
                    id="details"
                    value={formData.details || ""}
                    onChange={(e) => setFormData({...formData, details: e.target.value})}
                    placeholder="Enter request details"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="comment">Comment (Optional)</Label>
                  <Textarea
                    id="comment"
                    value={formData.comment || ""}
                    onChange={(e) => setFormData({...formData, comment: e.target.value})}
                    placeholder="Add any additional comments"
                  />
                </div>
                {/* Hidden citizen_id field, populated from user context */}
                <input type="hidden" value={user?.citizen_id || ""} />
              </div>
              <DialogFooter>
                <Button type="submit">Submit Request</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {user?.role === "ADMIN" && (
        <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
          setIsEditDialogOpen(open);
          if (!open) {
            resetForm();
            setSelectedRequest(null);
          }
        }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Request</DialogTitle>
              <DialogDescription>Update request status</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpdateRequest}>
              <div className="grid gap-4 py-4">
                <div>
                  <Label>Citizen ID</Label>
                  <Input value={selectedRequest?.citizen_id || ""} disabled />
                </div>
                <div>
                  <Label>Service Type</Label>
                  <Input value={selectedRequest?.service_type || ""} disabled />
                </div>
                <div>
                  <Label>Details</Label>
                  <Textarea
                    value={selectedRequest?.details || ""}
                    disabled
                  />
                </div>
                <div>
                  <Label htmlFor="edit_status">Status</Label>
                  <select id="edit_status" className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs" value={formData.status || "PENDING"} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                    <option value="PENDING">Pending</option>
                    <option value="APPROVED">Approved</option>
                    <option value="RESOLVED">Resolved</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="edit_comment">Comment</Label>
                  <Textarea
                    id="edit_comment"
                    value={formData.comment || ""}
                    onChange={(e) => setFormData({...formData, comment: e.target.value})}
                    placeholder="Add a comment for the citizen"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Update Request</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </main>
  );
}