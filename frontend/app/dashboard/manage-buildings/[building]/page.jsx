"use client";

import { useState, useEffect, use } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Edit, Trash2, MapPin, ArrowLeft } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useUser } from "@/context/UserContext";
import { useRouter, useSearchParams } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";
import SkeletonLoader from "@/components/SkeletonLoader";

export default function BuildingDetailsPage({ params }) {
  const { user, loading } = useUser();
  const router = useRouter();
  const resolvedParams = use(params);
  const building_id = resolvedParams.building;

  const [building, setBuilding] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [buildingTypes, setBuildingTypes] = useState([]);

  const [isCreateAddressDialogOpen, setIsCreateAddressDialogOpen] = useState(false);
  const [isEditAddressDialogOpen, setIsEditAddressDialogOpen] = useState(false);
  const [isEditBuildingDialogOpen, setIsEditBuildingDialogOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const [formAddressData, setFormAddressData] = useState({
    flat_no: "",
  });

  const [formBuildingData, setFormBuildingData] = useState({
    building_name: "",
    building_type: "",
    street: "",
    zone: "",
    pincode: "",
  });

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  useEffect(() => {
    if (user && building_id) {
      fetchBuildingDetails();
      fetchBuildingAddresses();
      fetchBuildingTypes();
    }
  }, [user, building_id]);

  // 🔹 Fetch building types
  const fetchBuildingTypes = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/buildings/building-type", {
        credentials: "include",
      });
      const data = await res.json();
      setBuildingTypes(data);
    } catch (err) {
      console.error("Error fetching types:", err);
    }
  };

  // 🔹 Fetch building details
  const fetchBuildingDetails = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/buildings/${building_id}`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch building details");
      const data = await response.json();
      setBuilding(data);
      
      // Set form data for editing
      setFormBuildingData({
        building_name: data.building_name || "",
        building_type: data.building_type?.type_id?.toString() || "",
        street: data.street || "",
        zone: data.zone || "",
        pincode: data.pincode || "",
      });
    } catch (err) {
      setError(err.message);
    }
  };

  //  Fetch building addresses
  const fetchBuildingAddresses = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:8000/api/buildings/${building_id}/addresses`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch building addresses");
      const data = await response.json();
      setAddresses(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 🔹 Update building
  const handleUpdateBuilding = async (e) => {
    e.preventDefault();
    try {
      const requestBody = {
        building_name: formBuildingData.building_name,
        street: formBuildingData.street,
        zone: formBuildingData.zone,
        pincode: formBuildingData.pincode,
        type_id: Number(formBuildingData.building_type),
      };

      const response = await fetch(`http://localhost:8000/api/buildings/${building_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) throw new Error("Failed to update building");
      await fetchBuildingDetails();
      setIsEditBuildingDialogOpen(false);
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  // 🔹 Delete building
  const handleDeleteBuilding = async () => {
    if (!confirm("Are you sure you want to delete this building? This action cannot be undone.")) return;
    try {
      const response = await fetch(`http://localhost:8000/api/buildings/${building_id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to delete building");
      router.push("/dashboard/manage-buildings");
    } catch (err) {
      alert("Error deleting building: " + err.message);
    }
  };

  // 🔹 Create new address
  const handleCreateAddress = async (e) => {
    e.preventDefault();
    try {
      const requestBody = {
        flat_no: formAddressData.flat_no,
      };
      const response = await fetch(`http://localhost:8000/api/buildings/${building_id}/addresses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) throw new Error("Failed to create address");
      await fetchBuildingAddresses();
      setIsCreateAddressDialogOpen(false);
      resetAddressForm();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  // 🔹 Update address
  const handleUpdateAddress = async (e) => {
    e.preventDefault();
    try {
      const requestBody = {
        flat_no: formAddressData.flat_no,
      };
      const response = await fetch(`http://localhost:8000/api/buildings/${building_id}/addresses/${selectedAddress.address_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) throw new Error("Failed to update address");
      await fetchBuildingAddresses();
      setIsEditAddressDialogOpen(false);
      resetAddressForm();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  // 🔹 Delete address
  const handleDeleteAddress = async (addressId) => {
    if (!confirm("Delete this address?")) return;
    try {
      const response = await fetch(`http://localhost:8000/api/buildings/${building_id}/addresses/${addressId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to delete address");
      await fetchBuildingAddresses();
    } catch (err) {
      alert("Error deleting address: " + err.message);
    }
  };

  const openEditAddressDialog = (address) => {
    setSelectedAddress(address);
    setFormAddressData({
      flat_no: address.flat_no || "",
    });
    setIsEditAddressDialogOpen(true);
  };

  const resetAddressForm = () => {
    setFormAddressData({
      flat_no: "",
    });
  };

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
          <LoadingSpinner message="Loading building details..." />
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
                Building Details
              </h1>
              <p className="text-muted-foreground">
                Manage building addresses and residents
              </p>
            </div>
          </div>
        </div>
      </section>
  
      <section className="w-full py-12 bg-muted-background flex-1 flex items-center justify-center">
        <div className="container px-4 md:px-6 mx-auto max-w-6xl">
          <LoadingSpinner message="Loading building information..." />
        </div>
      </section>
    </main>
  );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );

  return (
    <main className="flex flex-col items-center min-h-screen w-full">
      <section className="w-full py-12 md:py-16 bg-background">
        <div className="container px-4 md:px-6 mx-auto max-w-6xl">
          <Button variant="outline" onClick={() => router.back()} className="flex items-center gap-2 mb-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div className="flex items-center justify-between mb-8">
  {/* LEFT — TITLE */}
  <div>
    <h1 className="text-3xl font-bold text-primary mb-2">
      {building?.building_name || "Building Details"}
    </h1>
    <p className="text-muted-foreground">
      Manage building addresses and residents
    </p>
    <div className="w-24 h-1 bg-acc-blue mt-4 mb-6 rounded-full"></div>
  </div>

  {/* RIGHT — BUTTONS */}
  {user?.role === "ADMIN" && (
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        onClick={() => setIsEditBuildingDialogOpen(true)}
      >
        <Edit className="h-4 w-4 mr-2" />
        Edit Building
      </Button>

      <Button 
        variant="destructive" 
        onClick={handleDeleteBuilding}
      >
        <Trash2 className="h-4 w-4 mr-2" />
        Delete Building
      </Button>
    </div>
  )}
</div>


          {/* Building Info Card */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Building Information</CardTitle>
              <CardDescription>
                Details about this building
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label className="text-muted-foreground">Building ID</Label>
                  <p className="font-medium">{building?.building_id || "-"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Building Name</Label>
                  <p className="font-medium">{building?.building_name || "-"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Building Type</Label>
                  <p className="font-medium">{building?.building_type?.type_name || "-"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Street</Label>
                  <p className="font-medium">{building?.street || "-"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Zone</Label>
                  <p className="font-medium">{building?.zone || "-"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Pincode</Label>
                  <p className="font-medium">{building?.pincode || "-"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Category</Label>
                  <p className="font-medium">{building?.building_type?.category || "-"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Addresses Section */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-primary">Addresses</h2>
              <p className="text-muted-foreground">
                List of addresses in this building
              </p>
            </div>

            {/* Add Address Button */}
            {user?.role === "ADMIN" && (
              <Dialog
                open={isCreateAddressDialogOpen}
                onOpenChange={(open) => {
                  setIsCreateAddressDialogOpen(open);
                  if (open) resetAddressForm();
                }}
              >
                <DialogTrigger asChild>
                  <Button className="bg-acc-blue hover:bg-acc-blue/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Address
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Add Address</DialogTitle>
                    <DialogDescription>
                      Create a new address for this building
                    </DialogDescription>
                  </DialogHeader>

                  <form onSubmit={handleCreateAddress} className="space-y-4">
                    <div>
                      <Label>Flat/Unit Number</Label>
                      <Input
                        value={formAddressData.flat_no}
                        onChange={(e) =>
                          setFormAddressData({
                            ...formAddressData,
                            flat_no: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    <DialogFooter>
                      <Button type="submit">Add Address</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>

          {/* 🏠 Table of Addresses */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>All Addresses</CardTitle>
              <CardDescription>
                List of registered addresses in this building
              </CardDescription>
            </CardHeader>
            <CardContent>
              {addresses.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  No addresses found
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Flat/Unit</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {addresses.map((address) => (
                      <TableRow key={address.address_id} className="cursor-pointer" onClick={() => router.push(`/dashboard/manage-buildings/${building_id}/address/${address.address_id}`)}>
                        <TableCell>{address.address_id}</TableCell>
                        <TableCell>{address.flat_no}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="icon-sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                openEditAddressDialog(address);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="icon-sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteAddress(address.address_id);
                              }}
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

      {/* ✏️ Edit Address Dialog */}
      <Dialog open={isEditAddressDialogOpen} onOpenChange={setIsEditAddressDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Address</DialogTitle>
            <DialogDescription>
              Update address information
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateAddress} className="space-y-4">
            <div>
              <Label>Flat/Unit Number</Label>
              <Input
                value={formAddressData.flat_no}
                onChange={(e) =>
                  setFormAddressData({
                    ...formAddressData,
                    flat_no: e.target.value,
                  })
                }
                required
              />
            </div>
            <DialogFooter>
              <Button type="submit">Update Address</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ✏️ Edit Building Dialog */}
      <Dialog open={isEditBuildingDialogOpen} onOpenChange={setIsEditBuildingDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Building</DialogTitle>
            <DialogDescription>
              Update building information
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateBuilding} className="space-y-4">
            <div>
              <Label>Building Name</Label>
              <Input
                value={formBuildingData.building_name}
                onChange={(e) =>
                  setFormBuildingData({
                    ...formBuildingData,
                    building_name: e.target.value,
                  })
                }
                required
              />
            </div>
            <div>
              <Label>Street</Label>
              <Input
                value={formBuildingData.street}
                onChange={(e) =>
                  setFormBuildingData({
                    ...formBuildingData,
                    street: e.target.value,
                  })
                }
                required
              />
            </div>
            <div>
              <Label>Zone</Label>
              <Input
                value={formBuildingData.zone}
                onChange={(e) =>
                  setFormBuildingData({
                    ...formBuildingData,
                    zone: e.target.value,
                  })
                }
                required
              />
            </div>
            <div>
              <Label>Pincode</Label>
              <Input
                value={formBuildingData.pincode}
                onChange={(e) =>
                  setFormBuildingData({
                    ...formBuildingData,
                    pincode: e.target.value,
                  })
                }
                required
              />
            </div>
            <div>
              <Label>Building Type</Label>
              <Select
                value={formBuildingData.building_type}
                onValueChange={(value) =>
                  setFormBuildingData({
                    ...formBuildingData,
                    building_type: value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  {buildingTypes.map((type) => (
                    <SelectItem
                      key={type.type_id}
                      value={type.type_id.toString()}
                    >
                      {type.type_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="submit">Update Building</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  );
}