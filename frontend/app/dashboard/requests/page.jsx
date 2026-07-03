"use client";
import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Plus, Trash2, Search, AlertCircle, ArrowLeft, User, Calendar, Loader2, Download, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

/* ------------------------------------------------------------------ */
/* CSV EXPORT                                                           */
/* ------------------------------------------------------------------ */
function exportToCSV(rows, filename) {
  if (!rows || rows.length === 0) { toast.error("No data to export."); return; }
  const headers = ["Request ID", "Citizen ID", "Service Type", "Status", "Details", "Comment", "Created At"];
  const csvRows = rows.map((r) => [
    r.request_id, r.citizen_id, r.service_type ?? "", r.status ?? "",
    (r.details ?? "").replace(/\n/g, " "),
    (r.comment ?? "").replace(/\n/g, " "),
    r.created_at ? new Date(r.created_at).toLocaleDateString() : "N/A",
  ]);
  const content = [headers, ...csvRows]
    .map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
    .join("\n");
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
  toast.success(`Exported ${rows.length} request(s) to ${filename}`);
}

/* ------------------------------------------------------------------ */
/* SORT HEADER                                                          */
/* ------------------------------------------------------------------ */
function SortableHeader({ label, sortKey, currentSort, onSort }) {
  const isActive = currentSort.key === sortKey;
  return (
    <button className="flex items-center gap-1 font-medium hover:text-primary transition-colors" onClick={() => onSort(sortKey)}>
      {label}
      {isActive ? (
        currentSort.dir === "asc" ? <ArrowUp className="h-3.5 w-3.5 text-acc-blue" /> : <ArrowDown className="h-3.5 w-3.5 text-acc-blue" />
      ) : <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground/50" />}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* STATUS BADGE                                                         */
/* ------------------------------------------------------------------ */
function StatusBadge({ status }) {
  const colors = {
    PENDING: "bg-yellow-100 text-yellow-800",
    APPROVED: "bg-blue-100 text-blue-800",
    RESOLVED: "bg-green-100 text-green-800",
    REJECTED: "bg-red-100 text-red-800",
  };
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status] ?? "bg-gray-100 text-gray-800"}`}>
      {status}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* MAIN PAGE                                                            */
/* ------------------------------------------------------------------ */
export default function RequestsPage() {
  const { user, loading } = useUser();
  const router = useRouter();

  const [requests, setRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [formData, setFormData] = useState({ service_type: "", details: "", status: "PENDING", comment: "" });
  const [utilityTypes, setUtilityTypes] = useState([]);
  const [utilitiesLoading, setUtilitiesLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [sort, setSort] = useState({ key: "request_id", dir: "desc" });

  useEffect(() => { if (!loading && !user) router.push("/login"); }, [user, loading, router]);
  useEffect(() => { fetchUtilityTypes(); }, []);
  useEffect(() => { if (user) fetchRequests(); }, [user]);

  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      const url = user?.role === "CITIZEN"
        ? `http://localhost:8000/api/requests/citizen/${user.citizen_id}`
        : "http://localhost:8000/api/requests";
      const response = await fetch(url, { method: "GET", credentials: "include" });
      if (!response.ok) throw new Error("Failed to fetch requests");
      setRequests(await response.json());
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load requests: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUtilityTypes = async () => {
    try {
      setUtilitiesLoading(true);
      const response = await fetch("http://localhost:8000/api/utilities/types", { credentials: "include" });
      if (!response.ok) throw new Error("Failed to fetch utility types");
      setUtilityTypes(await response.json());
    } catch { setUtilityTypes([]); }
    finally { setUtilitiesLoading(false); }
  };

  /* ---- Filtering & Sorting ---- */
  const filteredAndSorted = useMemo(() => {
    const filtered = requests.filter((r) => {
      const matchesSearch = !searchTerm ||
        r.service_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.citizen_id?.toString().includes(searchTerm);
      const matchesStatus = statusFilter === "ALL" || r.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
    return [...filtered].sort((a, b) => {
      let aVal = a[sort.key], bVal = b[sort.key];
      if (sort.key === "request_id" || sort.key === "citizen_id") { aVal = Number(aVal ?? 0); bVal = Number(bVal ?? 0); }
      else if (sort.key === "created_at") { aVal = new Date(aVal).getTime(); bVal = new Date(bVal).getTime(); }
      else { aVal = String(aVal ?? "").toLowerCase(); bVal = String(bVal ?? "").toLowerCase(); }
      if (aVal < bVal) return sort.dir === "asc" ? -1 : 1;
      if (aVal > bVal) return sort.dir === "asc" ? 1 : -1;
      return 0;
    });
  }, [requests, searchTerm, statusFilter, sort]);

  const handleSort = (key) =>
    setSort((prev) => prev.key === key ? { key, dir: prev.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" });

  /* ---- Stats ---- */
  const stats = useMemo(() => ({
    total: filteredAndSorted.length,
    pending: filteredAndSorted.filter((r) => r.status === "PENDING").length,
    approved: filteredAndSorted.filter((r) => r.status === "APPROVED").length,
    resolved: filteredAndSorted.filter((r) => r.status === "RESOLVED").length,
    rejected: filteredAndSorted.filter((r) => r.status === "REJECTED").length,
  }), [filteredAndSorted]);

  /* ---- Form Actions ---- */
  const handleCreateRequest = async (e) => {
    e.preventDefault();
    if (!formData.service_type) { toast.error("Service type is required"); return; }
    if (!formData.details?.trim()) { toast.error("Details are required"); return; }
    setIsCreating(true);
    try {
      const response = await fetch("http://localhost:8000/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ citizen_id: user?.citizen_id, service_type: formData.service_type, details: formData.details, comment: formData.comment, status: "PENDING" }),
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({ error: "Failed to create request" }));
        throw new Error(err.error || "Failed to create request");
      }
      await fetchRequests();
      setIsCreateDialogOpen(false);
      resetForm();
      toast.success("Request submitted successfully!");
    } catch (err) { toast.error("Failed to create request: " + err.message); }
    finally { setIsCreating(false); }
  };

  const handleUpdateRequest = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const response = await fetch(`http://localhost:8000/api/requests/${selectedRequest.request_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: formData.status, comment: formData.comment }),
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({ error: "Failed to update request" }));
        throw new Error(err.error || "Failed to update request");
      }
      await fetchRequests();
      setIsEditDialogOpen(false);
      resetForm();
      toast.success("Request updated successfully!");
    } catch (err) { toast.error("Failed to update request: " + err.message); }
    finally { setIsUpdating(false); }
  };

  const handleDeleteRequest = async (requestId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/requests/${requestId}`, { method: "DELETE", credentials: "include" });
      if (!response.ok) throw new Error("Failed to delete request");
      await fetchRequests();
      toast.success("Request deleted.");
    } catch (err) { toast.error("Failed to delete request: " + err.message); }
  };

  const openEditDialog = (request) => {
    setSelectedRequest(request);
    setFormData({ service_type: request.service_type, details: request.details, status: request.status, comment: request.comment || "" });
    setIsEditDialogOpen(true);
  };

  const resetForm = () => setFormData({ service_type: "", details: "", status: "PENDING", comment: "" });

  /* ---- Loading ---- */
  if (loading || isLoading) return (
    <main className="flex flex-col items-center min-h-screen w-full">
      <section className="w-full py-12 bg-muted-background flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-acc-blue border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading requests...</p>
        </div>
      </section>
    </main>
  );
  if (!user) return null;

  return (
    <main className="flex flex-col items-center min-h-screen w-full">
      {/* ── HEADER ── */}
      <section className="w-full py-12 md:py-16 bg-background">
        <div className="container px-4 md:px-6 mx-auto max-w-6xl">
          <Button variant="outline" onClick={() => router.back()} className="flex items-center gap-2 mb-4">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>

          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-primary mb-2">
                {user?.role === "CITIZEN" ? "My Requests" : "Requests Management"}
              </h1>
              <p className="text-muted-foreground">
                {user?.role === "CITIZEN" ? "View and submit service requests" : "View and manage all service requests"}
              </p>
              <div className="w-24 h-1 bg-acc-blue mt-4 mb-6 rounded-full" />
            </div>
            {user?.role === "CITIZEN" && (
              <Button className="bg-acc-blue hover:bg-acc-blue/90" onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" /> New Request
              </Button>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <Card className="border-t-4 border-t-acc-blue">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total</CardTitle>
                <FileText className="h-6 w-6 text-acc-blue" />
              </CardHeader>
              <CardContent><div className="text-2xl font-bold">{stats.total}</div></CardContent>
            </Card>
            <Card className="border-t-4 border-t-yellow-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <AlertCircle className="h-6 w-6 text-yellow-500" />
              </CardHeader>
              <CardContent><div className="text-2xl font-bold">{stats.pending}</div></CardContent>
            </Card>
            <Card className="border-t-4 border-t-blue-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Approved</CardTitle>
                <User className="h-6 w-6 text-blue-500" />
              </CardHeader>
              <CardContent><div className="text-2xl font-bold">{stats.approved}</div></CardContent>
            </Card>
            <Card className={`border-t-4 ${user?.role === "CITIZEN" ? "border-t-green-500" : "border-t-red-500"}`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{user?.role === "CITIZEN" ? "Resolved" : "Rejected"}</CardTitle>
                <Calendar className={`h-6 w-6 ${user?.role === "CITIZEN" ? "text-green-500" : "text-red-500"}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{user?.role === "CITIZEN" ? stats.resolved : stats.rejected}</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ── TABLE / CARDS ── */}
      <section className="w-full py-12 bg-muted-background">
        <div className="container px-4 md:px-6 mx-auto max-w-6xl">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <CardTitle>{user?.role === "CITIZEN" ? "My Requests" : "All Requests"}</CardTitle>
                  <CardDescription>{filteredAndSorted.length} request{filteredAndSorted.length !== 1 ? "s" : ""} shown</CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search requests..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="max-w-sm bg-background" />
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
                      <Button variant="outline" size="sm" onClick={() => { setSearchTerm(""); setStatusFilter("ALL"); }}>Clear</Button>
                    )}
                    <Button variant="outline" size="sm" className="flex items-center gap-1.5 shrink-0" onClick={() => exportToCSV(filteredAndSorted, "requests.csv")}>
                      <Download className="h-4 w-4" /> CSV
                    </Button>
                  </div>
                </div>
              </div>

              {/* Sort controls */}
              <div className="flex flex-wrap gap-2 pt-3 border-t mt-3">
                <span className="text-xs text-muted-foreground self-center">Sort by:</span>
                {[
                  { label: "ID", key: "request_id" },
                  { label: "Status", key: "status" },
                  { label: "Service", key: "service_type" },
                  { label: "Date", key: "created_at" },
                ].map(({ label, key }) => (
                  <button
                    key={key}
                    onClick={() => handleSort(key)}
                    className={`flex items-center gap-1 text-xs px-2 py-1 rounded-md border transition-colors ${
                      sort.key === key ? "border-acc-blue bg-acc-blue/10 text-acc-blue" : "border-border bg-background text-muted-foreground hover:border-acc-blue/50"
                    }`}
                  >
                    {label}
                    {sort.key === key ? (
                      sort.dir === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                    ) : <ArrowUpDown className="h-3 w-3" />}
                  </button>
                ))}
              </div>
            </CardHeader>

            <CardContent>
              {error ? (
                <div className="text-center py-8 text-red-500">Error: {error}</div>
              ) : filteredAndSorted.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">No requests found</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {searchTerm || statusFilter !== "ALL" ? "No requests match your current filters." : user?.role === "CITIZEN" ? "You haven't submitted any requests yet." : "There are no requests in the system."}
                  </p>
                  {user?.role === "CITIZEN" && !searchTerm && statusFilter === "ALL" && (
                    <div className="mt-6">
                      <Button onClick={() => setIsCreateDialogOpen(true)}><Plus className="mr-2 h-4 w-4" />Create Request</Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredAndSorted.map((request) => (
                    <Card key={request.request_id} className="hover:shadow-md transition-shadow bg-white">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">Request #{request.request_id}</CardTitle>
                          <StatusBadge status={request.status} />
                        </div>
                        <CardDescription className="text-sm mt-1">
                          {user?.role === "CITIZEN" ? request.service_type : `Citizen ID: ${request.citizen_id}`}
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
                            <div className={request.status === "REJECTED" ? "border-l-2 border-red-500 pl-2" : ""}>
                              <p className={`text-sm font-medium ${request.status === "REJECTED" ? "text-red-500" : "text-muted-foreground"}`}>Comment</p>
                              <p className="text-sm">{request.comment}</p>
                            </div>
                          )}
                          <div className="flex justify-between items-center pt-2">
                            <div className="text-xs text-muted-foreground">
                              {request.created_at ? new Date(request.created_at).toLocaleDateString() : "N/A"}
                            </div>
                            {user?.role === "ADMIN" ? (
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => openEditDialog(request)}>Update</Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="destructive" size="sm"><Trash2 className="h-3.5 w-3.5" /></Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Delete Request #{request.request_id}?</AlertDialogTitle>
                                      <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction className="bg-destructive text-white hover:bg-destructive/90" onClick={() => handleDeleteRequest(request.request_id)}>Delete</AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            ) : request.status === "RESOLVED" ? (
                              <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Completed</div>
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

      {/* ── CREATE DIALOG (CITIZEN) ── */}
      {user?.role === "CITIZEN" && (
        <Dialog open={isCreateDialogOpen} onOpenChange={(open) => { setIsCreateDialogOpen(open); if (open) resetForm(); }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Request</DialogTitle>
              <DialogDescription>Submit a new service request</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateRequest}>
              <div className="grid gap-4 py-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Service Type</Label>
                  {utilitiesLoading ? (
                    <Input value="Loading services..." disabled className="mt-1" />
                  ) : utilityTypes.length === 0 ? (
                    <Input value="No available services" disabled className="mt-1" />
                  ) : (
                    <select
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs mt-1"
                      value={formData.service_type || ""}
                      onChange={(e) => setFormData({ ...formData, service_type: e.target.value })}
                      required
                    >
                      <option value="">Select a service type</option>
                      {utilityTypes.map((type, i) => <option key={i} value={type}>{type}</option>)}
                    </select>
                  )}
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Details</Label>
                  <Textarea value={formData.details || ""} onChange={(e) => setFormData({ ...formData, details: e.target.value })} placeholder="Enter request details" required className="mt-1" />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Comment (Optional)</Label>
                  <Textarea value={formData.comment || ""} onChange={(e) => setFormData({ ...formData, comment: e.target.value })} placeholder="Add any additional comments" className="mt-1" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="w-full" disabled={isCreating}>
                  {isCreating ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Submitting...</> : "Submit Request"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* ── EDIT DIALOG (ADMIN) ── */}
      {user?.role === "ADMIN" && (
        <Dialog open={isEditDialogOpen} onOpenChange={(open) => { setIsEditDialogOpen(open); if (!open) { resetForm(); setSelectedRequest(null); } }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Request #{selectedRequest?.request_id}</DialogTitle>
              <DialogDescription>Change status and add an admin comment</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpdateRequest}>
              <div className="grid gap-4 py-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Citizen ID</Label>
                  <Input value={selectedRequest?.citizen_id || ""} disabled className="mt-1" />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Service Type</Label>
                  <Input value={selectedRequest?.service_type || ""} disabled className="mt-1" />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Details</Label>
                  <Textarea value={selectedRequest?.details || ""} disabled className="mt-1" />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Status</Label>
                  <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs mt-1" value={formData.status || "PENDING"} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                    <option value="PENDING">Pending</option>
                    <option value="APPROVED">Approved</option>
                    <option value="RESOLVED">Resolved</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Comment</Label>
                  <Textarea value={formData.comment || ""} onChange={(e) => setFormData({ ...formData, comment: e.target.value })} placeholder="Add a comment for the citizen" className="mt-1" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="w-full" disabled={isUpdating}>
                  {isUpdating ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Updating...</> : "Update Request"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </main>
  );
}