"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { db, storage } from "@/lib/firebase/config";
import { doc, getDoc, collection, getDocs, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/useModal";

interface UserData {
  [key: string]: any;
}

export default function UserDetail() {
  const params = useParams();
  const userId = params.id as string;
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [services, setServices] = useState<Record<string, any>>({});
  const { isOpen: isEditOpen, openModal: openEditModal, closeModal: closeEditModal } = useModal(false);
  const [formDraft, setFormDraft] = useState<Record<string, any>>({});
  const [addServiceId, setAddServiceId] = useState("");
  const [photoUploading, setPhotoUploading] = useState(false);
  const [photoUploadError, setPhotoUploadError] = useState<string | null>(null);
  const [certificateUploading, setCertificateUploading] = useState(false);
  const [certificateUploadError, setCertificateUploadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [banning, setBanning] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      if (!db) {
        console.error("Firebase Firestore is not initialized");
        setError("Firebase is not initialized");
        setLoading(false);
        return;
      }

      try {
        const userDocRef = doc(db, "UsersCollection", userId);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData: UserData = { id: userDocSnap.id, ...userDocSnap.data() };
          setUser(userData);

          // Always fetch all services for the edit-form dropdown and display
          try {
            const servicesCollection = collection(db, "ServiceCollection");
            const servicesSnapshot = await getDocs(servicesCollection);
            const servicesMap: Record<string, any> = {};
            servicesSnapshot.docs.forEach((serviceDoc) => {
              servicesMap[serviceDoc.id] = { id: serviceDoc.id, ...serviceDoc.data() };
            });
            setServices(servicesMap);
          } catch (serviceErr) {
            console.error("Error fetching services:", serviceErr);
          }
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
        return date;
      } catch {
        return date;
      }
    }
    return String(date);
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

  const openEditForm = () => {
    setSaveError(null);
    setPhotoUploadError(null);
    setCertificateUploadError(null);
    const a = user?.userAddress || {};
    setFormDraft({
      id: user?.id || "",
      photo: user?.photo || "",
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      gender: user?.gender || "",
      birthDate: toDateOnly(user?.birthDate),
      role: user?.role || "",
      experienceYears: user?.experienceYears ?? "",
      workEmail: user?.workEmail || a.workEmail || "",
      workPhone: user?.workPhone || a.workPhone || "",
      serviceDescription: user?.serviceDescription || user?.bio || "",
      certificate: user?.certificate || "",
      completeBookingCount: user?.completeBookingCount ?? "",
      currentLat: user?.currentLat ?? "",
      currentLng: user?.currentLng ?? "",
      fcmToken: user?.fcmToken || "",
      ignoreCount: user?.ignoreCount ?? "",
      isActive: user?.isActive ?? true,
      isBusy: user?.isBusy ?? false,
      isOnline: user?.isOnline ?? false,
      isVerified: user?.isVerified ?? false,
      password: "",
      salt: user?.salt || "",
      stripeAccountVerified: user?.stripeAccountVerified ?? false,
      stripeConnectAccountId: user?.stripeConnectAccountId || "",
      totalBookingRequested: user?.totalBookingRequested ?? "",
      servicesOffered: Array.isArray(user?.servicesOffered) ? [...user.servicesOffered] : [],
      skillsList: user?.skillsList != null ? (Array.isArray(user.skillsList) ? user.skillsList.join(", ") : String(user.skillsList)) : "",
      addresstype: a.addresstype || "",
      area: a.area || "",
      flat: a.flat || "",
      near: a.near || "",
      fullAddress: a.fullAddress || "",
      addressId: a.id || "",
      latitude: a.latitude ?? "",
      longitude: a.longitude ?? "",
      addressWorkEmail: a.workEmail || user?.workEmail || "",
      addressWorkPhone: a.workPhone || user?.workPhone || "",
    });
    setAddServiceId("");
    openEditModal();
  };

  const getServiceName = (id: string) => services[id]?.name || services[id]?.title || id;

  const isUserBanned = () => ["true", "isbanned", "yes"].includes(String(user?.status || "").toLowerCase());
  const isUserVerified = () => user?.isVerified === true || String(user?.isVerified || "").toLowerCase() === "true" || String(user?.isVerified || "").toLowerCase() === "verified";

  const handleVerify = async () => {
    if (!db || !userId || !user) return;
    setVerifying(true);
    try {
      const newValue = !isUserVerified();
      await updateDoc(doc(db, "UsersCollection", userId), { isVerified: newValue });
      setUser((u) => (u ? { ...u, isVerified: newValue } : null));
    } catch (e: any) {
      console.error("Verify update failed:", e);
    } finally {
      setVerifying(false);
    }
  };

  const handleBan = async () => {
    if (!db || !userId || !user) return;
    setBanning(true);
    try {
      const isBanned = isUserBanned();
      const newStatus = isBanned ? "" : "isBanned";
      const newIsVerified = isBanned ? true : false; // Unban: set to true, Ban: set to false

      await updateDoc(doc(db, "UsersCollection", userId), {
        status: newStatus,
        isVerified: newIsVerified
      });
      setUser((u) => (u ? { ...u, status: newStatus, isVerified: newIsVerified } : null));
    } catch (e: any) {
      console.error("Ban update failed:", e);
    } finally {
      setBanning(false);
    }
  };

  const uploadPhoto = async (file: File) => {
    if (!storage || !userId) return;
    setPhotoUploading(true);
    setPhotoUploadError(null);
    try {
      const storageRef = ref(storage, `Users/${userId}`);
      await uploadBytes(storageRef, file, { contentType: file.type || "image/jpeg" });
      const url = await getDownloadURL(storageRef);
      setFormDraft((d: Record<string, any>) => ({ ...d, photo: url }));

      // Update user document in Firestore immediately with the new photo URL
      if (db) {
        try {
          await updateDoc(doc(db, "UsersCollection", userId), { photo: url });
          setUser((u) => (u ? { ...u, photo: url } : null));
        } catch (e2: any) {
          setPhotoUploadError(e2?.message || "Photo saved to Storage, but updating user failed.");
        }
      }
    } catch (e: any) {
      setPhotoUploadError(e?.message || "Photo upload failed");
    } finally {
      setPhotoUploading(false);
    }
  };

  const uploadCertificate = async (file: File) => {
    if (!storage || !userId) return;
    setCertificateUploading(true);
    setCertificateUploadError(null);
    try {
      const storageRef = ref(storage, `Users/${userId}_certificate`);
      await uploadBytes(storageRef, file, { contentType: file.type || "image/jpeg" });
      const url = await getDownloadURL(storageRef);
      setFormDraft((d: Record<string, any>) => ({ ...d, certificate: url }));

      // Update user document in Firestore immediately with the new certificate URL
      if (db) {
        try {
          await updateDoc(doc(db, "UsersCollection", userId), { certificate: url });
          setUser((u) => (u ? { ...u, certificate: url } : null));
        } catch (e2: any) {
          setCertificateUploadError(e2?.message || "Certificate saved to Storage, but updating user failed.");
        }
      }
    } catch (e: any) {
      setCertificateUploadError(e?.message || "Certificate upload failed");
    } finally {
      setCertificateUploading(false);
    }
  };

  const handleSaveAll = async () => {
    if (!db || !userId || !user) return;
    setSaving(true);
    setSaveError(null);
    try {
      const servicesArr = Array.isArray(formDraft.servicesOffered) ? formDraft.servicesOffered : [];
      const skillsArr = (formDraft.skillsList || "")
        .split(/[,\n]/)
        .map((s: string) => s.trim())
        .filter(Boolean);

      const userAddress = {
        ...(user.userAddress || {}),
        addresstype: formDraft.addresstype || null,
        area: formDraft.area || null,
        flat: formDraft.flat || null,
        near: formDraft.near || null,
        fullAddress: formDraft.fullAddress || null,
        workEmail: formDraft.addressWorkEmail || formDraft.workEmail || null,
        workPhone: formDraft.addressWorkPhone || formDraft.workPhone || null,
        latitude: formDraft.latitude != null && formDraft.latitude !== "" ? String(formDraft.latitude) : null,
        longitude: formDraft.longitude != null && formDraft.longitude !== "" ? String(formDraft.longitude) : null,
      };
      if (formDraft.addressId) (userAddress as any).id = formDraft.addressId;

      const payload: Record<string, any> = {
        photo: formDraft.photo || null,
        firstName: formDraft.firstName || null,
        lastName: formDraft.lastName || null,
        email: formDraft.email || null,
        phone: formDraft.phone || null,
        gender: formDraft.gender || null,
        birthDate: formDraft.birthDate || null,
        role: formDraft.role || null,
        experienceYears: formDraft.experienceYears != null && formDraft.experienceYears !== "" ? String(formDraft.experienceYears) : null,
        workEmail: formDraft.workEmail || null,
        workPhone: formDraft.workPhone || null,
        serviceDescription: formDraft.serviceDescription || null,
        certificate: formDraft.certificate || null,
        completeBookingCount: formDraft.completeBookingCount !== "" ? Number(formDraft.completeBookingCount) : null,
        currentLat: formDraft.currentLat !== "" ? Number(formDraft.currentLat) : null,
        currentLng: formDraft.currentLng !== "" ? Number(formDraft.currentLng) : null,
        fcmToken: formDraft.fcmToken || null,
        ignoreCount: formDraft.ignoreCount !== "" ? Number(formDraft.ignoreCount) : null,
        isActive: !!formDraft.isActive,
        isBusy: !!formDraft.isBusy,
        isOnline: !!formDraft.isOnline,
        isVerified: !!formDraft.isVerified,
        stripeAccountVerified: !!formDraft.stripeAccountVerified,
        stripeConnectAccountId: formDraft.stripeConnectAccountId || null,
        totalBookingRequested: formDraft.totalBookingRequested !== "" ? Number(formDraft.totalBookingRequested) : null,
        servicesOffered: servicesArr,
        skillsList: skillsArr.length > 0 ? skillsArr : null,
        userAddress,
      };
      if (formDraft.password && formDraft.password.trim()) (payload as any).password = formDraft.password.trim();
      if (formDraft.salt != null && formDraft.salt !== "") (payload as any).salt = formDraft.salt;

      await updateDoc(doc(db, "UsersCollection", userId), payload);
      setUser((u) => (u ? { ...u, ...payload } : null));
      closeEditModal();
    } catch (e: any) {
      setSaveError(e?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-xl sm:text-title-sm font-semibold text-gray-800 dark:text-white">
            Profile
          </h1>
          <Link
            href="/adminconsole/users"
            className="self-start px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 text-sm sm:text-base whitespace-nowrap"
          >
            Back to Users
          </Link>
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
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-xl sm:text-title-sm font-semibold text-gray-800 dark:text-white">
            Profile
          </h1>
          <Link
            href="/adminconsole/users"
            className="self-start px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 text-sm sm:text-base whitespace-nowrap"
          >
            Back to Users
          </Link>
        </div>
        <div className="rounded-2xl bg-white shadow-theme-sm dark:bg-gray-800 p-6">
          <p className="text-red-600 dark:text-red-400">{error || "User not found"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl sm:text-title-sm font-semibold text-gray-800 dark:text-white">
          Profile
        </h1>
        <Link
          href="/adminconsole/users"
          className="self-start px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 text-sm sm:text-base whitespace-nowrap"
        >
          Back to Users
        </Link>
      </div>

      {/* Profile Header Section */}
      <div className="rounded-2xl bg-white shadow-theme-sm dark:bg-gray-800 p-4 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-title-sm font-semibold text-gray-800 dark:text-white">
            Profile Information
          </h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleVerify}
              disabled={verifying}
              className={`px-3 py-2 sm:px-4 rounded-lg flex items-center gap-1.5 sm:gap-2 text-white text-sm transition-colors ${isUserVerified() ? "bg-gray-500 hover:bg-gray-600" : "bg-green-600 hover:bg-green-700"}`}
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{verifying ? "…" : isUserVerified() ? "Unverify" : "Verify"}</span>
            </button>
            <button
              onClick={handleBan}
              disabled={banning}
              className={`px-3 py-2 sm:px-4 rounded-lg flex items-center gap-1.5 sm:gap-2 text-white text-sm transition-colors ${isUserBanned() ? "bg-gray-500 hover:bg-gray-600" : "bg-red-600 hover:bg-red-700"}`}
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
              <span>{banning ? "…" : isUserBanned() ? "Unban" : "Ban"}</span>
            </button>
            <button
              onClick={openEditForm}
              className="px-3 py-2 sm:px-4 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 flex items-center gap-1.5 sm:gap-2"
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span>Edit</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center sm:items-start pb-4 sm:pb-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex-shrink-0">
            {user.photo ? (
              <img
                src={user.photo}
                alt={getUserName()}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = "flex";
                }}
              />
            ) : null}
            <div
              className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xl sm:text-2xl font-semibold text-gray-600 dark:text-gray-300 ${user.photo ? "hidden" : ""}`}
            >
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
      </div>

      {/* Personal Information Section */}
      <div className="p-4 sm:p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 bg-white dark:bg-gray-800">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white">
                Personal Information
              </h4>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
              <div><p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">First Name</p><p className="text-sm font-medium text-gray-800 dark:text-white">{user.firstName || "N/A"}</p></div>
              <div><p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Last Name</p><p className="text-sm font-medium text-gray-800 dark:text-white">{user.lastName || "N/A"}</p></div>
              <div><p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Email address</p><p className="text-sm font-medium text-gray-800 dark:text-white">{user.email || "N/A"}</p></div>
              <div><p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Phone</p><p className="text-sm font-medium text-gray-800 dark:text-white">{user.phone || "N/A"}</p></div>
              <div><p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Gender</p><p className="text-sm font-medium text-gray-800 dark:text-white">{user.gender || "N/A"}</p></div>
              <div><p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Birth Date</p><p className="text-sm font-medium text-gray-800 dark:text-white">{formatDate(user.birthDate)}</p></div>
              <div><p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Role</p><p className="text-sm font-medium text-gray-800 dark:text-white capitalize">{user.role || "N/A"}</p></div>
              <div><p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Experience Years</p><p className="text-sm font-medium text-gray-800 dark:text-white">{user.experienceYears ?? "N/A"}</p></div>
              <div><p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Work Email</p><p className="text-sm font-medium text-gray-800 dark:text-white">{user.workEmail || "N/A"}</p></div>
              <div><p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Work Phone</p><p className="text-sm font-medium text-gray-800 dark:text-white">{user.workPhone || "N/A"}</p></div>
              <div><p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Stripe Connect Account ID</p><p className="text-sm font-medium text-gray-800 dark:text-white font-mono break-all">{user.stripeConnectAccountId || "N/A"}</p></div>
              <div><p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Stripe Account Verified</p><p className="text-sm font-medium text-gray-800 dark:text-white">{user.stripeAccountVerified ? "Yes" : "No"}</p></div>
              {user.certificate && (
                <div>
                  <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Certificate</p>
                  <div className="mt-2">
                    <a href={user.certificate} target="_blank" rel="noopener noreferrer" className="inline-block cursor-pointer hover:opacity-80 transition-opacity">
                      <img src={user.certificate} alt="Certificate" className="w-32 h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm" onError={(e) => { const t = e.target as HTMLImageElement; t.style.display = "none"; (t.nextElementSibling as HTMLElement)?.style.setProperty("display", "block"); }} />
                    </a>
                    <div className="hidden text-sm text-red-600 dark:text-red-400 mt-2">Failed to load certificate image</div>
                  </div>
                </div>
              )}
              <div className="lg:col-span-2"><p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Bio</p><p className="text-sm font-medium text-gray-800 dark:text-white">{user.serviceDescription || user.bio || "N/A"}</p></div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Statistics Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
        {/* Complete Booking Count Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 dark:border-gray-800 dark:bg-gray-800 md:p-6">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            <svg className="w-6 h-6 text-gray-800 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <div className="flex items-end justify-between mt-5">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Complete Booking Count
              </span>
              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white">
                {user.completeBookingCount ?? 0}
              </h4>
            </div>
          </div>
        </div>

        {/* Total Booking Requested Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 dark:border-gray-800 dark:bg-gray-800 md:p-6">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            <svg className="w-6 h-6 text-gray-800 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>

          <div className="flex items-end justify-between mt-5">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Total Booking Requested
              </span>
              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white">
                {user.totalBookingRequested ?? 0}
              </h4>
            </div>
          </div>
        </div>
      </div>

      {/* Address Section */}
      <div className="p-4 sm:p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 bg-white dark:bg-gray-800">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white">Address</h4>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
              <div><p className="mb-2 text-xs text-gray-500 dark:text-gray-400">Address Type</p><p className="text-sm font-medium text-gray-800 dark:text-white">{user.userAddress?.addresstype || "N/A"}</p></div>
              <div><p className="mb-2 text-xs text-gray-500 dark:text-gray-400">Area</p><p className="text-sm font-medium text-gray-800 dark:text-white">{user.userAddress?.area || "N/A"}</p></div>
              <div><p className="mb-2 text-xs text-gray-500 dark:text-gray-400">Flat/Unit</p><p className="text-sm font-medium text-gray-800 dark:text-white">{user.userAddress?.flat || "N/A"}</p></div>
              <div><p className="mb-2 text-xs text-gray-500 dark:text-gray-400">Near</p><p className="text-sm font-medium text-gray-800 dark:text-white">{user.userAddress?.near || "N/A"}</p></div>
              <div><p className="mb-2 text-xs text-gray-500 dark:text-gray-400">Full Address</p><p className="text-sm font-medium text-gray-800 dark:text-white">{user.userAddress?.fullAddress || user.userAddress?.area || "N/A"}</p></div>
              <div><p className="mb-2 text-xs text-gray-500 dark:text-gray-400">Coordinates</p><p className="text-sm font-medium text-gray-800 dark:text-white">{user.userAddress?.latitude != null && user.userAddress?.longitude != null ? `${user.userAddress.latitude}, ${user.userAddress.longitude}` : "N/A"}</p></div>
            </div>
          </div>
        </div>
      </div>

      {/* Services & Skills Section */}
      <div className="p-4 sm:p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 bg-white dark:bg-gray-800">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="w-full">
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white lg:mb-6">
              Services & Skills
            </h4>

            <div className="space-y-6">
              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Services Offered
                </p>
                {user.servicesOffered && Array.isArray(user.servicesOffered) && user.servicesOffered.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {user.servicesOffered.map((serviceId: string, index: number) => {
                      const service = services[serviceId];
                      const serviceName = service?.name || service?.title || serviceId;
                      return (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-sm"
                        >
                          {serviceName}
                        </span>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm font-medium text-gray-800 dark:text-white">
                    N/A
                  </p>
                )}
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Skills List
                </p>
                {user.skillsList ? (
                  Array.isArray(user.skillsList) && user.skillsList.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {user.skillsList.map((skill: string, index: number) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm font-medium text-gray-800 dark:text-white">
                      {String(user.skillsList)}
                    </p>
                  )
                ) : (
                  <p className="text-sm font-medium text-gray-800 dark:text-white">
                    N/A
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Current Location Section */}
      {(user.currentLat || user.currentLng) && (
        <div className="p-4 sm:p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 bg-white dark:bg-gray-800">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white lg:mb-6">
                Current Location
              </h4>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
                <div>
                  <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                    Latitude
                  </p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white">
                    {user.currentLat || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                    Longitude
                  </p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white">
                    {user.currentLng || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal - single form with all fields */}
      <Modal isOpen={isEditOpen} onClose={closeEditModal} className="max-w-3xl m-4 max-h-[90vh] overflow-hidden">
        <div className="flex flex-col max-h-[85vh]">
          <div className="p-6 pb-4 border-b border-gray-200 dark:border-gray-700 shrink-0">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Edit User</h3>
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto p-6">
            {saveError && <p className="text-sm text-red-600 dark:text-red-400 mb-4">{saveError}</p>}
            <div className="space-y-6">
              {/* Basic / Profile */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Basic</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><Label htmlFor="edit-id">ID</Label><Input id="edit-id" value={formDraft.id ?? ""} disabled placeholder="Read-only" /></div>
                  <div className="sm:col-span-2">
                    <Label>Photo</Label>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 mb-2">Upload saves as Users/{userId}. The photo URL is written to the user document right after upload. You can also paste a URL and Save.</p>
                    <div className="flex flex-wrap items-start gap-4">
                      {(formDraft.photo ?? "") && (
                        <div className="flex-shrink-0">
                          <img src={formDraft.photo} alt="Preview" className="w-16 h-16 rounded-lg object-cover border border-gray-200 dark:border-gray-700" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                        </div>
                      )}
                      <div className="flex-1 min-w-0 space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                          <label className="cursor-pointer">
                            <span className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                              {photoUploading ? "Uploading…" : "Upload photo"}
                            </span>
                            <input type="file" accept="image/*" className="sr-only" disabled={photoUploading} onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadPhoto(f); e.target.value = ""; }} />
                          </label>
                        </div>
                        {photoUploadError && <p className="text-xs text-red-600 dark:text-red-400">{photoUploadError}</p>}
                        <div>
                          <Label htmlFor="edit-photo" className="text-xs text-gray-500">Or paste URL</Label>
                          <Input id="edit-photo" value={formDraft.photo ?? ""} onChange={(e) => setFormDraft((d: Record<string, any>) => ({ ...d, photo: e.target.value }))} placeholder="https://…" className="mt-1" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div><Label htmlFor="edit-firstName">First Name</Label><Input id="edit-firstName" value={formDraft.firstName ?? ""} onChange={(e) => setFormDraft((d: Record<string, any>) => ({ ...d, firstName: e.target.value }))} /></div>
                  <div><Label htmlFor="edit-lastName">Last Name</Label><Input id="edit-lastName" value={formDraft.lastName ?? ""} onChange={(e) => setFormDraft((d: Record<string, any>) => ({ ...d, lastName: e.target.value }))} /></div>
                  <div><Label htmlFor="edit-email">Email</Label><Input id="edit-email" type="email" value={formDraft.email ?? ""} onChange={(e) => setFormDraft((d: Record<string, any>) => ({ ...d, email: e.target.value }))} /></div>
                  <div><Label htmlFor="edit-phone">Phone</Label><Input id="edit-phone" value={formDraft.phone ?? ""} onChange={(e) => setFormDraft((d: Record<string, any>) => ({ ...d, phone: e.target.value }))} /></div>
                  <div>
                    <Label htmlFor="edit-gender">Gender</Label>
                    <select id="edit-gender" value={formDraft.gender ?? ""} onChange={(e) => setFormDraft((d: Record<string, any>) => ({ ...d, gender: e.target.value }))} className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white">
                      <option value="">—</option><option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option>
                    </select>
                  </div>
                  <div><Label htmlFor="edit-birthDate">Birth Date</Label><Input id="edit-birthDate" type="date" value={formDraft.birthDate ?? ""} onChange={(e) => setFormDraft((d: Record<string, any>) => ({ ...d, birthDate: e.target.value }))} /></div>
                  <div>
                    <Label htmlFor="edit-role">Role</Label>
                    <select id="edit-role" value={formDraft.role ?? ""} onChange={(e) => setFormDraft((d: Record<string, any>) => ({ ...d, role: e.target.value }))} className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white">
                      <option value="">—</option><option value="customer">Customer</option><option value="provider">Provider</option>
                    </select>
                  </div>
                  <div><Label htmlFor="edit-experienceYears">Experience Years</Label><Input id="edit-experienceYears" value={formDraft.experienceYears ?? ""} onChange={(e) => setFormDraft((d: Record<string, any>) => ({ ...d, experienceYears: e.target.value }))} /></div>
                  <div><Label htmlFor="edit-workEmail">Work Email</Label><Input id="edit-workEmail" type="email" value={formDraft.workEmail ?? ""} onChange={(e) => setFormDraft((d: Record<string, any>) => ({ ...d, workEmail: e.target.value }))} /></div>
                  <div><Label htmlFor="edit-workPhone">Work Phone</Label><Input id="edit-workPhone" value={formDraft.workPhone ?? ""} onChange={(e) => setFormDraft((d: Record<string, any>) => ({ ...d, workPhone: e.target.value }))} /></div>
                  <div className="sm:col-span-2"><Label htmlFor="edit-serviceDescription">Service Description / Bio</Label><textarea id="edit-serviceDescription" value={formDraft.serviceDescription ?? ""} onChange={(e) => setFormDraft((d: Record<string, any>) => ({ ...d, serviceDescription: e.target.value }))} rows={2} className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white" /></div>
                </div>
              </div>

              {/* Certificate, Services, Skills */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Certificate & Services</h4>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label>Certificate</Label>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 mb-2">Upload saves as Users/{userId}_certificate. The URL is written to the user document right after upload. You can also paste a URL and Save.</p>
                    <div className="flex flex-wrap items-start gap-4">
                      {(formDraft.certificate ?? "") && (
                        <div className="flex-shrink-0">
                          <a href={formDraft.certificate} target="_blank" rel="noopener noreferrer" className="block">
                            <img src={formDraft.certificate} alt="Certificate" className="w-16 h-16 rounded-lg object-cover border border-gray-200 dark:border-gray-700" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                          </a>
                        </div>
                      )}
                      <div className="flex-1 min-w-0 space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                          <label className="cursor-pointer">
                            <span className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                              {certificateUploading ? "Uploading…" : "Upload certificate"}
                            </span>
                            <input type="file" accept="image/*" className="sr-only" disabled={certificateUploading} onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadCertificate(f); e.target.value = ""; }} />
                          </label>
                        </div>
                        {certificateUploadError && <p className="text-xs text-red-600 dark:text-red-400">{certificateUploadError}</p>}
                        <div>
                          <Label htmlFor="edit-certificate" className="text-xs text-gray-500">Or paste URL</Label>
                          <Input id="edit-certificate" value={formDraft.certificate ?? ""} onChange={(e) => setFormDraft((d: Record<string, any>) => ({ ...d, certificate: e.target.value }))} placeholder="https://…" className="mt-1" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label>Services Offered</Label>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 mb-2">Add or remove services. Selected IDs are saved on update.</p>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {(Array.isArray(formDraft.servicesOffered) ? formDraft.servicesOffered : []).map((id: string) => (
                        <span
                          key={id}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg text-sm"
                        >
                          {getServiceName(id)}
                          <button
                            type="button"
                            onClick={() => setFormDraft((d: Record<string, any>) => ({
                              ...d,
                              servicesOffered: (Array.isArray(d.servicesOffered) ? d.servicesOffered : []).filter((x: string) => x !== id),
                            }))}
                            className="p-0.5 rounded hover:bg-blue-200 dark:hover:bg-blue-800/40 text-current"
                            aria-label={`Remove ${getServiceName(id)}`}
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <select
                        value={addServiceId}
                        onChange={(e) => {
                          const v = e.target.value;
                          if (v) {
                            setFormDraft((d: Record<string, any>) => ({
                              ...d,
                              servicesOffered: [...(Array.isArray(d.servicesOffered) ? d.servicesOffered : []), v],
                            }));
                            setAddServiceId("");
                          }
                        }}
                        className="h-10 flex-1 rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                      >
                        <option value="">Add a service…</option>
                        {Object.entries(services)
                          .filter(([id]) => !(Array.isArray(formDraft.servicesOffered) ? formDraft.servicesOffered : []).includes(id))
                          .map(([id, s]) => (
                            <option key={id} value={id}>{getServiceName(id)}</option>
                          ))}
                      </select>
                    </div>
                    {Object.keys(services).length === 0 && (
                      <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">Loading services…</p>
                    )}
                  </div>
                  <div><Label htmlFor="edit-skillsList">Skills List (comma or newline)</Label><textarea id="edit-skillsList" value={formDraft.skillsList ?? ""} onChange={(e) => setFormDraft((d: Record<string, any>) => ({ ...d, skillsList: e.target.value }))} rows={2} className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white" /></div>
                </div>
              </div>

              {/* Numbers */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Booking & Counts</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div><Label htmlFor="edit-completeBookingCount">Complete Booking Count</Label><Input id="edit-completeBookingCount" type="number" value={formDraft.completeBookingCount ?? ""} onChange={(e) => setFormDraft((d: Record<string, any>) => ({ ...d, completeBookingCount: e.target.value }))} /></div>
                  <div><Label htmlFor="edit-ignoreCount">Ignore Count</Label><Input id="edit-ignoreCount" type="number" value={formDraft.ignoreCount ?? ""} onChange={(e) => setFormDraft((d: Record<string, any>) => ({ ...d, ignoreCount: e.target.value }))} /></div>
                  <div><Label htmlFor="edit-totalBookingRequested">Total Booking Requested</Label><Input id="edit-totalBookingRequested" type="number" value={formDraft.totalBookingRequested ?? ""} onChange={(e) => setFormDraft((d: Record<string, any>) => ({ ...d, totalBookingRequested: e.target.value }))} /></div>
                </div>
              </div>

              {/* Location */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Current Location</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><Label htmlFor="edit-currentLat">Current Latitude</Label><Input id="edit-currentLat" type="number" step={0.0000001} value={formDraft.currentLat != null ? String(formDraft.currentLat) : ""} onChange={(e) => setFormDraft((d: Record<string, any>) => ({ ...d, currentLat: e.target.value }))} /></div>
                  <div><Label htmlFor="edit-currentLng">Current Longitude</Label><Input id="edit-currentLng" type="number" step={0.0000001} value={formDraft.currentLng != null ? String(formDraft.currentLng) : ""} onChange={(e) => setFormDraft((d: Record<string, any>) => ({ ...d, currentLng: e.target.value }))} /></div>
                </div>
              </div>

              {/* Booleans */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Status Flags</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={!!formDraft.isActive} onChange={(e) => setFormDraft((d: Record<string, any>) => ({ ...d, isActive: e.target.checked }))} className="rounded border-gray-300" /> Is Active</label>
                  <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={!!formDraft.isBusy} onChange={(e) => setFormDraft((d: Record<string, any>) => ({ ...d, isBusy: e.target.checked }))} className="rounded border-gray-300" /> Is Busy</label>
                  <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={!!formDraft.isOnline} onChange={(e) => setFormDraft((d: Record<string, any>) => ({ ...d, isOnline: e.target.checked }))} className="rounded border-gray-300" /> Is Online</label>
                  <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={!!formDraft.isVerified} onChange={(e) => setFormDraft((d: Record<string, any>) => ({ ...d, isVerified: e.target.checked }))} className="rounded border-gray-300" /> Is Verified</label>
                  <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={!!formDraft.stripeAccountVerified} onChange={(e) => setFormDraft((d: Record<string, any>) => ({ ...d, stripeAccountVerified: e.target.checked }))} className="rounded border-gray-300" /> Stripe Verified</label>
                </div>
              </div>

              {/* Stripe */}
              <div>
                <Label htmlFor="edit-stripeConnectAccountId">Stripe Connect Account ID</Label>
                <Input id="edit-stripeConnectAccountId" value={formDraft.stripeConnectAccountId ?? ""} onChange={(e) => setFormDraft((d: Record<string, any>) => ({ ...d, stripeConnectAccountId: e.target.value }))} />
              </div>

              {/* Technical */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Technical</h4>
                <div className="grid grid-cols-1 gap-4">
                  <div><Label htmlFor="edit-fcmToken">FCM Token</Label><Input id="edit-fcmToken" value={formDraft.fcmToken ?? ""} onChange={(e) => setFormDraft((d: Record<string, any>) => ({ ...d, fcmToken: e.target.value }))} /></div>
                  <div><Label htmlFor="edit-password">Password (leave blank to keep)</Label><Input id="edit-password" type="password" value={formDraft.password ?? ""} onChange={(e) => setFormDraft((d: Record<string, any>) => ({ ...d, password: e.target.value }))} placeholder="Leave blank to keep current" /></div>
                  <div><Label htmlFor="edit-salt">Salt</Label><Input id="edit-salt" value={formDraft.salt ?? ""} onChange={(e) => setFormDraft((d: Record<string, any>) => ({ ...d, salt: e.target.value }))} /></div>
                </div>
              </div>

              {/* User Address */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">User Address</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><Label htmlFor="edit-addressId">Address ID</Label><Input id="edit-addressId" value={formDraft.addressId ?? ""} onChange={(e) => setFormDraft((d: Record<string, any>) => ({ ...d, addressId: e.target.value }))} /></div>
                  <div><Label htmlFor="edit-addresstype">Address Type</Label><Input id="edit-addresstype" value={formDraft.addresstype ?? ""} onChange={(e) => setFormDraft((d: Record<string, any>) => ({ ...d, addresstype: e.target.value }))} /></div>
                  <div><Label htmlFor="edit-area">Area</Label><Input id="edit-area" value={formDraft.area ?? ""} onChange={(e) => setFormDraft((d: Record<string, any>) => ({ ...d, area: e.target.value }))} /></div>
                  <div><Label htmlFor="edit-flat">Flat</Label><Input id="edit-flat" value={formDraft.flat ?? ""} onChange={(e) => setFormDraft((d: Record<string, any>) => ({ ...d, flat: e.target.value }))} /></div>
                  <div className="sm:col-span-2"><Label htmlFor="edit-fullAddress">Full Address</Label><Input id="edit-fullAddress" value={formDraft.fullAddress ?? ""} onChange={(e) => setFormDraft((d: Record<string, any>) => ({ ...d, fullAddress: e.target.value }))} /></div>
                  <div><Label htmlFor="edit-near">Near</Label><Input id="edit-near" value={formDraft.near ?? ""} onChange={(e) => setFormDraft((d: Record<string, any>) => ({ ...d, near: e.target.value }))} /></div>
                  <div><Label htmlFor="edit-latitude">Latitude</Label><Input id="edit-latitude" value={formDraft.latitude ?? ""} onChange={(e) => setFormDraft((d: Record<string, any>) => ({ ...d, latitude: e.target.value }))} /></div>
                  <div><Label htmlFor="edit-longitude">Longitude</Label><Input id="edit-longitude" value={formDraft.longitude ?? ""} onChange={(e) => setFormDraft((d: Record<string, any>) => ({ ...d, longitude: e.target.value }))} /></div>
                  <div><Label htmlFor="edit-addressWorkEmail">Address Work Email</Label><Input id="edit-addressWorkEmail" type="email" value={formDraft.addressWorkEmail ?? ""} onChange={(e) => setFormDraft((d: Record<string, any>) => ({ ...d, addressWorkEmail: e.target.value }))} /></div>
                  <div><Label htmlFor="edit-addressWorkPhone">Address Work Phone</Label><Input id="edit-addressWorkPhone" value={formDraft.addressWorkPhone ?? ""} onChange={(e) => setFormDraft((d: Record<string, any>) => ({ ...d, addressWorkPhone: e.target.value }))} /></div>
                </div>
              </div>
            </div>
          </div>
          <div className="p-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-2 shrink-0">
            <Button variant="outline" onClick={closeEditModal} disabled={saving}>Cancel</Button>
            <Button onClick={handleSaveAll} disabled={saving}>{saving ? "Saving…" : "Save"}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
