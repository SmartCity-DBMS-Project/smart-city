"use client";
"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Receipt, Plus, Edit, Trash2, Search, IndianRupee, Calendar, MapPin, AlertCircle } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";

export default function ManageBuildingsPage() {
  const { user, loading } = useUser();
  const router = useRouter();
  
  const [buildings, setBuildings] = useState([]);
  const [filteredBuildings, setFilteredBuildings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [formBuildingData, setBuildingFormData] = useState({
    building_name: "",
    building_type: "",
    category: "",
  });
  const [formResidentData, setResidentFormData] = useState({
    building_id: "",
    citizen_id: "",
    role: "",
  });

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  useEffect(() => {
    if (user) fetchBuildings();
  }, [user]);

  useEffect(() => {
    const filtered = searchTerm
      ? buildings.filter(building => 
          building.building_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          building.building_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          building.category?.toString().includes(searchTerm)
        )
      : bills;
    setFilteredBuildings(filtered);
  }, [searchTerm, buildings]);

  const fetchBuildings = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:8000/api/buildings", { method: "GET", credentials: "include" });
      if (!response.ok) throw new Error("Failed to fetch buildings");
      const data = await response.json();
      setBuildings(data);
      // setFilteredBills(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateBuilding = async (e) => {
    e.preventDefault();
    try {
      console.log('Creating building with data:', {
        building_name: formBuildingData.building_name,
        building_type: parseInt(formBuildingData.building_type),
        category: formBuildingData.category,
      });
      
      const response = await fetch("http://localhost:8000/api/bills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          building_name: formBuildingData.building_name,
          building_type: parseInt(formBuildingData.building_type),
          category: formBuildingData.category,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Failed to create building" }));
        console.error('Backend error:', errorData);
        throw new Error(errorData.error || "Failed to create building");
      }
      
      const result = await response.json();
      console.log('Building created successfully:', result);
      
      await fetchBuildings();
      setIsCreateDialogOpen(false);
      resetForm();
    } catch (err) {
      console.error('Error creating building:', err);
      alert("Error creating building: " + err.message);
    }
  };

  const handleUpdateBuilding = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8000/api/buildings/${selectedBuilding.build_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          building_name: formBuildingData.building_name,
          building_type: parseInt(formBuildingData.building_type),
          category: formBuildingData.category
        }),
      });
      if (!response.ok) throw new Error("Failed to update building");
      await fetchBuildings();
      setIsEditDialogOpen(false);
      resetForm();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handleDeleteBuilding = async (buildId) => {
    if (!confirm("Delete this building?")) return;
    try {
      const response = await fetch(`http://localhost:8000/api/buildings/${buildId}`, {
        method: "DELETE",
        credentials: "include"
      });
      if (!response.ok) throw new Error("Failed to delete building");
      await fetchBuildings();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const openEditDialog = (building) => {
    setSelectedBuilding(building);
    setFormData({
        building_name: building.building_name,
        building_type: parseInt(building.building_type),
        category: building.category,
    });
    setIsEditDialogOpen(true);
  };

  const resetBuildingForm = () => {
    setBuildingFormData({ building_name: "", building_type: "", category: "", });
  };

  /*
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

  */

  if (loading || isLoading) return <div className="flex items-center justify-center min-h-screen"><p>Loading...</p></div>;
  if (!user) return null;

  return (
    <main className="flex flex-col items-center min-h-screen w-full">
      <section className="w-full py-12 md:py-16 bg-background">
        <div className="container px-4 md:px-6 mx-auto max-w-6xl">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-primary mb-2">Buildings Management</h1>
              <p className="text-muted-foreground">View and manage Buildings</p>
            </div>
            {user?.role === "ADMIN" && (
              <Dialog open={isCreateDialogOpen} onOpenChange={(open) => {
                setIsCreateDialogOpen(open);
                if (open) resetForm();
              }}>
                <DialogTrigger asChild>
                  <Button className="bg-acc-blue hover:bg-acc-blue/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Building
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Building</DialogTitle>
                    <DialogDescription>Add a new building to the system</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreateBuilding}>
                    <div className="grid gap-4 py-4">
                      <div>
                        <Label htmlFor="building_name">Building Name</Label>
                        <Input id="building_name" value={formBuildingData.building_name || ""} onChange={(e) => setBuildingFormData({...formBuildingData, building_name: e.target.value})} required />
                      </div>
                      <div>
                        <Label htmlFor="building_type">Building Type</Label>
                        <Input id="building_type" value={formBuildingData.building_type || ""} onChange={(e) => setBuildingFormData({...formBuildingData, building_type: e.target.value})} placeholder="1 for Hospital, 2 for Bank, 3 for School, 4 for Collage, 5 for Police Station, 6 for Postal Office, 7 for Residency" required />
                      </div>
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Input id="category" value={formBuildingData.category || ""} onChange={(e) => setBuildingFormData({...formBuildingData, category: e.target.value})} placeholder="eg: hospital, bank, school, collage, police_station, postal_office, residency" required />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Add Building</Button>
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
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold"></div>
              </CardContent>
            </Card>
            <Card className="border-t-4 border-t-yellow-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <AlertCircle className="h-6 w-6 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold"></div>
              </CardContent>
            </Card>
            <Card className="border-t-4 border-t-green-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Paid</CardTitle>
                <Receipt className="h-6 w-6 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold"></div>
              </CardContent>
            </Card>
            <Card className="border-t-4 border-t-red-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Overdue</CardTitle>
                <Calendar className="h-6 w-6 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold"></div>
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
                  <CardTitle>All Buildings</CardTitle>
                  <CardDescription>List of all buildings in the system</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search Buildings..."
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
                <div className="text-center py-8 text-muted-foreground">No Buildings found</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Building ID</TableHead>
                      <TableHead>Building Name</TableHead>
                      <TableHead>Building Type</TableHead>
                      <TableHead>Categoty</TableHead>
                      {user?.role === "ADMIN" && <TableHead>Actions</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBuildings.map((building) => (
                      <TableRow key={building.bill_id}>
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
                              <Button variant="destructive" size="icon-sm" onClick={() => handleDeleteBuilding(bill.bill_id)}>
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
            setSelectedBuilding(null);
          }
        }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Bill</DialogTitle>
              <DialogDescription>Update bill information</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpdateBuilding}>
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
