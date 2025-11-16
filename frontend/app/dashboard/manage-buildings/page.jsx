"use client";

import { useState, useEffect } from "react";
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
import { Plus, Search, ArrowLeft, Loader2 } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";
import SkeletonLoader from "@/components/SkeletonLoader";

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
  const [buildingTypes, setBuildingTypes] = useState([]);
  const [formBuildingData, setBuildingFormData] = useState({
    building_name: "",
    building_type: "",
    street: "",
    zone: "",
    pincode: "",
    category: "",
  });

  // State for form submission loading
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchBuildings();
      fetchBuildingTypes();
    }
  }, [user]);

  useEffect(() => {
    const filtered = searchTerm
      ? buildings.filter((b) =>
          b.building_name?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : buildings;
    setFilteredBuildings(filtered);
  }, [searchTerm, buildings]);

  // 🔹 Fetch all buildings
  const fetchBuildings = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/buildings`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch buildings");
      const data = await response.json();
      setBuildings(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 🔹 Fetch available building types
  const fetchBuildingTypes = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/buildings/building-type`, {
        credentials: "include",
      });
      const data = await res.json();
      setBuildingTypes(data);
    } catch (err) {
      console.error("Error fetching types:", err);
    }
  };

  // 🔹 Validate building form data
  const validateBuildingForm = (data) => {
    const errors = [];
    
    if (!data.building_name || data.building_name.trim() === "") {
      errors.push("Building name is required");
    }
    
    if (!data.street || data.street.trim() === "") {
      errors.push("Street is required");
    }
    
    if (!data.zone || data.zone.trim() === "") {
      errors.push("Zone is required");
    }
    
    if (!data.pincode || data.pincode.trim() === "") {
      errors.push("Pincode is required");
    } else if (!/^\d{6}$/.test(data.pincode)) {
      errors.push("Pincode must be a 6-digit number");
    }
    
    if (!data.building_type) {
      errors.push("Building type is required");
    }
    
    // If custom type is selected, validate custom fields
    if (data.building_type === "custom") {
      if (!data.custom_type_name || data.custom_type_name.trim() === "") {
        errors.push("Custom type name is required");
      }
      
      if (!data.category || data.category.trim() === "") {
        errors.push("Category is required");
      }
    }
    
    return errors;
  };

  // 🔹 Create new building
  const handleCreateBuilding = async (e) => {
    e.preventDefault();
    
    // Validate form data
    const errors = validateBuildingForm(formBuildingData);
    if (errors.length > 0) {
      alert("Validation errors:\n" + errors.join("\n"));
      return;
    }
    
    setIsCreating(true);
    try {
      const isCustomType = formBuildingData.building_type === "custom";
      const requestBody = {
        building_name: formBuildingData.building_name,
        street: formBuildingData.street,
        zone: formBuildingData.zone,
        pincode: formBuildingData.pincode,
        ...(isCustomType
          ? {
              building_type: formBuildingData.custom_type_name,
              category: formBuildingData.category,
            }
          : {
              type_id: Number(formBuildingData.building_type),
            }),
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/buildings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) throw new Error("Failed to create building");
      await fetchBuildings();
      setIsCreateDialogOpen(false);
      resetBuildingForm();
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setIsCreating(false);
    }
  };

  // 🔹 Update building
  const handleUpdateBuilding = async (e) => {
    e.preventDefault();
    
    // Validate form data
    const errors = validateBuildingForm(formBuildingData);
    if (errors.length > 0) {
      alert("Validation errors:\n" + errors.join("\n"));
      return;
    }
    
    setIsUpdating(true);
    try {
      const isCustomType = formBuildingData.building_type === "custom";
      const requestBody = {
        building_name: formBuildingData.building_name,
        street: formBuildingData.street,
        zone: formBuildingData.zone,
        pincode: formBuildingData.pincode,
        ...(isCustomType
          ? {
              building_type: formBuildingData.custom_type_name,
              category: formBuildingData.category,
            }
          : {
              type_id: Number(formBuildingData.building_type),
            }),
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/buildings/${selectedBuilding.building_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) throw new Error("Failed to update building");
      await fetchBuildings();
      setIsEditDialogOpen(false);
      resetBuildingForm();
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  // 🔹 Delete building
  const handleDeleteBuilding = async (buildingId) => {
    if (!confirm("Delete this building?")) return;
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/buildings/${buildingId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to delete building");
      await fetchBuildings();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const resetBuildingForm = () =>
    setBuildingFormData({
      building_name: "",
      building_type: "",
      street: "",
      zone: "",
      pincode: "",
      category: "",
      custom_type_name: "",
    });

  if (loading) return (
    <main className="flex flex-col items-center min-h-screen w-full">
      <section className="w-full py-12 md:py-16 bg-background">
        <div className="container px-4 md:px-6 mx-auto max-w-6xl">
          <div className="flex justify-between items-center mb-8">
            <div>
              <SkeletonLoader />
            </div>
            {user?.role === "ADMIN" && (
              <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            )}
          </div>
        </div>
      </section>
  
      <section className="w-full py-12 bg-muted-background flex-1 flex items-center justify-center">
        <div className="container px-4 md:px-6 mx-auto max-w-6xl">
          <LoadingSpinner message="Loading buildings..." />
        </div>
      </section>
    </main>
  );

  if (isLoading) return (
    <main className="flex flex-col items-center min-h-screen w-full">
      <section className="w-full py-12 md:py-16 bg-background">
        <div className="container px-4 md:px-6 mx-auto max-w-6xl">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-primary mb-2">
                Building Management
              </h1>
              <p className="text-muted-foreground">
                Manage and organize building data
              </p>
            </div>
            {user?.role === "ADMIN" && (
              <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            )}
          </div>
        </div>
      </section>
  
      <section className="w-full py-12 bg-muted-background flex-1 flex items-center justify-center">
        <div className="container px-4 md:px-6 mx-auto max-w-6xl">
          <LoadingSpinner message="Loading buildings..." />
        </div>
      </section>
    </main>
  );

  return (
    <main className="flex flex-col items-center min-h-screen w-full">
      <section className="w-full py-12 md:py-16 bg-background">
        <div className="container px-4 md:px-6 mx-auto max-w-6xl">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="flex items-center gap-4 mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-primary mb-2">
                Building Management
              </h1>
              <p className="text-muted-foreground">
                Manage and organize building data
              </p>
              <div className="w-24 h-1 bg-acc-blue mt-4 mb-6 rounded-full"></div>
            </div>

            {/* Add Building Button */}
            {user?.role === "ADMIN" && (
              <Dialog
                open={isCreateDialogOpen}
                onOpenChange={(open) => {
                  setIsCreateDialogOpen(open);
                  if (open) resetBuildingForm();
                }}
              >
                <DialogTrigger asChild>
                  <Button className="bg-acc-blue hover:bg-acc-blue/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Building
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Add Building</DialogTitle>
                    <DialogDescription>
                      Create a new building entry
                    </DialogDescription>
                  </DialogHeader>

                  <form onSubmit={handleCreateBuilding} className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Building Name</Label>
                      <Input
                        value={formBuildingData.building_name || ""}
                        onChange={(e) =>
                          setBuildingFormData({
                            ...formBuildingData,
                            building_name: e.target.value,
                          })
                        }
                        required
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700">Street</Label>
                      <Input
                        value={formBuildingData.street || ""}
                        onChange={(e) =>
                          setBuildingFormData({
                            ...formBuildingData,
                            street: e.target.value,
                          })
                        }
                        required
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700">Zone</Label>
                      <Input
                        value={formBuildingData.zone || ""}
                        onChange={(e) =>
                          setBuildingFormData({
                            ...formBuildingData,
                            zone: e.target.value,
                          })
                        }
                        required
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700">Pincode</Label>
                      <Input
                        value={formBuildingData.pincode || ""}
                        onChange={(e) =>
                          setBuildingFormData({
                            ...formBuildingData,
                            pincode: e.target.value,
                          })
                        }
                        required
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700">Building Type</Label>
                      <Select
                        value={formBuildingData.building_type || ""}
                        onValueChange={(value) =>
                          setBuildingFormData({
                            ...formBuildingData,
                            building_type: value,
                          })
                        }
                      >
                        <SelectTrigger className="mt-1">
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
                          <SelectItem value="custom">+ Custom Type</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Show extra fields if "Custom Type" is selected */}
                    {formBuildingData.building_type === "custom" && (
                      <>
                        <div>
                          <Label className="text-sm font-medium text-gray-700">Type Name</Label>
                          <Input
                            value={formBuildingData.custom_type_name || ""}
                            onChange={(e) =>
                              setBuildingFormData({
                                ...formBuildingData,
                                custom_type_name: e.target.value,
                              })
                            }
                            required
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-700">Category</Label>
                          <Input
                            value={formBuildingData.category || ""}
                            onChange={(e) =>
                              setBuildingFormData({
                                ...formBuildingData,
                                category: e.target.value,
                              })
                            }
                            required
                            className="mt-1"
                          />
                        </div>
                      </>
                    )}

                    <DialogFooter>
                      <Button type="submit" className="w-full" disabled={isCreating}>
                        {isCreating ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Adding Building...
                          </>
                        ) : (
                          "Add Building"
                        )}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>

          {/* 🏢 Table of Buildings */}
          <Card className="bg-white">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>All Buildings</CardTitle>
                  <CardDescription>
                    List of registered buildings
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm bg-background"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filteredBuildings.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  No buildings found
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Street</TableHead>
                      <TableHead>Zone</TableHead>
                      <TableHead>Pincode</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Category</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBuildings.map((b) => (
                      <TableRow key={b.building_id} className="cursor-pointer hover:bg-muted/50" onClick={() => router.push(`/dashboard/manage-buildings/${b.building_id}`)}>
                        <TableCell>{b.building_id}</TableCell>
                        <TableCell>{b.building_name}</TableCell>
                        <TableCell>{b.street}</TableCell>
                        <TableCell>{b.zone}</TableCell>
                        <TableCell>{b.pincode}</TableCell>
                        <TableCell>{b.building_type?.type_name || "-"}</TableCell>
                        <TableCell>{b.building_type?.category || "-"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Add Building Dialog */}
      {user?.role === "ADMIN" && (
        <Dialog
          open={isCreateDialogOpen}
          onOpenChange={(open) => {
            setIsCreateDialogOpen(open);
            if (open) resetBuildingForm();
          }}
        >
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add Building</DialogTitle>
              <DialogDescription>
                Create a new building entry
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreateBuilding} className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">Building Name</Label>
                <Input
                  value={formBuildingData.building_name || ""}
                  onChange={(e) =>
                    setBuildingFormData({
                      ...formBuildingData,
                      building_name: e.target.value,
                    })
                  }
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Street</Label>
                <Input
                  value={formBuildingData.street || ""}
                  onChange={(e) =>
                    setBuildingFormData({
                      ...formBuildingData,
                      street: e.target.value,
                    })
                  }
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Zone</Label>
                <Input
                  value={formBuildingData.zone || ""}
                  onChange={(e) =>
                    setBuildingFormData({
                      ...formBuildingData,
                      zone: e.target.value,
                    })
                  }
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Pincode</Label>
                <Input
                  value={formBuildingData.pincode || ""}
                  onChange={(e) =>
                    setBuildingFormData({
                      ...formBuildingData,
                      pincode: e.target.value,
                    })
                  }
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Building Type</Label>
                <Select
                  value={formBuildingData.building_type || ""}
                  onValueChange={(value) =>
                    setBuildingFormData({
                      ...formBuildingData,
                      building_type: value,
                    })
                  }
                >
                  <SelectTrigger className="mt-1">
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
                    <SelectItem value="custom">+ Custom Type</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Show extra fields if "Custom Type" is selected */}
              {formBuildingData.building_type === "custom" && (
                <>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Type Name</Label>
                    <Input
                      value={formBuildingData.custom_type_name || ""}
                      onChange={(e) =>
                        setBuildingFormData({
                          ...formBuildingData,
                          custom_type_name: e.target.value,
                        })
                      }
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Category</Label>
                    <Input
                      value={formBuildingData.category || ""}
                      onChange={(e) =>
                        setBuildingFormData({
                          ...formBuildingData,
                          category: e.target.value,
                        })
                      }
                      required
                      className="mt-1"
                    />
                  </div>
                </>
              )}

              <DialogFooter>
                <Button type="submit" className="w-full" disabled={isCreating}>
                  {isCreating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding Building...
                    </>
                  ) : (
                    "Add Building"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Building Dialog */}
      {user?.role === "ADMIN" && (
        <Dialog
          open={isEditDialogOpen}
          onOpenChange={(open) => {
            setIsEditDialogOpen(open);
            if (!open) {
              resetBuildingForm();
              setSelectedBuilding(null);
            }
          }}
        >
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Building</DialogTitle>
              <DialogDescription>
                Update building information
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleUpdateBuilding} className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">Building Name</Label>
                <Input
                  value={formBuildingData.building_name || ""}
                  onChange={(e) =>
                    setBuildingFormData({
                      ...formBuildingData,
                      building_name: e.target.value,
                    })
                  }
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Street</Label>
                <Input
                  value={formBuildingData.street || ""}
                  onChange={(e) =>
                    setBuildingFormData({
                      ...formBuildingData,
                      street: e.target.value,
                    })
                  }
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Zone</Label>
                <Input
                  value={formBuildingData.zone || ""}
                  onChange={(e) =>
                    setBuildingFormData({
                      ...formBuildingData,
                      zone: e.target.value,
                    })
                  }
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Pincode</Label>
                <Input
                  value={formBuildingData.pincode || ""}
                  onChange={(e) =>
                    setBuildingFormData({
                      ...formBuildingData,
                      pincode: e.target.value,
                    })
                  }
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Building Type</Label>
                <Select
                  value={formBuildingData.building_type || ""}
                  onValueChange={(value) =>
                    setBuildingFormData({
                      ...formBuildingData,
                      building_type: value,
                    })
                  }
                >
                  <SelectTrigger className="mt-1">
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
                <Button type="submit" className="w-full" disabled={isUpdating}>
                  {isUpdating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating Building...
                    </>
                  ) : (
                    "Update Building"
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