"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { db } from "@/lib/firebase/config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";

interface UserData {
  [key: string]: any;
}

export default function ProfilePage() {
  const searchParams = useSearchParams();
  const { user: authUser } = useAuth();
  // Get user ID from URL query parameter, or use auth user ID, or allow manual entry
  const userId = searchParams?.get("id") || authUser?.uid;
  
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editingSection, setEditingSection] = useState<"profile" | "personal" | "address" | null>(null);
  const [formDraft, setFormDraft] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!db) {
        console.error("Firebase Firestore is not initialized");
        setError("Firebase is not initialized");
        setLoading(false);
        return;
      }

      if (!userId) {
        setError("User ID not provided");
        setLoading(false);
        return;
      }

      try {
        const userDocRef = doc(db, "UsersCollection", userId);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          setUser({ id: userDocSnap.id, ...userDocSnap.data() });
        } else {
          setError("User not found");
        }
      } catch (err) {
        console.error("Error fetching user:", err);
        setError("Failed to fetch user details");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  const getUserName = () => {
    if (!user) return "N/A";
    const firstName = user.firstName || "";
    const lastName = user.lastName || "";
    return `${firstName} ${lastName}`.trim() || "N/A";
  };

  const getLocation = () => {
    if (!user?.userAddress) return "N/A";
    const address = user.userAddress;
    return address.area || address.fullAddress || "N/A";
  };

  const formatDate = (date: any) => {
    if (!date) return "N/A";
    if (typeof date === "string") {
      try {
        return new Date(date).toLocaleDateString();
      } catch {
        return date;
      }
    }
    return String(date);
  };

  const formatValue = (value: any): string => {
    if (value === null || value === undefined) return "N/A";
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (Array.isArray(value)) return value.join(", ") || "N/A";
    if (typeof value === "object") {
      if (value.toDate) {
        return new Date(value.toDate()).toLocaleString();
      }
      return JSON.stringify(value, null, 2);
    }
    return String(value);
  };

  const toDateOnly = (v: any): string => {
    if (v == null || v === "") return "";
    if (typeof v === "object" && typeof v.toDate === "function") return v.toDate().toISOString().slice(0, 10);
    if (typeof v === "object" && v.seconds != null) return new Date(v.seconds * 1000).toISOString().slice(0, 10);
    const s = String(v);
    const m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (m) return `${m[1]}-${m[2]}-${m[3]}`;
    const m2 = s.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
    if (m2) return `${m2[3]}-${m2[1].padStart(2, "0")}-${m2[2].padStart(2, "0")}`;
    return "";
  };

  const openProfileForm = () => {
    setSaveError(null);
    setFormDraft({ photo: user?.photo || "", firstName: user?.firstName || "", lastName: user?.lastName || "", role: user?.role || "" });
    setEditingSection("profile");
  };
  const openPersonalForm = () => {
    setSaveError(null);
    setFormDraft({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      gender: user?.gender || "",
      birthDate: toDateOnly(user?.birthDate),
      role: user?.role || "",
      experienceYears: user?.experienceYears ?? "",
      workEmail: user?.workEmail || (user?.userAddress as any)?.workEmail || "",
      workPhone: user?.workPhone || (user?.userAddress as any)?.workPhone || "",
      serviceDescription: user?.serviceDescription || user?.bio || "",
    });
    setEditingSection("personal");
  };
  const openAddressForm = () => {
    setSaveError(null);
    const a = user?.userAddress || {};
    setFormDraft({
      addresstype: a.addresstype || "",
      area: a.area || "",
      flat: a.flat || "",
      near: a.near || "",
      fullAddress: a.fullAddress || "",
      workEmail: a.workEmail || "",
      workPhone: a.workPhone || "",
      latitude: a.latitude ?? "",
      longitude: a.longitude ?? "",
    });
    setEditingSection("address");
  };

  const handleSaveProfile = async () => {
    if (!db || !user?.id) return;
    setSaving(true);
    setSaveError(null);
    try {
      await updateDoc(doc(db, "UsersCollection", user.id), {
        photo: formDraft.photo || null,
        firstName: formDraft.firstName || null,
        lastName: formDraft.lastName || null,
        role: formDraft.role || null,
      });
      setUser((u) => (u ? { ...u, ...formDraft } : null));
      setEditingSection(null);
    } catch (e: any) {
      setSaveError(e?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };
  const handleSavePersonal = async () => {
    if (!db || !user?.id) return;
    setSaving(true);
    setSaveError(null);
    try {
      const payload: Record<string, any> = {
        firstName: formDraft.firstName || null,
        lastName: formDraft.lastName || null,
        email: formDraft.email || null,
        phone: formDraft.phone || null,
        gender: formDraft.gender || null,
        birthDate: formDraft.birthDate || null,
        role: formDraft.role || null,
        experienceYears: formDraft.experienceYears != null && formDraft.experienceYears !== "" ? Number(formDraft.experienceYears) : null,
        workEmail: formDraft.workEmail || null,
        workPhone: formDraft.workPhone || null,
        serviceDescription: formDraft.serviceDescription || null,
      };
      await updateDoc(doc(db, "UsersCollection", user.id), payload);
      setUser((u) => (u ? { ...u, ...payload } : null));
      setEditingSection(null);
    } catch (e: any) {
      setSaveError(e?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };
  const handleSaveAddress = async () => {
    if (!db || !user?.id) return;
    setSaving(true);
    setSaveError(null);
    try {
      const userAddress = {
        ...(user?.userAddress || {}),
        addresstype: formDraft.addresstype || null,
        area: formDraft.area || null,
        flat: formDraft.flat || null,
        near: formDraft.near || null,
        fullAddress: formDraft.fullAddress || null,
        workEmail: formDraft.workEmail || null,
        workPhone: formDraft.workPhone || null,
        latitude: formDraft.latitude != null && formDraft.latitude !== "" ? Number(formDraft.latitude) : null,
        longitude: formDraft.longitude != null && formDraft.longitude !== "" ? Number(formDraft.longitude) : null,
      };
      await updateDoc(doc(db, "UsersCollection", user.id), { userAddress });
      setUser((u) => (u ? { ...u, userAddress } : null));
      setEditingSection(null);
    } catch (e: any) {
      setSaveError(e?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-title-sm font-semibold text-gray-800 dark:text-white">
            Profile
          </h1>
        </div>
        <div className="rounded-2xl bg-white shadow-theme-sm dark:bg-gray-800 p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-title-sm font-semibold text-gray-800 dark:text-white">
            Profile
          </h1>
        </div>
        <div className="rounded-2xl bg-white shadow-theme-sm dark:bg-gray-800 p-6">
          <p className="text-red-600 dark:text-red-400">{error || "User not found"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-title-sm font-semibold text-gray-800 dark:text-white">
          Profile
        </h1>
      </div>

      {/* Profile Header Section */}
      <div className="rounded-2xl bg-white shadow-theme-sm dark:bg-gray-800 p-4 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-title-sm font-semibold text-gray-800 dark:text-white">
            Profile Information
          </h2>
          {editingSection === "profile" ? (
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={() => setEditingSection(null)} disabled={saving}>Cancel</Button>
              <Button size="sm" onClick={handleSaveProfile} disabled={saving}>{saving ? "Saving…" : "Save"}</Button>
            </div>
          ) : (
            <button onClick={openProfileForm} className="px-3 py-2 sm:px-4 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 flex items-center gap-2">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </button>
          )}
        </div>

        {editingSection === "profile" ? (
          <div className="space-y-4 pb-6 border-b border-gray-200 dark:border-gray-700">
            {saveError && <p className="text-sm text-red-600 dark:text-red-400">{saveError}</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="profile-photo">Photo URL</Label>
                <Input id="profile-photo" value={formDraft.photo ?? ""} onChange={(e) => setFormDraft((d: Record<string, any>) => ({ ...d, photo: e.target.value }))} placeholder="https://…" />
              </div>
              <div>
                <Label htmlFor="profile-role">Role</Label>
                <select id="profile-role" value={formDraft.role ?? ""} onChange={(e) => setFormDraft((d: Record<string, any>) => ({ ...d, role: e.target.value }))} className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white">
                  <option value="">—</option>
                  <option value="Customer">Customer</option>
                  <option value="Service Provider">Service Provider</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div>
                <Label htmlFor="profile-firstName">First Name</Label>
                <Input id="profile-firstName" value={formDraft.firstName ?? ""} onChange={(e) => setFormDraft((d: Record<string, any>) => ({ ...d, firstName: e.target.value }))} />
              </div>
              <div>
                <Label htmlFor="profile-lastName">Last Name</Label>
                <Input id="profile-lastName" value={formDraft.lastName ?? ""} onChange={(e) => setFormDraft((d: Record<string, any>) => ({ ...d, lastName: e.target.value }))} />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center sm:items-start pb-4 sm:pb-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex-shrink-0">
              {user.photo ? (
                <img src={user.photo} alt={getUserName()} className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700" onError={(e) => { const t = e.target as HTMLImageElement; t.style.display = "none"; (t.nextElementSibling as HTMLElement)?.style.display = "flex"; }} />
              ) : null}
              <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xl sm:text-2xl font-semibold text-gray-600 dark:text-gray-300 ${user.photo ? "hidden" : ""}`}>
                {getUserName().split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)}
              </div>
            </div>
            <div className="flex-1 min-w-0 w-full sm:w-auto text-center sm:text-left">
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-2">{getUserName()}</h3>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-gray-600 dark:text-gray-400">
                <span className="capitalize">{user.role || "N/A"}</span>
                <span className="hidden sm:inline text-gray-300 dark:text-gray-600">|</span>
                <span className="break-words">{getLocation()}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Personal Information Section */}
      <div className="rounded-2xl bg-white shadow-theme-sm dark:bg-gray-800 p-4 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-title-sm font-semibold text-gray-800 dark:text-white">
            Personal Information
          </h2>
          {editingSection === "personal" ? (
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={() => setEditingSection(null)} disabled={saving}>Cancel</Button>
              <Button size="sm" onClick={handleSavePersonal} disabled={saving}>{saving ? "Saving…" : "Save"}</Button>
            </div>
          ) : (
            <button onClick={openPersonalForm} className="px-3 py-2 sm:px-4 text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-2 text-sm">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </button>
          )}
        </div>

        {editingSection === "personal" ? (
          <div className="space-y-4">
            {saveError && <p className="text-sm text-red-600 dark:text-red-400">{saveError}</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div><Label htmlFor="pi-fn">First Name</Label><Input id="pi-fn" value={formDraft.firstName ?? ""} onChange={(e) => setFormDraft((d: Record<string, any>) => ({ ...d, firstName: e.target.value }))} /></div>
              <div><Label htmlFor="pi-ln">Last Name</Label><Input id="pi-ln" value={formDraft.lastName ?? ""} onChange={(e) => setFormDraft((d: Record<string, any>) => ({ ...d, lastName: e.target.value }))} /></div>
              <div><Label htmlFor="pi-email">Email address</Label><Input id="pi-email" type="email" value={formDraft.email ?? ""} onChange={(e) => setFormDraft((d: Record<string, any>) => ({ ...d, email: e.target.value }))} /></div>
              <div><Label htmlFor="pi-phone">Phone</Label><Input id="pi-phone" value={formDraft.phone ?? ""} onChange={(e) => setFormDraft((d: Record<string, any>) => ({ ...d, phone: e.target.value }))} /></div>
              <div>
                <Label htmlFor="pi-gender">Gender</Label>
                <select id="pi-gender" value={formDraft.gender ?? ""} onChange={(e) => setFormDraft((d: Record<string, any>) => ({ ...d, gender: e.target.value }))} className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white">
                  <option value="">—</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div><Label htmlFor="pi-bd">Birth Date</Label><Input id="pi-bd" type="date" value={formDraft.birthDate ?? ""} onChange={(e) => setFormDraft((d: Record<string, any>) => ({ ...d, birthDate: e.target.value }))} /></div>
              <div>
                <Label htmlFor="pi-role">Role</Label>
                <select id="pi-role" value={formDraft.role ?? ""} onChange={(e) => setFormDraft((d: Record<string, any>) => ({ ...d, role: e.target.value }))} className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white">
                  <option value="">—</option>
                  <option value="Customer">Customer</option>
                  <option value="Service Provider">Service Provider</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div><Label htmlFor="pi-exp">Experience Years</Label><Input id="pi-exp" type="number" min="0" value={formDraft.experienceYears ?? ""} onChange={(e) => setFormDraft((d: Record<string, any>) => ({ ...d, experienceYears: e.target.value }))} /></div>
              <div><Label htmlFor="pi-we">Work Email</Label><Input id="pi-we" type="email" value={formDraft.workEmail ?? ""} onChange={(e) => setFormDraft((d: Record<string, any>) => ({ ...d, workEmail: e.target.value }))} /></div>
              <div><Label htmlFor="pi-wp">Work Phone</Label><Input id="pi-wp" value={formDraft.workPhone ?? ""} onChange={(e) => setFormDraft((d: Record<string, any>) => ({ ...d, workPhone: e.target.value }))} /></div>
              <div className="md:col-span-2">
                <Label htmlFor="pi-bio">Bio</Label>
                <textarea id="pi-bio" value={formDraft.serviceDescription ?? ""} onChange={(e) => setFormDraft((d: Record<string, any>) => ({ ...d, serviceDescription: e.target.value }))} rows={3} className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white" placeholder="Bio" />
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><label className="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-2">First Name</label><p className="text-base text-gray-900 dark:text-white">{user.firstName || "N/A"}</p></div>
            <div><label className="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-2">Last Name</label><p className="text-base text-gray-900 dark:text-white">{user.lastName || "N/A"}</p></div>
            <div><label className="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-2">Email address</label><p className="text-base text-gray-900 dark:text-white">{user.email || "N/A"}</p></div>
            <div><label className="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-2">Phone</label><p className="text-base text-gray-900 dark:text-white">{user.phone || "N/A"}</p></div>
            <div><label className="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-2">Gender</label><p className="text-base text-gray-900 dark:text-white">{user.gender || "N/A"}</p></div>
            <div><label className="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-2">Birth Date</label><p className="text-base text-gray-900 dark:text-white">{formatDate(user.birthDate)}</p></div>
            <div className="md:col-span-2"><label className="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-2">Bio</label><p className="text-base text-gray-900 dark:text-white">{user.serviceDescription || user.bio || "N/A"}</p></div>
            <div><label className="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-2">Role</label><p className="text-base text-gray-900 dark:text-white capitalize">{user.role || "N/A"}</p></div>
            <div><label className="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-2">Experience Years</label><p className="text-base text-gray-900 dark:text-white">{user.experienceYears || "N/A"}</p></div>
            <div><label className="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-2">Work Email</label><p className="text-base text-gray-900 dark:text-white">{user.workEmail || user.userAddress?.workEmail || "N/A"}</p></div>
            <div><label className="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-2">Work Phone</label><p className="text-base text-gray-900 dark:text-white">{user.workPhone || user.userAddress?.workPhone || "N/A"}</p></div>
          </div>
        )}
      </div>

      {/* Address Section */}
      <div className="rounded-2xl bg-white shadow-theme-sm dark:bg-gray-800 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-title-sm font-semibold text-gray-800 dark:text-white">Address</h2>
          {editingSection === "address" ? (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setEditingSection(null)} disabled={saving}>Cancel</Button>
              <Button size="sm" onClick={handleSaveAddress} disabled={saving}>{saving ? "Saving…" : "Save"}</Button>
            </div>
          ) : (
            <button onClick={openAddressForm} className="px-4 py-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </button>
          )}
        </div>

        {editingSection === "address" ? (
          <div className="space-y-4">
            {saveError && <p className="text-sm text-red-600 dark:text-red-400">{saveError}</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div><Label htmlFor="addr-type">Address Type</Label><Input id="addr-type" value={formDraft.addresstype ?? ""} onChange={(e) => setFormDraft((d: Record<string, any>) => ({ ...d, addresstype: e.target.value }))} /></div>
              <div><Label htmlFor="addr-area">Area</Label><Input id="addr-area" value={formDraft.area ?? ""} onChange={(e) => setFormDraft((d: Record<string, any>) => ({ ...d, area: e.target.value }))} /></div>
              <div><Label htmlFor="addr-flat">Flat/Unit</Label><Input id="addr-flat" value={formDraft.flat ?? ""} onChange={(e) => setFormDraft((d: Record<string, any>) => ({ ...d, flat: e.target.value }))} /></div>
              <div><Label htmlFor="addr-near">Near</Label><Input id="addr-near" value={formDraft.near ?? ""} onChange={(e) => setFormDraft((d: Record<string, any>) => ({ ...d, near: e.target.value }))} /></div>
              <div><Label htmlFor="addr-full">Full Address</Label><Input id="addr-full" value={formDraft.fullAddress ?? ""} onChange={(e) => setFormDraft((d: Record<string, any>) => ({ ...d, fullAddress: e.target.value }))} /></div>
              <div><Label htmlFor="addr-we">Work Email</Label><Input id="addr-we" type="email" value={formDraft.workEmail ?? ""} onChange={(e) => setFormDraft((d: Record<string, any>) => ({ ...d, workEmail: e.target.value }))} /></div>
              <div><Label htmlFor="addr-wp">Work Phone</Label><Input id="addr-wp" value={formDraft.workPhone ?? ""} onChange={(e) => setFormDraft((d: Record<string, any>) => ({ ...d, workPhone: e.target.value }))} /></div>
              <div><Label htmlFor="addr-lat">Latitude</Label><Input id="addr-lat" type="number" value={formDraft.latitude != null ? String(formDraft.latitude) : ""} onChange={(e) => setFormDraft((d: Record<string, any>) => ({ ...d, latitude: e.target.value }))} /></div>
              <div><Label htmlFor="addr-lng">Longitude</Label><Input id="addr-lng" type="number" value={formDraft.longitude != null ? String(formDraft.longitude) : ""} onChange={(e) => setFormDraft((d: Record<string, any>) => ({ ...d, longitude: e.target.value }))} /></div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><label className="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-2">Address Type</label><p className="text-base text-gray-900 dark:text-white">{user.userAddress?.addresstype || "N/A"}</p></div>
            <div><label className="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-2">Area</label><p className="text-base text-gray-900 dark:text-white">{user.userAddress?.area || "N/A"}</p></div>
            <div><label className="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-2">Flat/Unit</label><p className="text-base text-gray-900 dark:text-white">{user.userAddress?.flat || "N/A"}</p></div>
            <div><label className="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-2">Near</label><p className="text-base text-gray-900 dark:text-white">{user.userAddress?.near || "N/A"}</p></div>
            <div><label className="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-2">Full Address</label><p className="text-base text-gray-900 dark:text-white">{user.userAddress?.fullAddress || user.userAddress?.area || "N/A"}</p></div>
            <div><label className="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-2">Work Email</label><p className="text-base text-gray-900 dark:text-white">{user.userAddress?.workEmail || "N/A"}</p></div>
            <div><label className="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-2">Work Phone</label><p className="text-base text-gray-900 dark:text-white">{user.userAddress?.workPhone || "N/A"}</p></div>
            <div><label className="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-2">Coordinates</label><p className="text-base text-gray-900 dark:text-white">{user.userAddress?.latitude != null && user.userAddress?.longitude != null ? `${user.userAddress.latitude}, ${user.userAddress.longitude}` : "N/A"}</p></div>
          </div>
        )}
      </div>

      {/* Account Status & Statistics */}
      <div className="rounded-2xl bg-white shadow-theme-sm dark:bg-gray-800 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-title-sm font-semibold text-gray-800 dark:text-white">
            Account Status & Statistics
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-2">
              Account Status
            </label>
            <p className="text-base text-gray-900 dark:text-white">
              {String(user.status || "").toLowerCase() === "true" || String(user.status || "").toLowerCase() === "isbanned"
                ? "Banned"
                : user.isVerified
                ? "Verified"
                : "Unverified"}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-2">
              Is Active
            </label>
            <p className="text-base text-gray-900 dark:text-white">
              {user.isActive ? "Yes" : "No"}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-2">
              Is Online
            </label>
            <p className="text-base text-gray-900 dark:text-white">
              {user.isOnline ? "Yes" : "No"}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-2">
              Is Busy
            </label>
            <p className="text-base text-gray-900 dark:text-white">
              {user.isBusy ? "Yes" : "No"}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-2">
              Complete Bookings
            </label>
            <p className="text-base text-gray-900 dark:text-white">
              {user.completeBookingCount || 0}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-2">
              Total Booking Requests
            </label>
            <p className="text-base text-gray-900 dark:text-white">
              {user.totalBookingRequested || 0}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-2">
              Ignore Count
            </label>
            <p className="text-base text-gray-900 dark:text-white">
              {user.ignoreCount || 0}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-2">
              Stripe Account Verified
            </label>
            <p className="text-base text-gray-900 dark:text-white">
              {user.stripeAccountVerified ? "Yes" : "No"}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-2">
              Stripe Connect Account ID
            </label>
            <p className="text-base text-gray-900 dark:text-white font-mono text-sm">
              {user.stripeConnectAccountId || "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* Services & Skills Section */}
      {(user.servicesOffered || user.skillsList || user.certificate) && (
        <div className="rounded-2xl bg-white shadow-theme-sm dark:bg-gray-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-title-sm font-semibold text-gray-800 dark:text-white">
              Services & Skills
            </h2>
          </div>

          <div className="space-y-6">
            {user.servicesOffered && Array.isArray(user.servicesOffered) && user.servicesOffered.length > 0 && (
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-2">
                  Services Offered
                </label>
                <div className="flex flex-wrap gap-2">
                  {user.servicesOffered.map((service: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-sm"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {user.skillsList && (
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-2">
                  Skills List
                </label>
                <p className="text-base text-gray-900 dark:text-white">
                  {formatValue(user.skillsList)}
                </p>
              </div>
            )}

            {user.certificate && (
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-2">
                  Certificate
                </label>
                <a
                  href={user.certificate}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400 underline"
                >
                  View Certificate
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Location Data */}
      {(user.currentLat || user.currentLng) && (
        <div className="rounded-2xl bg-white shadow-theme-sm dark:bg-gray-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-title-sm font-semibold text-gray-800 dark:text-white">
              Current Location
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-2">
                Latitude
              </label>
              <p className="text-base text-gray-900 dark:text-white">
                {user.currentLat || "N/A"}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-2">
                Longitude
              </label>
              <p className="text-base text-gray-900 dark:text-white">
                {user.currentLng || "N/A"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
