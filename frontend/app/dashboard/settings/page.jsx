"use client";
import { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft } from "lucide-react";

export default function ProfilePage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const [profileData, setProfileData] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: ""
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    } else if (user) {
      fetchProfileData();
    }
  }, [user, loading]);

  const fetchProfileData = async () => {
    try {
      const response = await fetch("http://localhost:8000/auth/me", {
        credentials: "include"
      });
      
      if (response.ok) {
        const data = await response.json();
        setProfileData(data);
      } else {
        console.error("Failed to fetch profile data");
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    } finally {
      setLoadingProfile(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");
    
    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setPasswordError("New passwords do not match");
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      return;
    }
    
    setIsChangingPassword(true);
    
    try {
      const response = await fetch(`http://localhost:8000/change-password/${profileData.email}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          password: passwordData.newPassword
        })
      });
      
      if (response.ok) {
        setPasswordSuccess("Password changed successfully!");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmNewPassword: ""
        });
      } else {
        const errorData = await response.json();
        setPasswordError(errorData.error || "Failed to change password");
      }
    } catch (error) {
      setPasswordError("An error occurred while changing password");
      console.error("Error changing password:", error);
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (loading || loadingProfile) return <div className="flex items-center justify-center min-h-screen"><p>Loading...</p></div>;
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
              <h1 className="text-3xl font-bold text-primary mb-2">Profile Settings</h1>
              <p className="text-muted-foreground">Manage your profile information and account settings</p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 bg-card">
        <div className="container px-4 md:px-6 mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Information Card */}
            <Card className="lg:col-span-2 bg-card">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Your personal details and account information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {profileData && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <p className="text-lg font-medium">{profileData.full_name || "Not provided"}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <p className="text-lg font-medium">{profileData.email}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Role</Label>
                      <p className="text-lg font-medium">{profileData.role}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <p className="text-lg font-medium">{profileData.phone || "Not provided"}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Date of Birth</Label>
                      <p className="text-lg font-medium">
                        {profileData.dob ? new Date(profileData.dob).toLocaleDateString() : "Not provided"}
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Gender</Label>
                      <p className="text-lg font-medium">
                        {profileData.gender === "M" ? "Male" : profileData.gender === "F" ? "Female" : "Not specified"}
                      </p>
                    </div>
                  </div>
                )}
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Addresses</h3>
                  {profileData && profileData.addresses && profileData.addresses.length > 0 ? (
                    <div className="space-y-4">
                      {profileData.addresses.map((address, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label>Street</Label>
                              <p>{address.street || "N/A"}</p>
                            </div>
                            <div>
                              <Label>Flat/Unit</Label>
                              <p>{address.flat_no || "N/A"}</p>
                            </div>
                            <div>
                              <Label>City</Label>
                              <p>{address.city || "N/A"}</p>
                            </div>
                            <div>
                              <Label>Pincode</Label>
                              <p>{address.pincode || "N/A"}</p>
                            </div>
                            <div>
                              <Label>Building</Label>
                              <p>{address.building_name || "N/A"}</p>
                            </div>
                            <div>
                              <Label>Role</Label>
                              <p>{address.role || "N/A"}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No addresses registered</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Change Password Card */}
            <Card className="bg-card">
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Update your account password</CardDescription>
              </CardHeader>
              <CardContent>
                {!showPasswordForm ? (
                  <Button onClick={() => setShowPasswordForm(true)} className="w-full">
                    Change Password
                  </Button>
                ) : (
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                        required
                        minLength={6}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                      <Input
                        id="confirmNewPassword"
                        type="password"
                        value={passwordData.confirmNewPassword}
                        onChange={(e) => setPasswordData({...passwordData, confirmNewPassword: e.target.value})}
                        required
                        minLength={6}
                      />
                    </div>
                    
                    {passwordError && (
                      <div className="text-red-500 text-sm">{passwordError}</div>
                    )}
                    
                    {passwordSuccess && (
                      <div className="text-green-500 text-sm">{passwordSuccess}</div>
                    )}
                    
                    <div className="flex space-x-2">
                      <Button 
                        type="submit" 
                        disabled={isChangingPassword}
                        className="flex-1"
                      >
                        {isChangingPassword ? "Changing Password..." : "Change Password"}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => {
                          setShowPasswordForm(false);
                          setPasswordError("");
                          setPasswordSuccess("");
                          setPasswordData({ newPassword: "", confirmNewPassword: "" });
                        }}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}