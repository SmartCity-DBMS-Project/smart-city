"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Heart, 
  BookOpen, 
  Droplets, 
  Building, 
  Car, 
  TreePine, 
  Shield, 
  Plug,
  Search,
  Plus,
  Filter,
  Grid,
  List,
  Users,
  Calendar,
  MapPin,
  Edit,
  Eye,
  Trash2
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function DepartmentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  // Mock departments data
  const departments = [
    { 
      id: 1,
      name: "Health", 
      slug: "health",
      description: "Public health services, hospitals, and wellness programs",
      icon: <Heart className="h-8 w-8 text-acc-blue" />,
      color: "bg-acc-blue",
      head: "Dr. Sarah Johnson",
      employees: 1240,
      budget: "₹42.5M",
      status: "Active"
    },
    { 
      id: 2,
      name: "Education", 
      slug: "education",
      description: "Schools, libraries, and educational initiatives",
      icon: <BookOpen className="h-8 w-8 text-acc-green" />,
      color: "bg-acc-green",
      head: "Prof. Michael Chen",
      employees: 2100,
      budget: "₹38.2M",
      status: "Active"
    },
    { 
      id: 3,
      name: "Water", 
      slug: "water",
      description: "Water supply, treatment, and conservation services",
      icon: <Droplets className="h-8 w-8 text-acc-blue" />,
      color: "bg-acc-blue",
      head: "Robert Williams",
      employees: 890,
      budget: "₹28.7M",
      status: "Active"
    },
    { 
      id: 4,
      name: "Municipal", 
      slug: "municipal",
      description: "City governance, permits, and civic services",
      icon: <Building className="h-8 w-8 text-acc-orange" />,
      color: "bg-acc-orange",
      head: "Amanda Rodriguez",
      employees: 1560,
      budget: "₹31.9M",
      status: "Active"
    },
    { 
      id: 5,
      name: "Transportation", 
      slug: "transportation",
      description: "Public transit, roads, and traffic management",
      icon: <Car className="h-8 w-8 text-acc-yellow" />,
      color: "bg-acc-yellow",
      head: "James Peterson",
      employees: 1870,
      budget: "₹56.3M",
      status: "Active"
    },
    { 
      id: 6,
      name: "Environment", 
      slug: "environment",
      description: "Parks, waste management, and sustainability",
      icon: <TreePine className="h-8 w-8 text-acc-green" />,
      color: "bg-acc-green",
      head: "Lisa Thompson",
      employees: 650,
      budget: "₹19.8M",
      status: "Active"
    },
    { 
      id: 7,
      name: "Public Safety", 
      slug: "safety",
      description: "Police, fire, and emergency services",
      icon: <Shield className="h-8 w-8 text-acc-orange" />,
      color: "bg-acc-orange",
      head: "David Miller",
      employees: 3200,
      budget: "₹78.4M",
      status: "Active"
    },
    { 
      id: 8,
      name: "Utilities", 
      slug: "utilities",
      description: "Electricity, gas, and telecommunications",
      icon: <Plug className="h-8 w-8 text-acc-blue" />,
      color: "bg-acc-blue",
      head: "Jennifer Lee",
      employees: 2450,
      budget: "₹67.2M",
      status: "Active"
    },
  ];

  // Filter departments based on search term
  const filteredDepartments = departments.filter(dept => 
    dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.head.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Form state for creating new department
  const [newDepartment, setNewDepartment] = useState({
    name: "",
    description: "",
    head: "",
    budget: "",
    status: "Active"
  });

  const handleCreateDepartment = (e) => {
    e.preventDefault();
    // In a real app, this would make an API call
    console.log("Creating department:", newDepartment);
    setIsCreateDialogOpen(false);
    // Reset form
    setNewDepartment({
      name: "",
      description: "",
      head: "",
      budget: "",
      status: "Active"
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">City Departments</h1>
              <p className="text-muted-foreground mt-2 max-w-2xl">
                Explore and manage the various departments that work together to enhance the quality of life, 
                sustainability, and efficiency of our city.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search departments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-64"
                />
              </div>
              
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-acc-blue hover:bg-acc-blue/90">
                    <Plus className="h-4 w-4 mr-2" />
                    New Department
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Create New Department</DialogTitle>
                    <DialogDescription>
                      Add a new department to the city management system.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreateDepartment} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Department Name</Label>
                      <Input
                        id="name"
                        value={newDepartment.name}
                        onChange={(e) => setNewDepartment({...newDepartment, name: e.target.value})}
                        placeholder="e.g., Parks and Recreation"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="head">Department Head</Label>
                      <Input
                        id="head"
                        value={newDepartment.head}
                        onChange={(e) => setNewDepartment({...newDepartment, head: e.target.value})}
                        placeholder="Full name of department head"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newDepartment.description}
                        onChange={(e) => setNewDepartment({...newDepartment, description: e.target.value})}
                        placeholder="Brief description of department functions"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="budget">Annual Budget</Label>
                        <Input
                          id="budget"
                          value={newDepartment.budget}
                          onChange={(e) => setNewDepartment({...newDepartment, budget: e.target.value})}
                          placeholder="e.g., ₹25.0M"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select 
                          value={newDepartment.status} 
                          onValueChange={(value) => setNewDepartment({...newDepartment, status: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Inactive">Inactive</SelectItem>
                            <SelectItem value="Under Review">Under Review</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-3 pt-4">
                      <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">Create Department</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
          {/* View Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 mt-6">
            <div className="flex items-center gap-2">
              <Button 
                variant={viewMode === "grid" ? "default" : "outline"} 
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4 mr-2" />
                Grid
              </Button>
              <Button 
                variant={viewMode === "list" ? "default" : "outline"} 
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4 mr-2" />
                List
              </Button>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Filter className="h-4 w-4" />
              <span>{filteredDepartments.length} of {departments.length} departments</span>
            </div>
          </div>
        </div>
      </div>

      {/* Departments Content */}
      <div className="container mx-auto px-4 py-8">
        {viewMode === "grid" ? (
          // Grid View
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDepartments.map((dept) => (
              <Link key={dept.id} href={`/departments/${dept.slug}`} className="block group">
                <Card className="h-full hover:shadow-lg transition-all duration-300 border border-border group-hover:border-acc-blue">
                  <CardHeader className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="mb-4 flex justify-center">
                        {dept.icon}
                      </div>
                      <Badge variant={dept.status === "Active" ? "default" : dept.status === "Inactive" ? "destructive" : "secondary"}>
                        {dept.status}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl font-bold group-hover:text-acc-blue transition-colors">
                      {dept.name}
                    </CardTitle>
                    <CardDescription className="mt-2">{dept.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="px-6 pb-6">
                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Users className="h-4 w-4 mr-2" />
                        <span>{dept.employees} employees</span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>Head: {dept.head}</span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>Budget: {dept.budget}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          // List View (Data Table)
          <Card className="border border-border">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Department</TableHead>
                    <TableHead>Head</TableHead>
                    <TableHead>Employees</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDepartments.map((dept) => (
                    <TableRow key={dept.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center">
                          <div className="mr-3">
                            {dept.icon}
                          </div>
                          <div>
                            <div className="font-medium">{dept.name}</div>
                            <div className="text-sm text-muted-foreground truncate max-w-xs">
                              {dept.description}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{dept.head}</TableCell>
                      <TableCell>{dept.employees.toLocaleString()}</TableCell>
                      <TableCell>{dept.budget}</TableCell>
                      <TableCell>
                        <Badge variant={dept.status === "Active" ? "default" : dept.status === "Inactive" ? "destructive" : "secondary"}>
                          {dept.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {filteredDepartments.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-muted-foreground mb-4">
              <Building className="h-12 w-12" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-1">No departments found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter to find what you're looking for.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}