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
import { Plus, Search, MapPin } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
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
  const [buildingTypes, setBuildingTypes] = useState([]);
  const [formBuildingData, setBuildingFormData] = useState({
    building_name: "",
    building_type: "",
    category: "",
  });

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
          b.b_name?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : buildings;
    setFilteredBuildings(filtered);
  }, [searchTerm, buildings]);

  // 🔹 Fetch all buildings
  const fetchBuildings = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:8000/api/buildings", {
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
      const res = await fetch("http://localhost:8000/api/buildings/building-type", {
        credentials: "include",
      });
      const data = await res.json();
      setBuildingTypes(data);
    } catch (err) {
      console.error("Error fetching types:", err);
    }
  };

  // 🔹 Create new building
  const handleCreateBuilding = async (e) => {
    e.preventDefault();
    try {
      const isCustomType = formBuildingData.building_type === "custom";
      const requestBody = {
        building_name: formBuildingData.building_name,
        ...(isCustomType
          ? {
              building_type: formBuildingData.custom_type_name,
              category: formBuildingData.category,
            }
          : {
              type_id: Number(formBuildingData.building_type),
            }),
      };

      const response = await fetch("http://localhost:8000/api/buildings", {
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
    }
  };

  const resetBuildingForm = () =>
    setBuildingFormData({
      building_name: "",
      building_type: "",
      category: "",
      custom_type_name: "",
    });

  if (loading || isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );

  return (
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
                      <Label>Building Name</Label>
                      <Input
                        value={formBuildingData.building_name}
                        onChange={(e) =>
                          setBuildingFormData({
                            ...formBuildingData,
                            building_name: e.target.value,
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
                          setBuildingFormData({
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
                          <SelectItem value="custom">+ Custom Type</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Show extra fields if "Custom Type" is selected */}
                    {formBuildingData.building_type === "custom" && (
                      <>
                        <div>
                          <Label>Type Name</Label>
                          <Input
                            value={formBuildingData.custom_type_name || ""}
                            onChange={(e) =>
                              setBuildingFormData({
                                ...formBuildingData,
                                custom_type_name: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div>
                          <Label>Category</Label>
                          <Input
                            value={formBuildingData.category || ""}
                            onChange={(e) =>
                              setBuildingFormData({
                                ...formBuildingData,
                                category: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                      </>
                    )}

                    <DialogFooter>
                      <Button type="submit">Add Building</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>

          {/* 🏢 Table of Buildings */}
          <Card>
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
                      <TableHead>Type</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBuildings.map((b) => (
                      <TableRow key={b.build_id} className="cursor-pointer hover:bg-muted/50" onClick={() => router.push(`/dashboard/manage-buildings/${b.build_id}`)}>
                        <TableCell>{b.build_id}</TableCell>
                        <TableCell>{b.b_name}</TableCell>
                        <TableCell>{b.building_type?.type_name || "-"}</TableCell>
                        <TableCell>{b.building_type?.category || "-"}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            <MapPin className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
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
    </main>
  );
}
