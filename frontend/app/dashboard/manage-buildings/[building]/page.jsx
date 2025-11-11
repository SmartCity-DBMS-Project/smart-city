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

export default function BuildingDetailsPage({ params }) {
  const { user, loading } = useUser();
  const router = useRouter();
  const resolvedParams = use(params);
  const buildingId = resolvedParams.building;

  const [building, setBuilding] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isCreateAddressDialogOpen, setIsCreateAddressDialogOpen] = useState(false);
  const [isEditAddressDialogOpen, setIsEditAddressDialogOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const [formAddressData, setFormAddressData] = useState({
    street: "",
    zone: "",
    flat_no: "",
    city: "",
    pincode: "",
  });

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  useEffect(() => {
    if (user && buildingId) {
      fetchBuildingDetails();
      fetchBuildingAddresses();
    }
  }, [user, buildingId]);

  // 🔹 Fetch building details
  const fetchBuildingDetails = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/buildings/${buildingId}`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch building details");
      const data = await response.json();
      setBuilding(data);
    } catch (err) {
      setError(err.message);
    }
  };

  //  Fetch building addresses
  const fetchBuildingAddresses = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:8000/api/buildings/${buildingId}/addresses`, {
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

  // 🔹 Create new address
  const handleCreateAddress = async (e) => {
    e.preventDefault();
    try {
      const requestBody = {
        building_id: parseInt(buildingId),
        street: formAddressData.street,
        zone: formAddressData.zone,
        flat_no: formAddressData.flat_no,
        city: formAddressData.city,
        pincode: formAddressData.pincode,
      };

      const response = await fetch("http://localhost:8000/api/buildings/address", {
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
        street: formAddressData.street,
        zone: formAddressData.zone,
        flat_no: formAddressData.flat_no,
        city: formAddressData.city,
        pincode: formAddressData.pincode,
      };

      const response = await fetch(`http://localhost:8000/api/buildings/address/${selectedAddress.address_id}`, {
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
      const response = await fetch(`http://localhost:8000/api/buildings/address/${addressId}`, {
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
      street: address.street || "",
      zone: address.zone || "",
      flat_no: address.flat_no || "",
      city: address.city || "",
      pincode: address.pincode || "",
    });
    setIsEditAddressDialogOpen(true);
  };

  const resetAddressForm = () => {
    setFormAddressData({
      street: "",
      zone: "",
      flat_no: "",
      city: "",
      pincode: "",
    });
  };

  if (loading || isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
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
          <div className="flex items-center gap-4 mb-8">
            <Button variant="outline" onClick={() => router.back()} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-primary mb-2">
                {building?.b_name || "Building Details"}
              </h1>
              <p className="text-muted-foreground">
                Manage building addresses and residents
              </p>
            </div>
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
                  <p className="font-medium">{building?.build_id || "-"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Building Name</Label>
                  <p className="font-medium">{building?.b_name || "-"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Building Type</Label>
                  <p className="font-medium">{building?.building_type?.type_name || "-"}</p>
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
                      <Label>Street</Label>
                      <Input
                        value={formAddressData.street}
                        onChange={(e) =>
                          setFormAddressData({
                            ...formAddressData,
                            street: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    <div>
                      <Label>Zone</Label>
                      <Input
                        value={formAddressData.zone}
                        onChange={(e) =>
                          setFormAddressData({
                            ...formAddressData,
                            zone: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

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

                    <div>
                      <Label>City</Label>
                      <Input
                        value={formAddressData.city}
                        onChange={(e) =>
                          setFormAddressData({
                            ...formAddressData,
                            city: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    <div>
                      <Label>Pincode</Label>
                      <Input
                        value={formAddressData.pincode}
                        onChange={(e) =>
                          setFormAddressData({
                            ...formAddressData,
                            pincode: e.target.value,
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
          <Card>
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
                      <TableHead>Street</TableHead>
                      <TableHead>Zone</TableHead>
                      <TableHead>Flat/Unit</TableHead>
                      <TableHead>City</TableHead>
                      <TableHead>Pincode</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {addresses.map((address) => (
                      <TableRow key={address.address_id}>
                        <TableCell>{address.address_id}</TableCell>
                        <TableCell>{address.street}</TableCell>
                        <TableCell>{address.zone}</TableCell>
                        <TableCell>{address.flat_no}</TableCell>
                        <TableCell>{address.city}</TableCell>
                        <TableCell>{address.pincode}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="icon-sm"
                              onClick={() => openEditAddressDialog(address)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="icon-sm"
                              onClick={() => handleDeleteAddress(address.address_id)}
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
              <Label>Street</Label>
              <Input
                value={formAddressData.street}
                onChange={(e) =>
                  setFormAddressData({
                    ...formAddressData,
                    street: e.target.value,
                  })
                }
                required
              />
            </div>

            <div>
              <Label>Zone</Label>
              <Input
                value={formAddressData.zone}
                onChange={(e) =>
                  setFormAddressData({
                    ...formAddressData,
                    zone: e.target.value,
                  })
                }
                required
              />
            </div>

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

            <div>
              <Label>City</Label>
              <Input
                value={formAddressData.city}
                onChange={(e) =>
                  setFormAddressData({
                    ...formAddressData,
                    city: e.target.value,
                  })
                }
                required
              />
            </div>

            <div>
              <Label>Pincode</Label>
              <Input
                value={formAddressData.pincode}
                onChange={(e) =>
                  setFormAddressData({
                    ...formAddressData,
                    pincode: e.target.value,
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
    </main>
  );
}