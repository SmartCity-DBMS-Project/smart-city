"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Receipt, Plus, Edit, Trash2, Search, IndianRupee, Calendar, MapPin, AlertCircle, ArrowLeft, Loader2 } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";
import SkeletonLoader from "@/components/SkeletonLoader";
import AddressSearchSelect from "@/components/AddressSearchSelect";

export default function BillsPage() {
  const { user, loading } = useUser();
  const router = useRouter();
  
  const [bills, setBills] = useState([]);
  const [filteredBills, setFilteredBills] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [utilityTypes, setUtilityTypes] = useState([]);  // Utility types for dropdown
  const [addresses, setAddresses] = useState([]);  // Addresses for dropdown
  const [formData, setFormData] = useState({
    address_id: "",
    bill_type: "",  // This will now be the utility type
    units: "",  // Changed from amount to units
    due_date: "",
    status: "PENDING"
  });

  // State for form submission loading
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  // Fetch utility types
  const fetchUtilityTypes = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/bills/utility-types`, { 
        method: "GET", 
        credentials: "include" 
      });
      if (!response.ok) throw new Error("Failed to fetch utility types");
      const data = await response.json();
      setUtilityTypes(data);
    } catch (err) {
      console.error("Error fetching utility types:", err);
    }
  };

  // Fetch addresses
  const fetchAddresses = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/bills/addresses`, { 
        method: "GET", 
        credentials: "include" 
      });
      if (!response.ok) throw new Error("Failed to fetch addresses");
      const data = await response.json();
      setAddresses(data);
    } catch (err) {
      console.error("Error fetching addresses:", err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchBills();
      fetchUtilityTypes();  // Fetch utility types when user is loaded
      fetchAddresses();  // Fetch addresses when user is loaded
    }
  }, [user]);

  useEffect(() => {
    const filtered = searchTerm
      ? bills.filter(bill => 
          bill.bill_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          bill.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          bill.address_id?.toString().includes(searchTerm)
        )
      : bills;
    setFilteredBills(filtered);
  }, [searchTerm, bills]);

  const fetchBills = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/bills`, { method: "GET", credentials: "include" });
      if (!response.ok) throw new Error("Failed to fetch bills");
      const data = await response.json();
      setBills(data);
      setFilteredBills(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Validate bill form data
  const validateBillForm = (data) => {
    const errors = [];
    
    if (!data.address_id) {
      errors.push("Address is required");
    }
    
    if (!data.bill_type) {
      errors.push("Bill type is required");
    }
    
    if (!data.units || isNaN(parseFloat(data.units)) || parseFloat(data.units) <= 0) {
      errors.push("Units must be a positive number");
    }
    
    if (!data.due_date) {
      errors.push("Due date is required");
    }
    
    return errors;
  };

  const handleCreateBill = async (e) => {
    e.preventDefault();
    
    // Validate form data
    const errors = validateBillForm(formData);
    if (errors.length > 0) {
      alert("Validation errors:\n" + errors.join("\n"));
      return;
    }
    
    setIsCreating(true);
    try {
      console.log('Creating bill with data:', {
        address_id: parseInt(formData.address_id),
        bill_type: formData.bill_type,
        units: parseFloat(formData.units),  // Changed from amount to units
        due_date: new Date(formData.due_date).toISOString(),
        status: formData.status
      });
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/bills`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          address_id: parseInt(formData.address_id),
          bill_type: formData.bill_type,
          units: parseFloat(formData.units),  // Changed from amount to units
          due_date: new Date(formData.due_date).toISOString(),
          status: formData.status
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Failed to create bill" }));
        console.error('Backend error:', errorData);
        throw new Error(errorData.error || "Failed to create bill");
      }
      
      const result = await response.json();
      console.log('Bill created successfully:', result);
      
      await fetchBills();
      setIsCreateDialogOpen(false);
      resetForm();
    } catch (err) {
      console.error('Error creating bill:', err);
      alert("Error creating bill: " + err.message);
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateBill = async (e) => {
    e.preventDefault();
    
    // Validate form data
    const errors = validateBillForm(formData);
    if (errors.length > 0) {
      alert("Validation errors:\n" + errors.join("\n"));
      return;
    }
    
    setIsUpdating(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/bills/${selectedBill.bill_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          address_id: parseInt(formData.address_id),
          bill_type: formData.bill_type,
          units: parseFloat(formData.units),  // Changed from amount to units
          due_date: new Date(formData.due_date).toISOString(),
          status: formData.status
        }),
      });
      if (!response.ok) throw new Error("Failed to update bill");
      await fetchBills();
      setIsEditDialogOpen(false);
      resetForm();
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteBill = async (billId) => {
    if (!confirm("Delete this bill?")) return;
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/bills/${billId}`, {
        method: "DELETE",
        credentials: "include"
      });
      if (!response.ok) throw new Error("Failed to delete bill");
      await fetchBills();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const openEditDialog = (bill) => {
    setSelectedBill(bill);
    setFormData({
      address_id: bill.address_id.toString(),
      bill_type: bill.bill_type,
      units: bill.units ? bill.units.toString() : "",  // Changed from amount to units
      due_date: new Date(bill.due_date).toISOString().split('T')[0],
      status: bill.status
    });
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({ address_id: "", bill_type: "", units: "", due_date: "", status: "PENDING" });  // Changed from amount to units
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PAID": return "bg-green-100 text-green-800";
      case "PENDING": return "bg-yellow-100 text-yellow-800";
      case "OVERDUE": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const calculateStats = () => {
    const total = filteredBills.reduce((sum, bill) => sum + Number(bill.amount), 0);
    const pending = filteredBills.filter(b => b.status === "PENDING").length;
    const paid = filteredBills.filter(b => b.status === "PAID").length;
    const overdue = filteredBills.filter(b => b.status === "OVERDUE").length;
    return { total, pending, paid, overdue };
  };

  // Function to calculate amount based on units and charge_per_unit
  const calculateAmount = (units, chargePerUnit) => {
    if (!units || !chargePerUnit) return 0;
    return (parseFloat(units) * parseFloat(chargePerUnit)).toFixed(2);
  };

  const stats = calculateStats();

  if (loading) return (
    <main className="flex flex-col items-center min-h-screen w-full">
      <section className="w-full py-12 md:py-16 bg-background">
        <div className="container px-4 md:px-6 mx-auto max-w-6xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div>
              <SkeletonLoader />
            </div>
          </div>
        </div>
      </section>
  
      <section className="w-full py-12 bg-muted-background flex-1 flex items-center justify-center">
        <div className="container px-4 md:px-6 mx-auto max-w-6xl">
          <LoadingSpinner message="Loading bills..." />
        </div>
      </section>
    </main>
  );

  if (isLoading) return (
    <main className="flex flex-col items-center min-h-screen w-full">
      <section className="w-full py-12 md:py-16 bg-background">
        <div className="container px-4 md:px-6 mx-auto max-w-6xl">
          <Button variant="outline" onClick={() => router.back()} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div className="flex items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-primary mb-2">Bills Management</h1>
              <p className="text-muted-foreground">View and manage your utility bills</p>
            </div>
            {user?.role === "ADMIN" && (
              <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            )}
          </div>
        </div>
      </section>
  
      <section className="w-full py-12 bg-muted-background flex-1 flex items-center justify-center">
        <div className="container px-4 md:px-6 mx-auto max-w-6xl">
          <LoadingSpinner message="Loading bills..." />
        </div>
      </section>
    </main>
  );

  if (!user) return null;

  return (
    <main className="flex flex-col items-center min-h-screen w-full">
      <section className="w-full py-12 md:py-16 bg-background">
        <div className="container px-4 md:px-6 mx-auto max-w-6xl">
          {/* BACK BUTTON (separate row) */}
<div className="mb-4">
  <Button
    variant="outline"
    onClick={() => router.back()}
    className="flex items-center gap-2"
  >
    <ArrowLeft className="h-4 w-4" />
    Back
  </Button>
</div>

{/* TITLE + CREATE BILL (same row) */}
<div className="flex items-center justify-between mb-8">

  {/* CENTERED TITLE */}
  <div className="flex-1 text-left">
    <h1 className="text-3xl font-bold text-primary mb-2">Bills Management</h1>
    <p className="text-muted-foreground">View and manage your utility bills</p>
    <div className="w-24 h-1 bg-acc-blue mt-4 mb-6 rounded-full"></div>
  </div>

  {/* CREATE BILL — right side */}
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
          <div className="grid gap-4 py-4">
            <div>
              <Label className="text-sm font-medium text-gray-700">Address</Label>
              <AddressSearchSelect
                id="address_id"
                value={formData.address_id}
                onChange={(value) =>
                  setFormData({ ...formData, address_id: value })
                }
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">Bill Type</Label>
              <select
                id="bill_type"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs mt-1"
                value={formData.bill_type || ""}
                onChange={(e) =>
                  setFormData({ ...formData, bill_type: e.target.value })
                }
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
                id="units"
                type="number"
                step="0.01"
                value={formData.units || ""}
                onChange={(e) =>
                  setFormData({ ...formData, units: e.target.value })
                }
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">Due Date</Label>
              <Input
                id="due_date"
                type="date"
                value={formData.due_date || ""}
                onChange={(e) =>
                  setFormData({ ...formData, due_date: e.target.value })
                }
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">Status</Label>
              <select
                id="status"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs mt-1"
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
              >
                <option value="PENDING">Pending</option>
                <option value="PAID">Paid</option>
                <option value="OVERDUE">Overdue</option>
              </select>
            </div>

          </div>

          <DialogFooter>
            <Button type="submit" className="w-full" disabled={isCreating}>
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Bill...
                </>
              ) : (
                "Create Bill"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )}

</div>



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

      <section className="w-full py-12 bg-muted-background">
        <div className="container px-4 md:px-6 mx-auto max-w-6xl">
          <Card className="bg-background">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>All Bills</CardTitle>
                  <CardDescription>List of all bills in the system</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search Bills..."
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
              ) : filteredBills.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No bills found</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Bill ID</TableHead>
                      <TableHead>Address ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Units</TableHead>
                      <TableHead>Amount (₹)</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                      {user?.role === "ADMIN" && <TableHead>Actions</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBills.map((bill) => (
                      <TableRow key={bill.bill_id}>
                        <TableCell className="font-medium">{bill.bill_id}</TableCell>
                        <TableCell>{bill.address_id}</TableCell>
                        <TableCell>{bill.bill_type}</TableCell>
                        <TableCell>{bill.units || "N/A"}</TableCell>
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
                              <Button variant="destructive" size="icon-sm" onClick={() => handleDeleteBill(bill.bill_id)}>
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
            setSelectedBill(null);
          }
        }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Bill</DialogTitle>
              <DialogDescription>Update bill information</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpdateBill}>
              <div className="grid gap-4 py-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Address</Label>
                  <AddressSearchSelect
                    id="edit_address_id"
                    value={formData.address_id}
                    onChange={(value) => setFormData({...formData, address_id: value})}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Bill Type</Label>
                  <select 
                    id="edit_bill_type" 
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs mt-1"
                    value={formData.bill_type || ""} 
                    onChange={(e) => setFormData({...formData, bill_type: e.target.value})}
                    required
                  >
                    <option value="">Select a bill type</option>
                    {utilityTypes.map((utility) => (
                      <option key={utility.utility_id} value={utility.type}>
                        {utility.type}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Units</Label>
                  <Input id="edit_units" type="number" step="0.01" value={formData.units || ""} onChange={(e) => setFormData({...formData, units: e.target.value})} required className="mt-1" />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Due Date</Label>
                  <Input id="edit_due_date" type="date" value={formData.due_date || ""} onChange={(e) => setFormData({...formData, due_date: e.target.value})} required className="mt-1" />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Status</Label>
                  <select id="edit_status" className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs mt-1" value={formData.status || "PENDING"} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                    <option value="PENDING">Pending</option>
                    <option value="PAID">Paid</option>
                    <option value="OVERDUE">Overdue</option>
                  </select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="w-full" disabled={isUpdating}>
                  {isUpdating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating Bill...
                    </>
                  ) : (
                    "Update Bill"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </main>
  );
}