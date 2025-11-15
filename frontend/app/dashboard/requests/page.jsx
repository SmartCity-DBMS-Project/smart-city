"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
    citizen_id: "",
    service_type: "",
    details: "",
    status: "PENDING"
  });

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  useEffect(() => {
    if (user) fetchRequests();
  }, [user]);

  useEffect(() => {
    const filtered = searchTerm
      ? requests.filter(request => 
          request.service_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.citizen_id?.toString().includes(searchTerm)
        )
      : requests;
    setFilteredRequests(filtered);
  }, [searchTerm, requests]);

  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:8000/api/requests", { 
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

  const handleCreateRequest = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          citizen_id: parseInt(formData.citizen_id),
          service_type: formData.service_type,
          details: formData.details,
          status: formData.status
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
      alert("Error creating request: " + err.message);
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
          citizen_id: parseInt(formData.citizen_id),
          service_type: formData.service_type,
          details: formData.details,
          status: formData.status
        }),
      });
      if (!response.ok) throw new Error("Failed to update request");
      await fetchRequests();
      setIsEditDialogOpen(false);
      resetForm();
    } catch (err) {
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
      citizen_id: request.citizen_id.toString(),
      service_type: request.service_type,
      details: request.details,
      status: request.status
    });
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({ citizen_id: "", service_type: "", details: "", status: "PENDING" });
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

  if (loading || isLoading) return <div className="flex items-center justify-center min-h-screen"><p>Loading...</p></div>;
  if (!user) return null;

  return (
    <main className="flex flex-col items-center min-h-screen w-full">
      <section className="w-full py-12 md:py-16 bg-background">
        <div className="container px-4 md:px-6 mx-auto max-w-6xl">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="outline" onClick={() => router.back()} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-primary mb-2">Requests Management</h1>
              <p className="text-muted-foreground">View and manage service requests</p>
            </div>
            {user?.role === "ADMIN" && (
              <Dialog open={isCreateDialogOpen} onOpenChange={(open) => {
                setIsCreateDialogOpen(open);
                if (open) resetForm();
              }}>
                <DialogTrigger asChild>
                  <Button className="bg-acc-blue hover:bg-acc-blue/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Request
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Request</DialogTitle>
                    <DialogDescription>Add a new service request to the system</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreateRequest}>
                    <div className="grid gap-4 py-4">
                      <div>
                        <Label htmlFor="citizen_id">Citizen ID</Label>
                        <Input id="citizen_id" type="number" value={formData.citizen_id || ""} onChange={(e) => setFormData({...formData, citizen_id: e.target.value})} required />
                      </div>
                      <div>
                        <Label htmlFor="service_type">Service Type</Label>
                        <Input id="service_type" value={formData.service_type || ""} onChange={(e) => setFormData({...formData, service_type: e.target.value})} placeholder="e.g., Water, Electricity, Waste Management" required />
                      </div>
                      <div>
                        <Label htmlFor="details">Details</Label>
                        <textarea
                          id="details"
                          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                          value={formData.details || ""}
                          onChange={(e) => setFormData({...formData, details: e.target.value})}
                          placeholder="Enter request details"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="status">Status</Label>
                        <select id="status" className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs" value={formData.status || "PENDING"} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                          <option value="PENDING">Pending</option>
                          <option value="APPROVED">Approved</option>
                          <option value="RESOLVED">Resolved</option>
                          <option value="REJECTED">Rejected</option>
                        </select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Create Request</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
          </div>
        </div>
      </section>

      <section className="w-full py-12 bg-card">
        <div className="container px-4 md:px-6 mx-auto max-w-6xl">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>All Requests</CardTitle>
                  <CardDescription>List of all service requests in the system</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search Requests..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm bg-background"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {error ? (
                <div className="text-center py-8 text-red-500">Error: {error}</div>
              ) : filteredRequests.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No requests found</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Request ID</TableHead>
                      <TableHead>Citizen ID</TableHead>
                      <TableHead>Service Type</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead>Status</TableHead>
                      {user?.role === "ADMIN" && <TableHead>Actions</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRequests.map((request) => (
                      <TableRow key={request.request_id}>
                        <TableCell className="font-medium">{request.request_id}</TableCell>
                        <TableCell>{request.citizen_id}</TableCell>
                        <TableCell>{request.service_type}</TableCell>
                        <TableCell className="max-w-xs truncate">{request.details}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(request.status)}`}>
                            {request.status}
                          </span>
                        </TableCell>
                        {user?.role === "ADMIN" && (
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="outline" size="icon-sm" onClick={() => openEditDialog(request)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="destructive" size="icon-sm" onClick={() => handleDeleteRequest(request.request_id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

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
              <DialogDescription>Update request information</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpdateRequest}>
              <div className="grid gap-4 py-4">
                <div>
                  <Label htmlFor="edit_citizen_id">Citizen ID</Label>
                  <Input id="edit_citizen_id" type="number" value={formData.citizen_id || ""} onChange={(e) => setFormData({...formData, citizen_id: e.target.value})} required />
                </div>
                <div>
                  <Label htmlFor="edit_service_type">Service Type</Label>
                  <Input id="edit_service_type" value={formData.service_type || ""} onChange={(e) => setFormData({...formData, service_type: e.target.value})} required />
                </div>
                <div>
                  <Label htmlFor="edit_details">Details</Label>
                  <textarea
                    id="edit_details"
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    value={formData.details || ""}
                    onChange={(e) => setFormData({...formData, details: e.target.value})}
                    required
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