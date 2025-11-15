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
import { Plus, Search, User, Edit, Trash2 } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";

export default function ManageCitizensPage() {
  const { user, loading } = useUser();
  const router = useRouter();

  const [citizens, setCitizens] = useState([]);
  const [filteredCitizens, setFilteredCitizens] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCitizen, setSelectedCitizen] = useState(null);
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    gender: "",
    dob: "",
  });

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchCitizens();
    }
  }, [user]);

  useEffect(() => {
    const filtered = searchTerm
      ? citizens.filter((citizen) =>
          citizen.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          citizen.phone?.includes(searchTerm)
        )
      : citizens;
    setFilteredCitizens(filtered);
  }, [searchTerm, citizens]);

  // Fetch all citizens
  const fetchCitizens = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:8000/api/citizens", {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch citizens");
      const data = await response.json();
      setCitizens(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Create new citizen
  const handleCreateCitizen = async (e) => {
    e.preventDefault();
    try {
      const requestBody = {
        full_name: formData.full_name,
        phone: formData.phone,
        gender: formData.gender,
        dob: formData.dob,
      };

      const response = await fetch("http://localhost:8000/api/citizens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create citizen");
      }
      
      await fetchCitizens();
      setIsCreateDialogOpen(false);
      resetForm();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  // Update citizen
  const handleUpdateCitizen = async (e) => {
    e.preventDefault();
    try {
      const requestBody = {
        full_name: formData.full_name,
        phone: formData.phone,
        gender: formData.gender,
        dob: formData.dob,
      };

      const response = await fetch(`http://localhost:8000/api/citizens/${selectedCitizen.citizen_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update citizen");
      }
      
      await fetchCitizens();
      setIsEditDialogOpen(false);
      resetForm();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  // Delete citizen
  const handleDeleteCitizen = async (citizenId) => {
    if (!confirm("Are you sure you want to delete this citizen?")) return;
    
    try {
      const response = await fetch(`http://localhost:8000/api/citizens/${citizenId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete citizen");
      }
      
      await fetchCitizens();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  // Open edit dialog with citizen data
  const openEditDialog = (citizen) => {
    setSelectedCitizen(citizen);
    setFormData({
      full_name: citizen.full_name || "",
      phone: citizen.phone || "",
      gender: citizen.gender || "",
      dob: citizen.dob ? new Date(citizen.dob).toISOString().split('T')[0] : "",
    });
    setIsEditDialogOpen(true);
  };

  const resetForm = () =>
    setFormData({
      full_name: "",
      phone: "",
      gender: "",
      dob: "",
    });

  if (loading || isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );

  if (!user) return null;

  return (
    <main className="flex flex-col items-center min-h-screen w-full">
      <section className="w-full py-12 md:py-16 bg-background">
        <div className="container px-4 md:px-6 mx-auto max-w-6xl">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-primary mb-2">
                Citizen Management
              </h1>
              <p className="text-muted-foreground">
                Manage and organize citizen data
              </p>
            </div>

            {/* Add Citizen Button */}
            {user?.role === "ADMIN" && (
              <Dialog
                open={isCreateDialogOpen}
                onOpenChange={(open) => {
                  setIsCreateDialogOpen(open);
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
                    <DialogDescription>
                      Create a new citizen entry
                    </DialogDescription>
                  </DialogHeader>

                  <form onSubmit={handleCreateCitizen} className="space-y-4">
                    <div>
                      <Label>Full Name</Label>
                      <Input
                        value={formData.full_name}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            full_name: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    <div>
                      <Label>Phone</Label>
                      <Input
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            phone: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    <div>
                      <Label>Gender</Label>
                      <select
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
                        value={formData.gender}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            gender: e.target.value,
                          })
                        }
                        required
                      >
                        <option value="">Select Gender</option>
                        <option value="M">Male</option>
                        <option value="F">Female</option>
                        <option value="O">Other</option>
                      </select>
                    </div>

                    <div>
                      <Label>Date of Birth</Label>
                      <Input
                        type="date"
                        value={formData.dob}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            dob: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    <DialogFooter>
                      <Button type="submit">Add Citizen</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>

          {/* 🧑 Table of Citizens */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>All Citizens</CardTitle>
                  <CardDescription>
                    List of registered citizens
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search citizens..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm bg-background"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {error ? (
                <div className="text-center py-6 text-red-500">
                  Error: {error}
                </div>
              ) : filteredCitizens.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  No citizens found
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Gender</TableHead>
                      <TableHead>Date of Birth</TableHead>
                      {user?.role === "ADMIN" && <TableHead>Actions</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCitizens.map((citizen) => (
                      <TableRow key={citizen.citizen_id}>
                        <TableCell>{citizen.citizen_id}</TableCell>
                        <TableCell>{citizen.full_name}</TableCell>
                        <TableCell>{citizen.phone || "-"}</TableCell>
                        <TableCell>
                          {citizen.gender === "M" ? "Male" : 
                           citizen.gender === "F" ? "Female" : 
                           citizen.gender === "O" ? "Other" : "-"}
                        </TableCell>
                        <TableCell>
                          {citizen.dob ? new Date(citizen.dob).toLocaleDateString() : "-"}
                        </TableCell>
                        {user?.role === "ADMIN" && (
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="outline" size="icon-sm" onClick={() => openEditDialog(citizen)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="destructive" size="icon-sm" onClick={() => handleDeleteCitizen(citizen.citizen_id)}>
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

      {/* Edit Citizen Dialog */}
      {user?.role === "ADMIN" && (
        <Dialog
          open={isEditDialogOpen}
          onOpenChange={(open) => {
            setIsEditDialogOpen(open);
            if (!open) {
              resetForm();
              setSelectedCitizen(null);
            }
          }}
        >
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Citizen</DialogTitle>
              <DialogDescription>
                Update citizen information
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleUpdateCitizen} className="space-y-4">
              <div>
                <Label>Full Name</Label>
                <Input
                  value={formData.full_name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      full_name: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div>
                <Label>Phone</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      phone: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div>
                <Label>Gender</Label>
                <select
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      gender: e.target.value,
                    })
                  }
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                  <option value="O">Other</option>
                </select>
              </div>

              <div>
                <Label>Date of Birth</Label>
                <Input
                  type="date"
                  value={formData.dob}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      dob: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <DialogFooter>
                <Button type="submit">Update Citizen</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </main>
  );
}