"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { db, storage } from "@/lib/firebase/config";
import { collection, getDocs, query, addDoc, doc, updateDoc, Timestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useModal } from "@/hooks/useModal";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { generateSalt, hashPassword } from "@/lib/password";

interface User {
  id: string;
  [key: string]: any; // For other user fields
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { isOpen: isAddOpen, openModal: openAddModal, closeModal: closeAddModal } = useModal(false);
  const [services, setServices] = useState<Record<string, any>>({});
  const [addServiceId, setAddServiceId] = useState("");
  const [addForm, setAddForm] = useState<Record<string, any>>({
    photo: "", firstName: "", email: "", phone: "", gender: "", birthDate: "", role: "",
    experienceYears: "", workEmail: "", workPhone: "", serviceDescription: "", certificate: "",
    servicesOffered: [], currentLat: "", currentLng: "",
    isActive: true, isBusy: false, isOnline: false, isVerified: false, stripeAccountVerified: false,
    stripeConnectAccountId: "", fcmToken: "", password: "", salt: "",
    addresstype: "", area: "", flat: "", fullAddress: "", near: "", latitude: "", longitude: "",
  });
  const [plainPassword, setPlainPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [selectedPhotoFile, setSelectedPhotoFile] = useState<File | null>(null);
  const [selectedCertificateFile, setSelectedCertificateFile] = useState<File | null>(null);
  const [addPhotoPreviewUrl, setAddPhotoPreviewUrl] = useState<string>("");
  const [addCertificatePreviewUrl, setAddCertificatePreviewUrl] = useState<string>("");
  const [addError, setAddError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [filterQuery, setFilterQuery] = useState("");

  const fetchUsers = useCallback(async () => {
    if (!db) {
      console.error("Firebase Firestore is not initialized");
      setError("Firebase is not initialized");
      setLoading(false);
      return;
    }

    try {
      const usersQuery = query(collection(db, "UsersCollection"));
      const usersSnapshot = await getDocs(usersQuery);

      const usersData: User[] = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setUsers(usersData);
      setError(null);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    if (!db) return;
    getDocs(collection(db, "ServiceCollection")).then((snap) => {
      const map: Record<string, any> = {};
      snap.docs.forEach((d) => { map[d.id] = { id: d.id, ...d.data() }; });
      setServices(map);
    }).catch(() => { });
  }, []);

  const getServiceName = (id: string) => services[id]?.name || services[id]?.title || id;

  const INIT_ADD_FORM: Record<string, any> = {
    photo: "", firstName: "", email: "", phone: "", gender: "", birthDate: "", role: "",
    experienceYears: "", workEmail: "", workPhone: "", serviceDescription: "", certificate: "",
    servicesOffered: [], currentLat: "", currentLng: "",
    isActive: true, isBusy: false, isOnline: false, isVerified: false, stripeAccountVerified: false,
    stripeConnectAccountId: "", fcmToken: "", password: "", salt: "",
    addresstype: "", area: "", flat: "", fullAddress: "", near: "", latitude: "", longitude: "",
  };

  const handleAddUser = () => {
    setAddError(null);
    setAddServiceId("");
    setAddPhotoPreviewUrl((prev) => { if (prev) URL.revokeObjectURL(prev); return ""; });
    setAddCertificatePreviewUrl((prev) => { if (prev) URL.revokeObjectURL(prev); return ""; });
    setSelectedPhotoFile(null);
    setSelectedCertificateFile(null);
    setAddForm({ ...INIT_ADD_FORM, servicesOffered: [] });
    setPlainPassword("");
    setShowPassword(false);
    openAddModal();
  };

  const handleSaveAddUser = async () => {
    if (!db) {
      setAddError("Firebase is not initialized");
      return;
    }

    const { email, firstName } = addForm;
    if (!String(email || "").trim() && !String(firstName || "").trim()) {
      setAddError("Provide at least email or first name.");
      return;
    }

    const servicesArr = Array.isArray(addForm.servicesOffered) ? addForm.servicesOffered : [];

    const userAddress = {
      addresstype: addForm.addresstype || null,
      area: addForm.area || null,
      flat: addForm.flat || null,
      near: addForm.near || null,
      fullAddress: addForm.fullAddress || null,
      latitude: addForm.latitude != null && addForm.latitude !== "" ? String(addForm.latitude) : null,
      longitude: addForm.longitude != null && addForm.longitude !== "" ? String(addForm.longitude) : null,
    };

    const payload: Record<string, any> = {
      photo: selectedPhotoFile ? null : (addForm.photo || null),
      firstName: addForm.firstName || null,
      email: addForm.email || null,
      phone: addForm.phone || null,
      gender: addForm.gender || null,
      birthDate: addForm.birthDate || null,
      role: addForm.role || null,
      experienceYears: addForm.experienceYears != null && addForm.experienceYears !== "" ? String(addForm.experienceYears) : null,
      workEmail: addForm.workEmail || null,
      workPhone: addForm.workPhone || null,
      serviceDescription: addForm.serviceDescription || null,
      certificate: selectedCertificateFile ? null : (addForm.certificate || null),
      currentLat: addForm.currentLat !== "" ? Number(addForm.currentLat) : null,
      currentLng: addForm.currentLng !== "" ? Number(addForm.currentLng) : null,
      fcmToken: addForm.fcmToken || null,
      isActive: !!addForm.isActive,
      isBusy: !!addForm.isBusy,
      isOnline: !!addForm.isOnline,
      isVerified: !!addForm.isVerified,
      stripeAccountVerified: !!addForm.stripeAccountVerified,
      stripeConnectAccountId: addForm.stripeConnectAccountId || null,
      servicesOffered: servicesArr,
      userAddress,
      createdAt: Timestamp.now(),
    };
    // Add password and salt if they exist (auto-generated from plainPassword)
    if (addForm.password && String(addForm.password).trim()) (payload as any).password = String(addForm.password).trim();
    if (addForm.salt != null && addForm.salt !== "") (payload as any).salt = addForm.salt;

    setSaving(true);
    setAddError(null);
    try {
      const docRef = await addDoc(collection(db, "UsersCollection"), payload);
      const newId = docRef.id;

      // Add the document ID to the document itself
      await updateDoc(doc(db, "UsersCollection", newId), { id: newId });

      if (selectedPhotoFile && storage) {
        try {
          const photoRef = ref(storage, `Users/${newId}`);
          await uploadBytes(photoRef, selectedPhotoFile, { contentType: selectedPhotoFile.type || "image/jpeg" });
          const photoUrl = await getDownloadURL(photoRef);
          await updateDoc(doc(db, "UsersCollection", newId), { photo: photoUrl });
        } catch (e: any) {
          setAddError(e?.message || "User added. Photo upload failed.");
          setSaving(false);
          return;
        }
      }

      if (selectedCertificateFile && storage) {
        try {
          const certRef = ref(storage, `Users/${newId}_certificate`);
          await uploadBytes(certRef, selectedCertificateFile, { contentType: selectedCertificateFile.type || "image/jpeg" });
          const certUrl = await getDownloadURL(certRef);
          await updateDoc(doc(db, "UsersCollection", newId), { certificate: certUrl });
        } catch (e: any) {
          setAddError(e?.message || "User added. Certificate upload failed.");
          setSaving(false);
          return;
        }
      }

      closeAddModal();
      setLoading(true);
      await fetchUsers();
    } catch (e: any) {
      setAddError(e?.message || "Failed to add user");
    } finally {
      setSaving(false);
    }
  };

  const handleRowClick = (userId: string) => {
    router.push(`/adminconsole/users/${userId}`);
  };

  const getUserName = (user: User) => {
    const firstName = user.firstName || "";
    const lastName = user.lastName || "";
    const fullName = `${firstName} ${lastName}`.trim();
    return fullName || user.name || user.displayName || "N/A";
  };

  const getUserStatus = (user: User) => {
    // First priority: Check if account is banned (isBanned is a string value)
    // Check if isBanned string value indicates banned status
    const isBannedValue = String(user.status);
    if (isBannedValue === "true" || isBannedValue === "isBanned" || isBannedValue === "yes") {
      return "banned";
    }

    // Second priority: If not banned, check if verified
    // Handle both boolean and string values for isVerified
    const isVerifiedValue = user.isVerified;
    if (isVerifiedValue === true || String(isVerifiedValue || "").toLowerCase() === "true" || String(isVerifiedValue || "").toLowerCase() === "verified") {
      return "verified";
    }

    // Default: If not banned and not verified, show unverified
    return "unverified";
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "banned":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "verified":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "unverified":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const filteredUsers = (() => {
    const q = String(filterQuery || "").trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        (getUserName(u) || "").toLowerCase().includes(q) ||
        (u.email || "").toLowerCase().includes(q) ||
        (u.phone || "").toLowerCase().includes(q) ||
        (u.role || "").toLowerCase().includes(q)
    );
  })();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-title-sm font-semibold text-gray-800 dark:text-white">
            User Management
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

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-title-sm font-semibold text-gray-800 dark:text-white">
            User Management
          </h1>
        </div>
        <div className="rounded-2xl bg-white shadow-theme-sm dark:bg-gray-800 p-6">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl sm:text-title-sm font-semibold text-gray-800 dark:text-white">
          User Management
        </h1>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center w-full sm:w-auto">
          <input
            type="search"
            placeholder="Search by name, email, phone, role…"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="w-full min-w-0 sm:w-64 md:w-72 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button onClick={handleAddUser} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 whitespace-nowrap w-full sm:w-auto">
            Add User
          </button>
        </div>
      </div>

      <div className="rounded-2xl bg-white shadow-theme-sm dark:bg-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Photo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                    {users.length === 0 ? "No users found" : "No users match your search"}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const status = getUserStatus(user);
                  return (
                    <tr
                      key={user.id}
                      onClick={() => handleRowClick(user.id)}
                      className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {user.photo ? (
                            <img
                              src={user.photo}
                              alt={getUserName(user)}
                              className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                              onError={(e) => {
                                // Replace with fallback avatar on error
                                const target = e.target as HTMLImageElement;
                                const nameInitials = getUserName(user)
                                  .split(" ")
                                  .map((n: string) => n[0])
                                  .join("")
                                  .toUpperCase()
                                  .slice(0, 2);
                                target.outerHTML = `<div class="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center"><span class="text-sm font-medium text-gray-600 dark:text-gray-300">${nameInitials}</span></div>`;
                              }}
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                {getUserName(user)
                                  .split(" ")
                                  .map((n: string) => n[0])
                                  .join("")
                                  .toUpperCase()
                                  .slice(0, 2)}
                              </span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {getUserName(user)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {user.email || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {user.phone || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {user.role || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${getStatusColor(status)}`}>
                          {status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      <Modal isOpen={isAddOpen} onClose={closeAddModal} className="max-w-3xl m-4">
        <div className="flex flex-col max-h-[85vh]">
          <div className="p-6 pb-4 border-b border-gray-200 dark:border-gray-700 shrink-0">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Add User</h3>
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto p-6">
            {addError && <p className="text-sm text-red-600 dark:text-red-400 mb-4">{addError}</p>}
            <div className="space-y-6">
              {/* Basic */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Basic</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <Label>Photo</Label>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 mb-2">Upload saves as Users/&lt;id&gt; when you click Add User. Or paste a URL.</p>
                    <div className="flex flex-wrap items-start gap-4">
                      {(addPhotoPreviewUrl || addForm.photo) && (
                        <div className="flex-shrink-0">
                          <img src={addPhotoPreviewUrl || addForm.photo} alt="Preview" className="w-16 h-16 rounded-lg object-cover border border-gray-200 dark:border-gray-700" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                        </div>
                      )}
                      <div className="flex-1 min-w-0 space-y-4">
                        <label className="cursor-pointer inline-block mb-4">
                          <span className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">Upload photo</span>
                          <input type="file" accept="image/*" className="sr-only" disabled={saving} onChange={(e) => { const f = e.target.files?.[0]; if (f) { setAddPhotoPreviewUrl(prev => { if (prev) URL.revokeObjectURL(prev); return URL.createObjectURL(f); }); setSelectedPhotoFile(f); setAddForm((x) => ({ ...x, photo: "" })); } e.target.value = ""; }} />
                        </label>
                        <div>
                          <Label htmlFor="add-photo" className="text-xs text-gray-500">Or paste URL</Label>
                          <Input id="add-photo" value={addForm.photo ?? ""} onChange={(e) => { const v = e.target.value; setAddPhotoPreviewUrl(prev => { if (prev) URL.revokeObjectURL(prev); return ""; }); setSelectedPhotoFile(null); setAddForm((f) => ({ ...f, photo: v })); }} placeholder="https://…" className="mt-1" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div><Label htmlFor="add-firstName">First Name</Label><Input id="add-firstName" value={addForm.firstName ?? ""} onChange={(e) => setAddForm((f) => ({ ...f, firstName: e.target.value }))} /></div>
                  <div><Label htmlFor="add-email">Email</Label><Input id="add-email" type="email" value={addForm.email ?? ""} onChange={(e) => setAddForm((f) => ({ ...f, email: e.target.value }))} /></div>
                  <div><Label htmlFor="add-phone">Phone</Label><Input id="add-phone" value={addForm.phone ?? ""} onChange={(e) => setAddForm((f) => ({ ...f, phone: e.target.value }))} /></div>
                  <div>
                    <Label htmlFor="add-gender">Gender</Label>
                    <select id="add-gender" value={addForm.gender ?? ""} onChange={(e) => setAddForm((f) => ({ ...f, gender: e.target.value }))} className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white">
                      <option value="">—</option><option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option>
                    </select>
                  </div>
                  <div><Label htmlFor="add-birthDate">Birth Date</Label><Input id="add-birthDate" type="date" value={addForm.birthDate ?? ""} onChange={(e) => setAddForm((f) => ({ ...f, birthDate: e.target.value }))} /></div>
                  {/* Password Field */}
                  <div className="sm:col-span-2">
                    <Label htmlFor="add-plain-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="add-plain-password"
                        type={showPassword ? "text" : "password"}
                        value={plainPassword}
                        onChange={async (e) => {
                          const plainPwd = e.target.value;
                          setPlainPassword(plainPwd);

                          if (plainPwd.trim()) {
                            // Generate salt and hash password
                            const salt = generateSalt(16);
                            const hashedPassword = await hashPassword(plainPwd, salt);
                            setAddForm((f) => ({ ...f, password: hashedPassword, salt: salt }));
                          } else {
                            // Clear password and salt if password is empty
                            setAddForm((f) => ({ ...f, password: "", salt: "" }));
                          }
                        }}
                        placeholder="Enter password (will be hashed automatically)"
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Password will be automatically hashed with a secure salt when you enter it.
                    </p>
                  </div>
                  {/* Password Hash & Salt Display */}
                  {(addForm.password && addForm.salt) && (
                    <div className="sm:col-span-2 space-y-2 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                      <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">Generated Password Hash & Salt:</p>
                      <div className="space-y-1.5">
                        <div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-0.5">Password (SHA-256):</p>
                          <p className="text-xs font-mono text-gray-800 dark:text-gray-200 break-all bg-white dark:bg-gray-900 px-2 py-1.5 rounded border border-gray-200 dark:border-gray-700">{addForm.password}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-0.5">Salt (Base64Url):</p>
                          <p className="text-xs font-mono text-gray-800 dark:text-gray-200 break-all bg-white dark:bg-gray-900 px-2 py-1.5 rounded border border-gray-200 dark:border-gray-700">{addForm.salt}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  <div>
                    <Label htmlFor="add-role">Role</Label>
                    <select id="add-role" value={addForm.role ?? ""} onChange={(e) => setAddForm((f) => ({ ...f, role: e.target.value }))} className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white">
                      <option value="">—</option><option value="customer">Customer</option><option value="provider">Provider</option>
                    </select>
                  </div>
                  <div><Label htmlFor="add-experienceYears">Experience Years</Label><Input id="add-experienceYears" value={addForm.experienceYears ?? ""} onChange={(e) => setAddForm((f) => ({ ...f, experienceYears: e.target.value }))} /></div>
                  <div><Label htmlFor="add-workEmail">Work Email</Label><Input id="add-workEmail" type="email" value={addForm.workEmail ?? ""} onChange={(e) => setAddForm((f) => ({ ...f, workEmail: e.target.value }))} /></div>
                  <div><Label htmlFor="add-workPhone">Work Phone</Label><Input id="add-workPhone" value={addForm.workPhone ?? ""} onChange={(e) => setAddForm((f) => ({ ...f, workPhone: e.target.value }))} /></div>
                  <div className="sm:col-span-2"><Label htmlFor="add-serviceDescription">Service Description / Bio</Label><textarea id="add-serviceDescription" value={addForm.serviceDescription ?? ""} onChange={(e) => setAddForm((f) => ({ ...f, serviceDescription: e.target.value }))} rows={2} className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white" /></div>
                </div>
              </div>

              {/* Certificate & Services */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Certificate & Services</h4>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label>Certificate</Label>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 mb-2">Upload saves as Users/&lt;id&gt;_certificate when you click Add User. Or paste a URL.</p>
                    <div className="flex flex-wrap items-start gap-4">
                      {(addCertificatePreviewUrl || addForm.certificate) && (
                        <div className="flex-shrink-0">
                          <a href={addCertificatePreviewUrl || addForm.certificate} target="_blank" rel="noopener noreferrer" className="block">
                            <img src={addCertificatePreviewUrl || addForm.certificate} alt="Certificate" className="w-16 h-16 rounded-lg object-cover border border-gray-200 dark:border-gray-700" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                          </a>
                        </div>
                      )}
                      <div className="flex-1 min-w-0 space-y-4">
                        <label className="cursor-pointer inline-block mb-4">
                          <span className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">Upload certificate</span>
                          <input type="file" accept="image/*" className="sr-only" disabled={saving} onChange={(e) => { const f = e.target.files?.[0]; if (f) { setAddCertificatePreviewUrl(prev => { if (prev) URL.revokeObjectURL(prev); return URL.createObjectURL(f); }); setSelectedCertificateFile(f); setAddForm((x) => ({ ...x, certificate: "" })); } e.target.value = ""; }} />
                        </label>
                        <div>
                          <Label htmlFor="add-certificate" className="text-xs text-gray-500">Or paste URL</Label>
                          <Input id="add-certificate" value={addForm.certificate ?? ""} onChange={(e) => { const v = e.target.value; setAddCertificatePreviewUrl(prev => { if (prev) URL.revokeObjectURL(prev); return ""; }); setSelectedCertificateFile(null); setAddForm((f) => ({ ...f, certificate: v })); }} placeholder="https://…" className="mt-1" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label>Services Offered</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {(Array.isArray(addForm.servicesOffered) ? addForm.servicesOffered : []).map((id: string) => (
                        <span key={id} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg text-sm">
                          {getServiceName(id)}
                          <button type="button" onClick={() => setAddForm((f) => ({ ...f, servicesOffered: (Array.isArray(f.servicesOffered) ? f.servicesOffered : []).filter((x: string) => x !== id) }))} className="p-0.5 rounded hover:bg-blue-200 dark:hover:bg-blue-800/40" aria-label={`Remove ${getServiceName(id)}`}>
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                          </button>
                        </span>
                      ))}
                    </div>
                    <select value={addServiceId} onChange={(e) => { const v = e.target.value; if (v) { setAddForm((f) => ({ ...f, servicesOffered: [...(Array.isArray(f.servicesOffered) ? f.servicesOffered : []), v] })); setAddServiceId(""); } }} className="h-10 w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white">
                      <option value="">Add a service…</option>
                      {Object.entries(services).filter(([id]) => !(Array.isArray(addForm.servicesOffered) ? addForm.servicesOffered : []).includes(id)).map(([id]) => (<option key={id} value={id}>{getServiceName(id)}</option>))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Current Location */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Current Location</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><Label htmlFor="add-currentLat">Current Latitude</Label><Input id="add-currentLat" type="number" step={0.0000001} value={addForm.currentLat != null ? String(addForm.currentLat) : ""} onChange={(e) => setAddForm((f) => ({ ...f, currentLat: e.target.value }))} /></div>
                  <div><Label htmlFor="add-currentLng">Current Longitude</Label><Input id="add-currentLng" type="number" step={0.0000001} value={addForm.currentLng != null ? String(addForm.currentLng) : ""} onChange={(e) => setAddForm((f) => ({ ...f, currentLng: e.target.value }))} /></div>
                </div>
              </div>

              {/* Status Flags */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Status Flags</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={!!addForm.isActive} onChange={(e) => setAddForm((f) => ({ ...f, isActive: e.target.checked }))} className="rounded border-gray-300" /> Is Active</label>
                  <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={!!addForm.isBusy} onChange={(e) => setAddForm((f) => ({ ...f, isBusy: e.target.checked }))} className="rounded border-gray-300" /> Is Busy</label>
                  <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={!!addForm.isOnline} onChange={(e) => setAddForm((f) => ({ ...f, isOnline: e.target.checked }))} className="rounded border-gray-300" /> Is Online</label>
                  <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={!!addForm.isVerified} onChange={(e) => setAddForm((f) => ({ ...f, isVerified: e.target.checked }))} className="rounded border-gray-300" /> Is Verified</label>
                  <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={!!addForm.stripeAccountVerified} onChange={(e) => setAddForm((f) => ({ ...f, stripeAccountVerified: e.target.checked }))} className="rounded border-gray-300" /> Stripe Verified</label>
                </div>
              </div>

              {/* Stripe */}
              <div><Label htmlFor="add-stripeConnectAccountId">Stripe Connect Account ID</Label><Input id="add-stripeConnectAccountId" value={addForm.stripeConnectAccountId ?? ""} onChange={(e) => setAddForm((f) => ({ ...f, stripeConnectAccountId: e.target.value }))} /></div>

              {/* Technical */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Technical</h4>
                <div className="grid grid-cols-1 gap-4">
                  <div><Label htmlFor="add-fcmToken">FCM Token</Label><Input id="add-fcmToken" value={addForm.fcmToken ?? ""} onChange={(e) => setAddForm((f) => ({ ...f, fcmToken: e.target.value }))} /></div>
                </div>
              </div>

              {/* User Address */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">User Address</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><Label htmlFor="add-addresstype">Address Type</Label><Input id="add-addresstype" value={addForm.addresstype ?? ""} onChange={(e) => setAddForm((f) => ({ ...f, addresstype: e.target.value }))} /></div>
                  <div><Label htmlFor="add-area">Area</Label><Input id="add-area" value={addForm.area ?? ""} onChange={(e) => setAddForm((f) => ({ ...f, area: e.target.value }))} /></div>
                  <div><Label htmlFor="add-flat">Flat</Label><Input id="add-flat" value={addForm.flat ?? ""} onChange={(e) => setAddForm((f) => ({ ...f, flat: e.target.value }))} /></div>
                  <div><Label htmlFor="add-near">Near</Label><Input id="add-near" value={addForm.near ?? ""} onChange={(e) => setAddForm((f) => ({ ...f, near: e.target.value }))} /></div>
                  <div className="sm:col-span-2"><Label htmlFor="add-fullAddress">Full Address</Label><Input id="add-fullAddress" value={addForm.fullAddress ?? ""} onChange={(e) => setAddForm((f) => ({ ...f, fullAddress: e.target.value }))} /></div>
                  <div><Label htmlFor="add-latitude">Latitude</Label><Input id="add-latitude" value={addForm.latitude ?? ""} onChange={(e) => setAddForm((f) => ({ ...f, latitude: e.target.value }))} /></div>
                  <div><Label htmlFor="add-longitude">Longitude</Label><Input id="add-longitude" value={addForm.longitude ?? ""} onChange={(e) => setAddForm((f) => ({ ...f, longitude: e.target.value }))} /></div>
                </div>
              </div>
            </div>
          </div>
          <div className="p-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-2 shrink-0">
            <Button variant="outline" onClick={closeAddModal} disabled={saving}>Cancel</Button>
            <Button onClick={handleSaveAddUser} disabled={saving}>{saving ? "Adding…" : "Add User"}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
