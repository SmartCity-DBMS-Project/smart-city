"use client";
"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Receipt, Plus, Edit, Trash2, Search, IndianRupee, Calendar, MapPin, AlertCircle, ArrowLeft } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";

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
  const [formData, setFormData] = useState({
    address_id: "",
    bill_type: "",
    amount: "",
    due_date: "",
    status: "PENDING"
  });

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  useEffect(() => {
    if (user) fetchBills();
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
      const response = await fetch("http://localhost:8000/api/bills", { method: "GET", credentials: "include" });
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

  const handleCreateBill = async (e) => {
    e.preventDefault();
    try {
      console.log('Creating bill with data:', {
        address_id: parseInt(formData.address_id),
        bill_type: formData.bill_type,
        amount: parseFloat(formData.amount),
        due_date: new Date(formData.due_date).toISOString(),
        status: formData.status
      });
      
      const response = await fetch("http://localhost:8000/api/bills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          address_id: parseInt(formData.address_id),
          bill_type: formData.bill_type,
          amount: parseFloat(formData.amount),
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
    }
  };

  const handleUpdateBill = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8000/api/bills/${selectedBill.bill_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          address_id: parseInt(formData.address_id),
          bill_type: formData.bill_type,
          amount: parseFloat(formData.amount),
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
    }
  };

  const handleDeleteBill = async (billId) => {
    if (!confirm("Delete this bill?")) return;
    try {
      const response = await fetch(`http://localhost:8000/api/bills/${billId}`, {
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
      amount: bill.amount.toString(),
      due_date: new Date(bill.due_date).toISOString().split('T')[0],
      status: bill.status
    });
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({ address_id: "", bill_type: "", amount: "", due_date: "", status: "PENDING" });
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
              <h1 className="text-3xl font-bold text-primary mb-2">Bills Management</h1>
              <p className="text-muted-foreground">View and manage your utility bills</p>
            </div>
            {user?.role === "ADMIN" && (
              <Dialog open={isCreateDialogOpen} onOpenChange={(open) => {
                setIsCreateDialogOpen(open);
                if (open) resetForm();
              }}>
                <DialogTrigger asChild>
                  <Button className="bg-acc-blue hover:bg-acc-blue/90">
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
                        <Label htmlFor="address_id">Address ID</Label>
                        <Input id="address_id" type="number" value={formData.address_id || ""} onChange={(e) => setFormData({...formData, address_id: e.target.value})} required />
                      </div>
                      <div>
                        <Label htmlFor="bill_type">Bill Type</Label>
                        <Input id="bill_type" value={formData.bill_type || ""} onChange={(e) => setFormData({...formData, bill_type: e.target.value})} placeholder="e.g., Electricity, Water" required />
                      </div>
                      <div>
                        <Label htmlFor="amount">Amount</Label>
                        <Input id="amount" type="number" step="0.01" value={formData.amount || ""} onChange={(e) => setFormData({...formData, amount: e.target.value})} required />
                      </div>
                      <div>
                        <Label htmlFor="due_date">Due Date</Label>
                        <Input id="due_date" type="date" value={formData.due_date || ""} onChange={(e) => setFormData({...formData, due_date: e.target.value})} required />
                      </div>
                      <div>
                        <Label htmlFor="status">Status</Label>
                        <select id="status" className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs" value={formData.status || "PENDING"} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                          <option value="PENDING">Pending</option>
                          <option value="PAID">Paid</option>
                          <option value="OVERDUE">Overdue</option>
                        </select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Create Bill</Button>
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

      <section className="w-full py-12 bg-card">
        <div className="container px-4 md:px-6 mx-auto max-w-6xl">
          <Card>
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
                      <TableHead>Amount</TableHead>
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
                  <Label htmlFor="edit_address_id">Address ID</Label>
                  <Input id="edit_address_id" type="number" value={formData.address_id || ""} onChange={(e) => setFormData({...formData, address_id: e.target.value})} required />
                </div>
                <div>
                  <Label htmlFor="edit_bill_type">Bill Type</Label>
                  <Input id="edit_bill_type" value={formData.bill_type || ""} onChange={(e) => setFormData({...formData, bill_type: e.target.value})} required />
                </div>
                <div>
                  <Label htmlFor="edit_amount">Amount</Label>
                  <Input id="edit_amount" type="number" step="0.01" value={formData.amount || ""} onChange={(e) => setFormData({...formData, amount: e.target.value})} required />
                </div>
                <div>
                  <Label htmlFor="edit_due_date">Due Date</Label>
                  <Input id="edit_due_date" type="date" value={formData.due_date || ""} onChange={(e) => setFormData({...formData, due_date: e.target.value})} required />
                </div>
                <div>
                  <Label htmlFor="edit_status">Status</Label>
                  <select id="edit_status" className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs" value={formData.status || "PENDING"} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                    <option value="PENDING">Pending</option>
                    <option value="PAID">Paid</option>
                    <option value="OVERDUE">Overdue</option>
                  </select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Update Bill</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </main>
  );
}
