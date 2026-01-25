"use client";

import React, { useEffect, useState } from "react";
import { db, storage } from "@/lib/firebase/config";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useModal } from "@/hooks/useModal";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";

interface Service {
  id: string;
  image?: string;
  name?: string;
  title?: string;
  active?: boolean;
  [key: string]: any;
}

export default function ServiceManagement() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { isOpen, openModal, closeModal } = useModal();
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    active: true,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [filterQuery, setFilterQuery] = useState("");

  useEffect(() => {
    fetchServices();
  }, []);

  // Update formData when editingService changes
  useEffect(() => {
    if (editingService && isOpen) {
      const serviceName = editingService.name || editingService.title || "";
      setFormData({
        name: serviceName,
        image: editingService.image || "",
        active: editingService.active !== undefined ? editingService.active : true,
      });
      setImagePreview(editingService.image || null);
    }
  }, [editingService, isOpen]);

  const fetchServices = async () => {
    if (!db) {
      console.error("Firebase Firestore is not initialized");
      setError("Firebase is not initialized");
      setLoading(false);
      return;
    }

    try {
      const servicesCollection = collection(db, "ServiceCollection");
      const servicesSnapshot = await getDocs(servicesCollection);

      const servicesData: Service[] = servicesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setServices(servicesData);
      setError(null);
    } catch (err) {
      console.error("Error fetching services:", err);
      setError("Failed to fetch services");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingService(null);
    setFormData({
      name: "",
      image: "",
      active: true,
    });
    setSelectedFile(null);
    setImagePreview(null);
    openModal();
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      name: service.name || service.title || "",
      image: service.image || "",
      active: service.active !== undefined ? service.active : true,
    });
    setSelectedFile(null);
    setImagePreview(service.image || null);
    openModal();
  };

  const handleDelete = async (serviceId: string) => {
    if (!db) {
      alert("Firebase is not initialized");
      return;
    }

    if (!confirm("Are you sure you want to delete this service?")) {
      return;
    }

    try {
      const serviceDocRef = doc(db, "ServiceCollection", serviceId);
      await deleteDoc(serviceDocRef);
      await fetchServices(); // Refresh the list
    } catch (err) {
      console.error("Error deleting service:", err);
      alert("Failed to delete service");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }
      setSelectedFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      // Clear image URL when file is selected
      setFormData({ ...formData, image: "" });
    }
  };

  const uploadImage = async (file: File, serviceName: string): Promise<string> => {
    if (!storage) {
      throw new Error("Firebase Storage is not initialized");
    }

    // Sanitize service name to create a valid filename
    // Remove special characters, replace spaces with underscores, convert to lowercase
    const sanitizedName = serviceName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]/g, "_")
      .replace(/_+/g, "_")
      .replace(/^_|_$/g, "");

    // Get file extension from original file
    const fileExtension = file.name.split(".").pop() || "png";

    // Create filename using service name
    const fileName = `${sanitizedName}.${fileExtension}`;
    const storageRef = ref(storage, `Services/${fileName}`);

    // Upload file
    await uploadBytes(storageRef, file);

    // Get download URL
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  };

  const handleSave = async () => {
    if (!db) {
      alert("Firebase is not initialized");
      return;
    }

    if (!formData.name.trim()) {
      alert("Service name is required");
      return;
    }

    setUploading(true);

    try {
      let imageUrl = formData.image;

      // Upload file if selected
      if (selectedFile) {
        try {
          imageUrl = await uploadImage(selectedFile, formData.name);
        } catch (uploadErr) {
          console.error("Error uploading image:", uploadErr);
          alert("Failed to upload image. Please try again.");
          setUploading(false);
          return;
        }
      }

      // Save to Firestore
      if (editingService) {
        // Update existing service
        const serviceDocRef = doc(db, "ServiceCollection", editingService.id);
        await updateDoc(serviceDocRef, {
          name: formData.name,
          image: imageUrl || null,
          active: formData.active,
          id: editingService.id, // Ensure id field matches doc id
        });
      } else {
        // Add new service
        const docRef = await addDoc(collection(db, "ServiceCollection"), {
          name: formData.name,
          image: imageUrl || null,
          active: formData.active,
        });
        // Update the document with id field matching the doc id
        await updateDoc(docRef, {
          id: docRef.id,
        });
      }

      handleCloseModal();
      await fetchServices(); // Refresh the list
    } catch (err) {
      console.error("Error saving service:", err);
      alert("Failed to save service");
    } finally {
      setUploading(false);
    }
  };

  const handleCloseModal = () => {
    closeModal();
    setEditingService(null);
    setFormData({
      name: "",
      image: "",
      active: true,
    });
    setSelectedFile(null);
    setImagePreview(null);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-title-sm font-semibold text-gray-800 dark:text-white">
            Service Management
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

  const filteredServices = (() => {
    const q = String(filterQuery || "").trim().toLowerCase();
    if (!q) return services;
    return services.filter(
      (s) =>
        (s.name || s.title || "").toLowerCase().includes(q) ||
        (s.active ? "active" : "inactive").includes(q)
    );
  })();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-title-sm font-semibold text-gray-800 dark:text-white">
          Service Management
        </h1>
        <div className="flex items-center gap-2">
          <input
            type="search"
            placeholder="Search by name…"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="w-48 md:w-56 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button onClick={handleAdd}>
            Add Service
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800 p-4">
          <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      <div className="rounded-2xl bg-white shadow-theme-sm dark:bg-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Active
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredServices.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    {services.length === 0 ? "No services found" : "No services match your search"}
                  </td>
                </tr>
              ) : (
                filteredServices.map((service) => (
                  <tr key={service.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {service.image ? (
                        <img
                          src={service.image}
                          alt={service.name || "Service"}
                          className="h-12 w-12 object-cover rounded-lg"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                          <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {service.name || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          service.active
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        }`}
                      >
                        {service.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(service)}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(service.id)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={handleCloseModal} className="max-w-[600px] m-4">
        <div className="no-scrollbar relative w-full max-w-[600px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white">
              {editingService ? "Edit Service" : "Add Service"}
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              {editingService
                ? "Update the service details below."
                : "Fill in the details to add a new service."}
            </p>
          </div>
          <form
            className="flex flex-col"
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
          >
            <div className="custom-scrollbar h-auto overflow-y-auto px-2 pb-3 space-y-5">
              <div>
                <Label>Service Name</Label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter service name"
                  required
                />
              </div>

              <div>
                <Label>Upload Image</Label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500 dark:text-gray-400
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-lg file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100
                    dark:file:bg-blue-900/20 dark:file:text-blue-300
                    dark:hover:file:bg-blue-900/30
                    cursor-pointer"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Supported formats: JPG, PNG, GIF. Max size: 5MB
                </p>
              </div>

              <div>
                <Label>Or Enter Image URL</Label>
                <Input
                  type="text"
                  value={formData.image}
                  onChange={(e) => {
                    setFormData({ ...formData, image: e.target.value });
                    if (e.target.value) {
                      setImagePreview(e.target.value);
                      setSelectedFile(null);
                    }
                  }}
                  placeholder="Enter image URL (optional if uploading file)"
                  disabled={!!selectedFile}
                />
              </div>

              {(imagePreview || formData.image) && (
                <div>
                  <Label>Image Preview</Label>
                  <div className="mt-2">
                    <img
                      src={imagePreview || formData.image}
                      alt="Preview"
                      className="h-32 w-32 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                      }}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="active"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <Label htmlFor="active" className="ml-2 mb-0">
                  Active
                </Label>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button
                size="sm"
                variant="outline"
                onClick={handleCloseModal}
                type="button"
                disabled={uploading}
              >
                Cancel
              </Button>
              <Button size="sm" type="submit" disabled={uploading}>
                {uploading
                  ? "Uploading..."
                  : editingService
                  ? "Update Service"
                  : "Add Service"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
