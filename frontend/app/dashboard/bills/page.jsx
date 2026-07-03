"use client";
import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Receipt, Plus, Edit, Trash2, Search, IndianRupee, Calendar, AlertCircle, ArrowLeft, Loader2, Download, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";
import SkeletonLoader from "@/components/SkeletonLoader";
import AddressSearchSelect from "@/components/AddressSearchSelect";
import { toast } from "sonner";

/* ------------------------------------------------------------------ */
/* CSV EXPORT UTILITY                                                   */
/* ------------------------------------------------------------------ */
function exportToCSV(rows, filename) {
  if (!rows || rows.length === 0) {
    toast.error("No data to export.");
    return;
  }
  const headers = ["Bill ID", "Address ID", "Type", "Units", "Amount (₹)", "Due Date", "Status"];
  const csvRows = rows.map((bill) => [
    bill.bill_id,
    bill.address_id,
    bill.bill_type ?? "N/A",
    bill.units ?? "N/A",
    Number(bill.amount).toFixed(2),
    new Date(bill.due_date).toLocaleDateString(),
    bill.status,
  ]);
  const csvContent = [headers, ...csvRows]
    .map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
    .join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
  toast.success(`Exported ${rows.length} bill(s) to ${filename}`);
}

/* ------------------------------------------------------------------ */
/* SORT HEADER COMPONENT                                                */
/* ------------------------------------------------------------------ */
function SortableHeader({ label, sortKey, currentSort, onSort }) {
  const isActive = currentSort.key === sortKey;
  return (
    <button
      className="flex items-center gap-1 font-medium hover:text-primary transition-colors"
      onClick={() => onSort(sortKey)}
    >
      {label}
      {isActive ? (
        currentSort.dir === "asc" ? (
          <ArrowUp className="h-3.5 w-3.5 text-acc-blue" />
        ) : (
          <ArrowDown className="h-3.5 w-3.5 text-acc-blue" />
        )
      ) : (
        <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground/50" />
      )}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* MAIN PAGE                                                            */
/* ------------------------------------------------------------------ */
export default function BillsPage() {
  const { user, loading } = useUser();
  const router = useRouter();

  const [bills, setBills] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [utilityTypes, setUtilityTypes] = useState([]);
  const [formData, setFormData] = useState({
    address_id: "",
    bill_type: "",
    units: "",
    due_date: "",
    status: "PENDING",
  });
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Sorting state
  const [sort, setSort] = useState({ key: "bill_id", dir: "desc" });

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchBills();
      fetchUtilityTypes();
    }
  }, [user]);

  /* ---- Data Fetching ---- */
  const fetchBills = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:8000/api/bills", {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch bills");
      const data = await response.json();
      setBills(data);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load bills: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUtilityTypes = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/bills/utility-types", {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch utility types");
      const data = await response.json();
      setUtilityTypes(data);
    } catch (err) {
      console.error("Error fetching utility types:", err);
    }
  };

  /* ---- Filtering & Sorting (client-side, derived) ---- */
  const filteredAndSorted = useMemo(() => {
    const filtered = searchTerm
      ? bills.filter(
          (bill) =>
            bill.bill_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            bill.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            bill.address_id?.toString().includes(searchTerm)
        )
      : bills;

    return [...filtered].sort((a, b) => {
      let aVal = a[sort.key];
      let bVal = b[sort.key];
      // Numeric fields
      if (sort.key === "bill_id" || sort.key === "address_id" || sort.key === "units") {
        aVal = Number(aVal ?? 0);
        bVal = Number(bVal ?? 0);
      } else if (sort.key === "amount") {
        aVal = Number(aVal ?? 0);
        bVal = Number(bVal ?? 0);
      } else if (sort.key === "due_date") {
        aVal = new Date(aVal).getTime();
        bVal = new Date(bVal).getTime();
      } else {
        aVal = String(aVal ?? "").toLowerCase();
        bVal = String(bVal ?? "").toLowerCase();
      }
      if (aVal < bVal) return sort.dir === "asc" ? -1 : 1;
      if (aVal > bVal) return sort.dir === "asc" ? 1 : -1;
      return 0;
    });
  }, [bills, searchTerm, sort]);

  const handleSort = (key) => {
    setSort((prev) =>
      prev.key === key ? { key, dir: prev.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }
    );
  };

  /* ---- Stats ---- */
  const stats = useMemo(() => {
    const total = filteredAndSorted.reduce((sum, b) => sum + Number(b.amount), 0);
    const pending = filteredAndSorted.filter((b) => b.status === "PENDING").length;
    const paid = filteredAndSorted.filter((b) => b.status === "PAID").length;
    const overdue = filteredAndSorted.filter((b) => b.status === "OVERDUE").length;
    return { total, pending, paid, overdue };
  }, [filteredAndSorted]);

  /* ---- Form Actions ---- */
  const validateBillForm = (data) => {
    const errors = [];
    if (!data.address_id) errors.push("Address is required");
    if (!data.bill_type) errors.push("Bill type is required");
    if (!data.units || isNaN(parseFloat(data.units)) || parseFloat(data.units) <= 0)
      errors.push("Units must be a positive number");
    if (!data.due_date) errors.push("Due date is required");
    return errors;
  };

  const handleCreateBill = async (e) => {
    e.preventDefault();
    const errors = validateBillForm(formData);
    if (errors.length > 0) {
      errors.forEach((err) => toast.error(err));
      return;
    }
    setIsCreating(true);
    try {
      const response = await fetch("http://localhost:8000/api/bills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          address_id: parseInt(formData.address_id),
          bill_type: formData.bill_type,
          units: parseFloat(formData.units),
          due_date: new Date(formData.due_date).toISOString(),
          status: formData.status,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Failed to create bill" }));
        throw new Error(errorData.error || "Failed to create bill");
      }
      await fetchBills();
      setIsCreateDialogOpen(false);
      resetForm();
      toast.success("Bill created successfully!");
    } catch (err) {
      toast.error("Failed to create bill: " + err.message);
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateBill = async (e) => {
    e.preventDefault();
    const errors = validateBillForm(formData);
    if (errors.length > 0) {
      errors.forEach((err) => toast.error(err));
      return;
    }
    setIsUpdating(true);
    try {
      const response = await fetch(`http://localhost:8000/api/bills/${selectedBill.bill_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          address_id: parseInt(formData.address_id),
          bill_type: formData.bill_type,
          units: parseFloat(formData.units),
          due_date: new Date(formData.due_date).toISOString(),
          status: formData.status,
        }),
      });
      if (!response.ok) throw new Error("Failed to update bill");
      await fetchBills();
      setIsEditDialogOpen(false);
      resetForm();
      toast.success("Bill updated successfully!");
    } catch (err) {
      toast.error("Failed to update bill: " + err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteBill = async (billId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/bills/${billId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to delete bill");
      await fetchBills();
      toast.success("Bill deleted.");
    } catch (err) {
      toast.error("Failed to delete bill: " + err.message);
    }
  };

  const openEditDialog = (bill) => {
    setSelectedBill(bill);
    setFormData({
      address_id: bill.address_id.toString(),
      bill_type: bill.bill_type,
      units: bill.units ? bill.units.toString() : "",
      due_date: new Date(bill.due_date).toISOString().split("T")[0],
      status: bill.status,
    });
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({ address_id: "", bill_type: "", units: "", due_date: "", status: "PENDING" });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PAID": return "bg-green-100 text-green-800";
      case "PENDING": return "bg-yellow-100 text-yellow-800";
      case "OVERDUE": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  /* ---- Shared Form Fields ---- */
  const BillFormFields = () => (
    <div className="grid gap-4 py-4">
      <div>
        <Label className="text-sm font-medium text-gray-700">Address</Label>
        <AddressSearchSelect
          id="address_id"
          value={formData.address_id}
          onChange={(value) => setFormData({ ...formData, address_id: value })}
          required
          className="mt-1"
        />
      </div>
      <div>
        <Label className="text-sm font-medium text-gray-700">Bill Type</Label>
        <select
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs mt-1"
          value={formData.bill_type || ""}
          onChange={(e) => setFormData({ ...formData, bill_type: e.target.value })}
          required
        >
          <option value="">Select bill type</option>
          {utilityTypes.map((u) => (
            <option key={u.utility_id} value={u.type}>
              {u.type}
            </option>
          ))}
        </select>
      </div>
      <div>
        <Label className="text-sm font-medium text-gray-700">Units</Label>
        <Input
          type="number"
          step="0.01"
          value={formData.units || ""}
          onChange={(e) => setFormData({ ...formData, units: e.target.value })}
          required
          className="mt-1"
        />
      </div>
      <div>
        <Label className="text-sm font-medium text-gray-700">Due Date</Label>
        <Input
          type="date"
          value={formData.due_date || ""}
          onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
          required
          className="mt-1"
        />
      </div>
      <div>
        <Label className="text-sm font-medium text-gray-700">Status</Label>
        <select
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs mt-1"
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
        >
          <option value="PENDING">Pending</option>
          <option value="PAID">Paid</option>
          <option value="OVERDUE">Overdue</option>
        </select>
      </div>
    </div>
  );

  /* ---- Loading States ---- */
  if (loading) return (
    <main className="flex flex-col items-center min-h-screen w-full">
      <section className="w-full py-12 md:py-16 bg-background">
        <div className="container px-4 md:px-6 mx-auto max-w-6xl">
          <SkeletonLoader />
        </div>
      </section>
      <section className="w-full py-12 bg-muted-background flex-1 flex items-center justify-center">
        <LoadingSpinner message="Loading bills..." />
      </section>
    </main>
  );

  if (isLoading) return (
    <main className="flex flex-col items-center min-h-screen w-full">
      <section className="w-full py-12 bg-muted-background flex-1 flex items-center justify-center">
        <LoadingSpinner message="Loading bills..." />
      </section>
    </main>
  );

  if (!user) return null;

  return (
    <main className="flex flex-col items-center min-h-screen w-full">
      {/* ── HEADER SECTION ── */}
      <section className="w-full py-12 md:py-16 bg-background">
        <div className="container px-4 md:px-6 mx-auto max-w-6xl">
          {/* Back button */}
          <div className="mb-4">
            <Button variant="outline" onClick={() => router.back()} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </div>

          {/* Title row */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex-1 text-left">
              <h1 className="text-3xl font-bold text-primary mb-2">Bills Management</h1>
              <p className="text-muted-foreground">View and manage your utility bills</p>
              <div className="w-24 h-1 bg-acc-blue mt-4 mb-6 rounded-full" />
            </div>

            {user?.role === "ADMIN" && (
              <Dialog
                open={isCreateDialogOpen}
                onOpenChange={(open) => {
                  setIsCreateDialogOpen(open);
                  if (open) resetForm();
                }}
              >
                <DialogTrigger asChild>
                  <Button className="bg-acc-blue hover:bg-acc-blue/90 whitespace-nowrap ml-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Bill
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Bill</DialogTitle>
                    <DialogDescription>Add a new bill to the system</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreateBill}>
                    <BillFormFields />
                    <DialogFooter>
                      <Button type="submit" className="w-full" disabled={isCreating}>
                        {isCreating ? (
                          <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating Bill...</>
                        ) : "Create Bill"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="border-t-4 border-t-acc-blue">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
                <IndianRupee className="h-6 w-6 text-acc-blue" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{stats.total.toFixed(2)}</div>
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
            <Card className="border-t-4 border-t-green-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Paid</CardTitle>
                <Receipt className="h-6 w-6 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.paid}</div>
              </CardContent>
            </Card>
            <Card className="border-t-4 border-t-red-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Overdue</CardTitle>
                <Calendar className="h-6 w-6 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.overdue}</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ── TABLE SECTION ── */}
      <section className="w-full py-12 bg-muted-background">
        <div className="container px-4 md:px-6 mx-auto max-w-6xl">
          <Card className="bg-background">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle>All Bills</CardTitle>
                  <CardDescription>
                    {filteredAndSorted.length} bill{filteredAndSorted.length !== 1 ? "s" : ""} shown
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Search className="h-4 w-4 text-muted-foreground shrink-0" />
                  <Input
                    placeholder="Search bills..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm bg-background"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1.5 shrink-0"
                    onClick={() => exportToCSV(filteredAndSorted, "bills.csv")}
                  >
                    <Download className="h-4 w-4" />
                    CSV
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {error ? (
                <div className="text-center py-8 text-red-500">Error: {error}</div>
              ) : filteredAndSorted.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No bills found</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <SortableHeader label="Bill ID" sortKey="bill_id" currentSort={sort} onSort={handleSort} />
                      </TableHead>
                      <TableHead>
                        <SortableHeader label="Address ID" sortKey="address_id" currentSort={sort} onSort={handleSort} />
                      </TableHead>
                      <TableHead>
                        <SortableHeader label="Type" sortKey="bill_type" currentSort={sort} onSort={handleSort} />
                      </TableHead>
                      <TableHead>
                        <SortableHeader label="Units" sortKey="units" currentSort={sort} onSort={handleSort} />
                      </TableHead>
                      <TableHead>
                        <SortableHeader label="Amount (₹)" sortKey="amount" currentSort={sort} onSort={handleSort} />
                      </TableHead>
                      <TableHead>
                        <SortableHeader label="Due Date" sortKey="due_date" currentSort={sort} onSort={handleSort} />
                      </TableHead>
                      <TableHead>
                        <SortableHeader label="Status" sortKey="status" currentSort={sort} onSort={handleSort} />
                      </TableHead>
                      {user?.role === "ADMIN" && <TableHead>Actions</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAndSorted.map((bill) => (
                      <TableRow key={bill.bill_id}>
                        <TableCell className="font-medium">{bill.bill_id}</TableCell>
                        <TableCell>{bill.address_id}</TableCell>
                        <TableCell>{bill.bill_type}</TableCell>
                        <TableCell>{bill.units ?? "N/A"}</TableCell>
                        <TableCell>₹{Number(bill.amount).toFixed(2)}</TableCell>
                        <TableCell>{new Date(bill.due_date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(bill.status)}`}>
                            {bill.status}
                          </span>
                        </TableCell>
                        {user?.role === "ADMIN" && (
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="outline" size="icon-sm" onClick={() => openEditDialog(bill)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              {/* Delete with AlertDialog */}
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="destructive" size="icon-sm">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Bill #{bill.bill_id}?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This will permanently delete this bill. This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      className="bg-destructive text-white hover:bg-destructive/90"
                                      onClick={() => handleDeleteBill(bill.bill_id)}
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
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

      {/* ── EDIT DIALOG ── */}
      {user?.role === "ADMIN" && (
        <Dialog
          open={isEditDialogOpen}
          onOpenChange={(open) => {
            setIsEditDialogOpen(open);
            if (!open) { resetForm(); setSelectedBill(null); }
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Bill</DialogTitle>
              <DialogDescription>Update bill information</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpdateBill}>
              <BillFormFields />
              <DialogFooter>
                <Button type="submit" className="w-full" disabled={isUpdating}>
                  {isUpdating ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Updating Bill...</>
                  ) : "Update Bill"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </main>
  );
}