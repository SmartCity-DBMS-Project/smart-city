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
import LoadingSpinner from "@/components/LoadingSpinner";
import SkeletonLoader from "@/components/SkeletonLoader";
import { toast } from "sonner";

export default function ProfilePage() {
  const { user, loading } = useUser();
  const router = useRouter();

  const [profileData, setProfileData] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmNewPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
    if (user) fetchProfileData();
  }, [user, loading]);

  const fetchProfileData = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/auth/me", {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setProfileData(data);
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

    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setPasswordError("New passwords do not match");
      toast.error("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 4) {
      setPasswordError("Password must be at least 4 characters long");
      toast.error("Password must be at least 4 characters long");
      return;
    }

    setIsChangingPassword(true);

    try {
      const response = await fetch(
        `http://localhost:8000/api/auth/change-password/${profileData.email}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ password: passwordData.newPassword }),
        }
      );

      if (response.ok) {
        setPasswordSuccess("Password changed successfully!");
        toast.success("Password changed successfully!");
        setPasswordData({ newPassword: "", confirmNewPassword: "" });
        setShowPasswordForm(false);
      } else {
        const errorData = await response.json();
        const msg = errorData.error || "Failed to change password";
        setPasswordError(msg);
        toast.error(msg);
      }
    } catch (error) {
      setPasswordError("An error occurred while changing password");
      toast.error("An error occurred while changing password");
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (loading || loadingProfile)
    return (
      <main className="flex flex-col items-center min-h-screen w-full">
        <section className="w-full py-12 bg-background">
          <div className="container px-4 mx-auto max-w-6xl">
            <SkeletonLoader />
          </div>
        </section>
        <section className="w-full py-12 bg-muted-background flex-1 flex items-center justify-center">
          <LoadingSpinner message="Loading profile..." />
        </section>
      </main>
    );

  if (!user) return null;

  return (
    <main className="flex flex-col items-center min-h-screen w-full">

      {/* TOP SECTION */}
      <section className="w-full py-12 md:py-16 bg-background border-b border-border">
        <div className="container px-4 mx-auto max-w-6xl flex-col items-center gap-10">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="flex items-center gap-2 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2">Profile Settings</h1>
            <p className="text-muted-foreground text-sm">
              Manage your profile information and account settings
            </p>
            <div className="w-24 h-1 bg-acc-blue mt-4 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* MAIN SECTION */}
      <section className="w-full py-12 bg-muted-background flex-1">
        <div className="container px-4 mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* PROFILE INFO (left, tall) */}
          <Card className="lg:col-span-2 bg-background border border-border rounded-xl">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Your account details</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {profileData && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ProfileItem label="Name" value={profileData.full_name} />
                  <ProfileItem label="Email" value={profileData.email} />
                  <ProfileItem label="Role" value={profileData.role} />
                  <ProfileItem label="Phone" value={profileData.phone} />
                  <ProfileItem
                    label="Date of Birth"
                    value={
                      profileData.dob
                        ? new Date(profileData.dob).toLocaleDateString()
                        : "Not provided"
                    }
                  />
                  <ProfileItem
                    label="Gender"
                    value={
                      profileData.gender === "M"
                        ? "Male"
                        : profileData.gender === "F"
                        ? "Female"
                        : "Not specified"
                    }
                  />
                </div>
              )}

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-4 text-primary">Addresses</h3>

                {profileData?.addresses?.length > 0 ? (
                  <div className="space-y-4">
                    {profileData.addresses.map((addr, i) => (
                      <div key={i} className="border border-border rounded-xl p-4 bg-muted-background/30">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <ProfileItem label="Street" value={addr.street} />
                          <ProfileItem label="Flat/Unit" value={addr.flat_no} />
                          <ProfileItem label="City" value={addr.city} />
                          <ProfileItem label="Pincode" value={addr.pincode} />
                          <ProfileItem label="Building" value={addr.building_name} />
                          <ProfileItem label="Role" value={addr.role} />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">No addresses available</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* PASSWORD CARD (right, sticky) */}
          <Card className="bg-background h-fit sticky top-24 border border-border rounded-xl">
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your account password</CardDescription>
            </CardHeader>

            <CardContent>
              {!showPasswordForm ? (
                <Button onClick={() => setShowPasswordForm(true)} className="w-full bg-acc-blue hover:bg-acc-blue/90 text-white font-medium rounded-lg">
                  Change Password
                </Button>
              ) : (
                <form onSubmit={handlePasswordChange} className="space-y-4">

                  <InputBlock
                    id="newPassword"
                    label="New Password"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, newPassword: e.target.value })
                    }
                  />

                  <InputBlock
                    id="confirmNewPassword"
                    label="Confirm New Password"
                    value={passwordData.confirmNewPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        confirmNewPassword: e.target.value,
                      })
                    }
                  />

                  {passwordError && (
                    <p className="text-red-500 text-xs font-medium">{passwordError}</p>
                  )}
                  {passwordSuccess && (
                    <p className="text-green-600 text-xs font-medium">{passwordSuccess}</p>
                  )}

                  <div className="flex gap-2">
                    <Button type="submit" disabled={isChangingPassword} className="flex-1 bg-acc-blue hover:bg-acc-blue/90 text-white font-medium rounded-lg">
                      {isChangingPassword ? "Changing..." : "Submit"}
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1 border border-border hover:bg-muted font-medium rounded-lg"
                      onClick={() => {
                        setShowPasswordForm(false);
                        setPasswordData({ newPassword: "", confirmNewPassword: "" });
                        setPasswordError("");
                        setPasswordSuccess("");
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>

        </div>
      </section>
    </main>
  );
}

function ProfileItem({ label, value }) {
  return (
    <div className="space-y-1">
      <Label className="text-xs text-muted-foreground uppercase tracking-wider">{label}</Label>
      <p className="text-sm font-semibold text-primary">{value || "Not provided"}</p>
    </div>
  );
}

function InputBlock({ label, id, value, onChange }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium text-foreground">{label}</Label>
      <Input
        id={id}
        type="password"
        value={value}
        onChange={onChange}
        required
        minLength={4}
        className="bg-background border border-input rounded-lg h-10 px-3 focus:ring-2 focus:ring-ring focus:border-acc-blue text-sm"
      />
    </div>
  );
}
