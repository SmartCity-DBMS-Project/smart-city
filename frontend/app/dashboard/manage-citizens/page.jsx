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
import { Plus, Search, Edit, Trash2, ArrowLeft } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";
import SkeletonLoader from "@/components/SkeletonLoader";

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
    email: "",
  });

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  // Fetch citizens
  useEffect(() => {
    if (user) fetchCitizens();
  }, [user]);

  // Search filter
  useEffect(() => {
    const filtered = searchTerm
      ? citizens.filter((citizen) =>
          citizen.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          citizen.phone?.includes(searchTerm) ||
          citizen.email?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : citizens;

    setFilteredCitizens(filtered);
  }, [searchTerm, citizens]);

  // Fetch all citizens
  const fetchCitizens = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("http://localhost:8000/api/citizens", {
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to fetch citizens");

      const data = await res.json();
      setCitizens(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form state
  const resetForm = () =>
    setFormData({
      full_name: "",
      phone: "",
      gender: "",
      dob: "",
      email: "",
    });

  // Create new citizen
  const handleCreateCitizen = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/api/citizens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to create citizen");
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
      const response = await fetch(
        `http://localhost:8000/api/citizens/${selectedCitizen.citizen_id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to update citizen");
      }

      await fetchCitizens();
      setIsEditDialogOpen(false);
      resetForm();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  // Delete citizen
  const handleDeleteCitizen = async (id) => {
    if (!confirm("Delete this citizen?")) return;

    try {
      const response = await fetch(
        `http://localhost:8000/api/citizens/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to delete");
      }

      await fetchCitizens();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  // Open edit dialog
  const openEditDialog = (citizen) => {
    setSelectedCitizen(citizen);

    setFormData({
      full_name: citizen.full_name ?? "",
      phone: citizen.phone ?? "",
      gender: citizen.gender ?? "",
      dob: citizen.dob ? new Date(citizen.dob).toISOString().split("T")[0] : "",
      email: citizen.email ?? "",
    });

    setIsEditDialogOpen(true);
  };

  if (loading || isLoading) {
    return (
      <main className="flex flex-col items-center min-h-screen w-full">
                  <section className="w-full py-12 md:py-16 bg-background">
                      <div className="container px-4 md:px-6 mx-auto max-w-6xl">
                          <div className="flex flex-col gap-6 md:gap-8">
                              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                  <div className="min-w-0">
                                      <SkeletonLoader />
                                  </div>
                                  <div className="flex items-center gap-4">
                                      <div className="h-14 w-14 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </section>
              
                  <section className="w-full py-12 bg-muted-background flex-1 flex items-center justify-center">
                      <div className="container px-4 md:px-6 mx-auto max-w-6xl">
                          <LoadingSpinner message="Loading your dashboard..." />
                      </div>
                  </section>
              </main>
    );
  }

  if (!user) return null;

  return (
    <main className="flex flex-col items-center min-h-screen w-full bg-muted-background">
      <section className="w-full py-12 md:py-16">
        <div className="container px-4 md:px-6 mx-auto max-w-6xl">

          {/* Header */}
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="flex items-center gap-4 mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div className="flex justify-between items-center mb-10">
            <div>
              <h1 className="text-4xl font-bold text-primary">Citizen Management</h1>
              <p className="text-muted-foreground mt-1">
                Manage and organize citizen information
              </p>
              <div className="w-24 h-1 bg-acc-blue mt-4 mb-6 rounded-full"></div>
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
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Citizen
                  </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-[500px] bg-white">
                  <DialogHeader>
                    <DialogTitle>Add Citizen</DialogTitle>
                    <DialogDescription>
                      Fill in the citizen details below.
                    </DialogDescription>
                  </DialogHeader>

                  <form onSubmit={handleCreateCitizen} className="space-y-4">
                    {["full_name", "phone", "email"].map((field) => (
                      <div key={field}>
                        <Label className="capitalize">{field.replace("_", " ")}</Label>
                        <Input
                          value={formData[field]}
                          onChange={(e) =>
                            setFormData({ ...formData, [field]: e.target.value })
                          }
                          required
                        />
                      </div>
                    ))}

                    <div>
                      <Label>Gender</Label>
                      <select
                        className="flex h-9 w-full rounded-md border border-input bg-white px-3 py-1 text-sm"
                        value={formData.gender}
                        onChange={(e) =>
                          setFormData({ ...formData, gender: e.target.value })
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
                          setFormData({ ...formData, dob: e.target.value })
                        }
                        required
                      />
                    </div>

                    <DialogFooter>
                      <Button type="submit" className="w-full">
                        Add Citizen
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>

          {/* TABLE */}
          <Card className="bg-white shadow-md rounded-xl border border-gray-200">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Citizens</CardTitle>
                  <CardDescription>
                    All registered citizens in the system.
                  </CardDescription>
                </div>

                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
              </div>
            </CardHeader>

            <CardContent>
              {error ? (
                <p className="text-center text-red-500 py-5">{error}</p>
              ) : filteredCitizens.length === 0 ? (
                <p className="text-center text-muted-foreground py-5">
                  No citizens found.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Gender</TableHead>
                      <TableHead>DOB</TableHead>
                      {user?.role === "ADMIN" && <TableHead>Actions</TableHead>}
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {filteredCitizens.map((c) => (
                      <TableRow
                        key={c.citizen_id}
                        className="odd:bg-white even:bg-white transition"
                      >
                        <TableCell>{c.citizen_id}</TableCell>
                        <TableCell>{c.full_name}</TableCell>
                        <TableCell>{c.phone || "-"}</TableCell>
                        <TableCell>{c.email || "-"}</TableCell>
                        <TableCell>
                          {c.gender === "M"
                            ? "Male"
                            : c.gender === "F"
                            ? "Female"
                            : c.gender === "O"
                            ? "Other"
                            : "-"}
                        </TableCell>
                        <TableCell>
                          {c.dob
                            ? new Date(c.dob).toLocaleDateString()
                            : "-"}
                        </TableCell>

                        {user?.role === "ADMIN" && (
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="icon-sm"
                                onClick={() => openEditDialog(c)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="icon-sm"
                                onClick={() =>
                                  handleDeleteCitizen(c.citizen_id)
                                }
                              >
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

      {/* EDIT DIALOG */}
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
        <DialogContent className="sm:max-w-[500px] bg-white">
          <DialogHeader>
            <DialogTitle>Edit Citizen</DialogTitle>
            <DialogDescription>
              Update the citizen details below.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUpdateCitizen} className="space-y-4">
            {["full_name", "phone", "email"].map((field) => (
              <div key={field}>
                <Label className="capitalize">{field.replace("_", " ")}</Label>
                <Input
                  value={formData[field]}
                  onChange={(e) =>
                    setFormData({ ...formData, [field]: e.target.value })
                  }
                  required
                />
              </div>
            ))}

            <div>
              <Label>Gender</Label>
              <select
                className="flex h-9 w-full rounded-md border border-input bg-white px-3 py-1 text-sm"
                value={formData.gender}
                onChange={(e) =>
                  setFormData({ ...formData, gender: e.target.value })
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
                  setFormData({ ...formData, dob: e.target.value })
                }
                required
              />
            </div>

            <DialogFooter>
              <Button type="submit" className="w-full">
                Update Citizen
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  );
}
