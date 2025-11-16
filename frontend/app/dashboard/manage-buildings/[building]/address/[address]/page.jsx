"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ArrowLeft, Plus, Edit, Trash2, Loader2 } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";
import SkeletonLoader from "@/components/SkeletonLoader";

export default function AddressDetailsPage({ params }) {
  const { user, loading } = useUser();
  const router = useRouter();
  const resolvedParams = use(params);
  const { building, address } = resolvedParams || params || {};
  
  // Convert to proper IDs
  const building_id = building ? parseInt(building) : null;
  const address_id = address ? parseInt(address) : null;

  const [addressDetails, setAddressDetails] = useState(null);
  const [citizens, setCitizens] = useState([]);
  const [citizenList, setCitizenList] = useState([]); // 👈 NEW: for dropdown
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isAddCitizenDialogOpen, setIsAddCitizenDialogOpen] = useState(false);
  const [isEditCitizenDialogOpen, setIsEditCitizenDialogOpen] = useState(false);
  const [selectedCitizen, setSelectedCitizen] = useState(null);

  const [citizenForm, setCitizenForm] = useState({
    citizen_id: "",
    role: "",
  });

  // State for form submission loading
  const [isAdding, setIsAdding] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Redirect unauthenticated users
  useEffect(() => {
    console.log("User context ->", { user, loading });
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  // Fetch address & citizens once user is loaded
  useEffect(() => {
    console.log("Params check ->", { building_id, address_id, resolvedParams, params });
    if (user && building_id && address_id) {
      console.log("Fetching data with ->", { building_id, address_id });
      fetchAddressDetails();
      fetchCitizens();
      fetchCitizenList(); // 👈 NEW: load global citizens
    }
  }, [user, building_id, address_id]);

  // ============================
  // Fetch Address Info
  // ============================
  const fetchAddressDetails = async () => {
    try {
      console.log("Fetching address details with ->", { building_id, address_id });
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/buildings/${building_id}/addresses/${address_id}`,
        { credentials: "include" }
      );
      console.log("Address details response ->", res.status);
      if (!res.ok) throw new Error(`Failed to fetch address details: ${res.status} ${res.statusText}`);
      const data = await res.json();
      console.log("Address details data ->", data);
      setAddressDetails(data);
    } catch (err) {
      console.error("Error fetching address details:", err);
      setError(err.message);
    }
  };

  // ============================
  // Fetch Citizens linked to this address
  // ============================
  const fetchCitizens = async () => {
    try {
      setIsLoading(true);
      console.log("Fetching citizens with ->", { building_id, address_id });
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/buildings/${building_id}/addresses/${address_id}/citizens`,
        { credentials: "include" }
      );
      console.log("Citizens response ->", res.status);
      if (!res.ok) throw new Error(`Failed to fetch citizens: ${res.status} ${res.statusText}`);
      const data = await res.json();
      console.log("Citizens data ->", data);
      setCitizens(data);
    } catch (err) {
      console.error("Error fetching citizens:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // ============================
  // Fetch Global Citizen List (for dropdown)
  // ============================
  const fetchCitizenList = async () => {
    try {
      console.log("Fetching citizen list");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/citizens`, {
        credentials: "include",
      });
      console.log("Citizen list response ->", res.status);
      if (!res.ok) throw new Error(`Failed to fetch citizen list: ${res.status} ${res.statusText}`);
      const data = await res.json();
      console.log("Citizen list data ->", data);
      setCitizenList(data);
    } catch (err) {
      console.error("Error fetching citizen list:", err);
      setError(err.message);
    }
  };

  // ============================
  // Validate citizen form data
  // ============================
  const validateCitizenForm = (data) => {
    const errors = [];
    
    if (!data.citizen_id) {
      errors.push("Citizen is required");
    }
    
    if (!data.role) {
      errors.push("Role is required");
    }
    
    return errors;
  };

  // ============================
  // Add Citizen
  // ============================
  const handleAddCitizen = async (e) => {
    e.preventDefault();
    
    // Validate form data
    const errors = validateCitizenForm(citizenForm);
    if (errors.length > 0) {
      alert("Validation errors:\n" + errors.join("\n"));
      return;
    }
    
    setIsAdding(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/buildings/${building_id}/addresses/${address_id}/citizens`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            citizen_id: Number(citizenForm.citizen_id),
            role: citizenForm.role,
          }),
        }
      );
      if (!res.ok) throw new Error("Failed to add citizen");
      await fetchCitizens();
      setIsAddCitizenDialogOpen(false);
      resetForm();
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setIsAdding(false);
    }
  };

  // ============================
  // Update Citizen
  // ============================
  const handleUpdateCitizen = async (e) => {
    e.preventDefault();
    
    // Validate form data
    const errors = validateCitizenForm(citizenForm);
    if (errors.length > 0) {
      alert("Validation errors:\n" + errors.join("\n"));
      return;
    }
    
    setIsUpdating(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/buildings/${building_id}/addresses/${address_id}/citizens/${selectedCitizen.citizen_id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            role: citizenForm.role,
          }),
        }
      );
      if (!res.ok) throw new Error("Failed to update citizen");
      await fetchCitizens();
      setIsEditCitizenDialogOpen(false);
      resetForm();
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  // ============================
  // Delete Citizen
  // ============================
  const handleDeleteCitizen = async (citizenId) => {
    if (!confirm("Remove this citizen from this address?")) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/buildings/${building_id}/addresses/${address_id}/citizens/${citizenId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (!res.ok) throw new Error("Failed to delete citizen");
      await fetchCitizens();
    } catch (err) {
      alert("Error deleting citizen: " + err.message);
    }
  };

  // Helpers
  const openEditCitizenDialog = (citizen) => {
    setSelectedCitizen(citizen);
    setCitizenForm({
      citizen_id: citizen.citizen_id,
      role: citizen.role,
    });
    setIsEditCitizenDialogOpen(true);
  };

  const resetForm = () => {
    setCitizenForm({
      citizen_id: "",
      role: "",
    });
  };

  // Check if params are valid
  const areParamsValid = building_id && address_id && 
    !isNaN(building_id) && !isNaN(address_id);

  if (loading) return (
    <main className="flex flex-col items-center min-h-screen w-full">
      <section className="w-full py-12 md:py-16 bg-background">
        <div className="container px-4 md:px-6 mx-auto max-w-6xl">
          <Button variant="outline" onClick={() => router.back()} className="flex items-center gap-2 mb-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          <div className="flex items-center gap-4 mb-8">
            <div>
              <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
              <div className="h-4 w-80 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>
  
      <section className="w-full py-12 bg-muted-background flex-1 flex items-center justify-center">
        <div className="container px-4 md:px-6 mx-auto max-w-6xl">
          <LoadingSpinner message="Loading address details..." />
        </div>
      </section>
    </main>
  );

  if (isLoading) return (
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
                Address Details
              </h1>
              <p className="text-muted-foreground">Manage citizens linked to this address</p>
            </div>
          </div>
        </div>
      </section>
  
      <section className="w-full py-12 bg-muted-background flex-1 flex items-center justify-center">
        <div className="container px-4 md:px-6 mx-auto max-w-6xl">
          <LoadingSpinner message="Loading address information..." />
        </div>
      </section>
    </main>
  );

  if (!areParamsValid)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Invalid parameters: building_id or address_id is missing or invalid</p>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );

  // ============================
  // MAIN RENDER
  // ============================
  return (
    <main className="flex flex-col items-center min-h-screen w-full">
      <section className="w-full py-12 md:py-16 bg-background">
        <div className="container px-4 md:px-6 mx-auto max-w-6xl">
          {/* Header */}
          <Button variant="outline" onClick={() => router.back()} className="flex items-center gap-2 mb-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          <div className="flex items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-primary mb-2">
                Address #{addressDetails?.address_id || "Details"}
              </h1>
              <p className="text-muted-foreground">Manage citizens linked to this address</p>
              <div className="w-24 h-1 bg-acc-blue mt-4 mb-6 rounded-full"></div>
            </div>
          </div>

          {/* Citizens Section */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-primary">Citizens</h2>
              <p className="text-muted-foreground">Residents linked to this address</p>
            </div>

            {user?.role === "ADMIN" && (
              <Dialog
                open={isAddCitizenDialogOpen}
                onOpenChange={(open) => {
                  setIsAddCitizenDialogOpen(open);
                  if (open) resetForm();
                }}
              >
                <DialogTrigger asChild>
                  <Button className="bg-acc-blue hover:bg-acc-blue/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Citizen
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Add Citizen</DialogTitle>
                    <DialogDescription>Link a citizen to this address</DialogDescription>
                  </DialogHeader>

                  {/* 👇 Updated form with citizen dropdown */}
                  <form onSubmit={handleAddCitizen} className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Select Citizen</Label>
                      <Select
                        value={citizenForm.citizen_id || ""}
                        onValueChange={(val) =>
                          setCitizenForm({ ...citizenForm, citizen_id: val })
                        }
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Choose a citizen" />
                        </SelectTrigger>
                        <SelectContent>
                          {citizenList.map((cit) => (
                            <SelectItem key={cit.citizen_id} value={String(cit.citizen_id)}>
                              {cit.full_name} (ID: {cit.citizen_id})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700">Role</Label>
                      <Select
                        value={citizenForm.role || ""}
                        onValueChange={(val) =>
                          setCitizenForm({ ...citizenForm, role: val })
                        }
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="owner">Owner</SelectItem>
                          <SelectItem value="tenant">Tenant</SelectItem>
                          <SelectItem value="resident">Resident</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <DialogFooter>
                      <Button type="submit" className="w-full" disabled={isAdding}>
                        {isAdding ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Adding Citizen...
                          </>
                        ) : (
                          "Add Citizen"
                        )}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>

          {/* Citizens Table (same as before) */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>All Citizens</CardTitle>
              <CardDescription>List of linked citizens</CardDescription>
            </CardHeader>
            <CardContent>
              {citizens.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  No citizens linked yet
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {citizens.map((cit) => (
                      <TableRow key={cit.citizen_id}>
                        <TableCell>{cit.citizen_id}</TableCell>
                        <TableCell>{cit.citizen?.full_name || "-"}</TableCell>
                        <TableCell>{cit.role}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="icon-sm"
                              onClick={() => openEditCitizenDialog(cit)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="icon-sm"
                              onClick={() => handleDeleteCitizen(cit.citizen_id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Edit Citizen Dialog */}
      {user?.role === "ADMIN" && (
        <Dialog
          open={isEditCitizenDialogOpen}
          onOpenChange={(open) => {
            setIsEditCitizenDialogOpen(open);
            if (!open) {
              resetForm();
              setSelectedCitizen(null);
            }
          }}
        >
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Citizen Role</DialogTitle>
              <DialogDescription>Update the role of this citizen</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleUpdateCitizen} className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">Citizen</Label>
                <Input 
                  value={`${selectedCitizen?.citizen?.full_name || selectedCitizen?.citizen_id} (ID: ${selectedCitizen?.citizen_id})`} 
                  disabled 
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Role</Label>
                <Select
                  value={citizenForm.role || ""}
                  onValueChange={(val) =>
                    setCitizenForm({ ...citizenForm, role: val })
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="owner">Owner</SelectItem>
                    <SelectItem value="tenant">Tenant</SelectItem>
                    <SelectItem value="resident">Resident</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <DialogFooter>
                <Button type="submit" className="w-full" disabled={isUpdating}>
                  {isUpdating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating Role...
                    </>
                  ) : (
                    "Update Role"
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