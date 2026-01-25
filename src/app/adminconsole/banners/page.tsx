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

interface Banner {
  id: string;
  image?: string;
  name?: string;
  title?: string;
  active?: boolean;
  isActive?: boolean;
  [key: string]: any;
}

export default function BannerManagement() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { isOpen, openModal, closeModal } = useModal();
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [formData, setFormData] = useState({
    image: "",
    isActive: true,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [filterQuery, setFilterQuery] = useState("");

  useEffect(() => {
    fetchBanners();
  }, []);

  // Update formData when editingBanner changes
  useEffect(() => {
    if (editingBanner && isOpen) {
      setFormData({
        image: editingBanner.image || "",
        isActive: editingBanner.isActive !== undefined ? editingBanner.isActive : (editingBanner.active !== undefined ? editingBanner.active : true),
      });
      setImagePreview(editingBanner.image || null);
    }
  }, [editingBanner, isOpen]);

  const fetchBanners = async () => {
    if (!db) {
      console.error("Firebase Firestore is not initialized");
      setError("Firebase is not initialized");
      setLoading(false);
      return;
    }

    try {
      const bannersCollection = collection(db, "BannerCollection");
      const bannersSnapshot = await getDocs(bannersCollection);

      const bannersData: Banner[] = bannersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setBanners(bannersData);
      setError(null);
    } catch (err) {
      console.error("Error fetching banners:", err);
      setError("Failed to fetch banners");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingBanner(null);
    setFormData({
      image: "",
      isActive: true,
    });
    setSelectedFile(null);
    setImagePreview(null);
    openModal();
  };

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner);
    setFormData({
      image: banner.image || "",
      isActive: banner.isActive !== undefined ? banner.isActive : (banner.active !== undefined ? banner.active : true),
    });
    setSelectedFile(null);
    setImagePreview(banner.image || null);
    openModal();
  };

  const handleDelete = async (bannerId: string) => {
    if (!db) {
      alert("Firebase is not initialized");
      return;
    }

    if (!confirm("Are you sure you want to delete this banner?")) {
      return;
    }

    try {
      const bannerDocRef = doc(db, "BannerCollection", bannerId);
      await deleteDoc(bannerDocRef);
      await fetchBanners(); // Refresh the list
    } catch (err) {
      console.error("Error deleting banner:", err);
      alert("Failed to delete banner");
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
      setFormData((prev) => ({ ...prev, image: "" }));
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    if (!storage) {
      throw new Error("Firebase Storage is not initialized");
    }

    // Get file extension from original file
    const fileExtension = file.name.split(".").pop() || "png";

    // Create filename using timestamp to ensure uniqueness
    const timestamp = Date.now();
    const fileName = `banner_${timestamp}.${fileExtension}`;
    const storageRef = ref(storage, `Banner/${fileName}`);

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

    if (!selectedFile && !formData.image) {
      alert("Please upload an image or provide an image URL");
      return;
    }

    setUploading(true);

    try {
      let imageUrl = formData.image;

      // Upload file if selected
      if (selectedFile) {
        try {
          imageUrl = await uploadImage(selectedFile);
        } catch (uploadErr) {
          console.error("Error uploading image:", uploadErr);
          alert("Failed to upload image. Please try again.");
          setUploading(false);
          return;
        }
      }

      // Save to Firestore
      if (editingBanner) {
        // Update existing banner
        const bannerDocRef = doc(db, "BannerCollection", editingBanner.id);
        await updateDoc(bannerDocRef, {
          image: imageUrl || null,
          isActive: formData.isActive,
          id: editingBanner.id, // Ensure id field matches doc id
        });
      } else {
        // Add new banner
        const docRef = await addDoc(collection(db, "BannerCollection"), {
          image: imageUrl || null,
          isActive: formData.isActive,
        });
        // Update the document with id field matching the doc id
        await updateDoc(docRef, {
          id: docRef.id,
        });
      }

      handleCloseModal();
      await fetchBanners(); // Refresh the list
    } catch (err) {
      console.error("Error saving banner:", err);
      alert("Failed to save banner");
    } finally {
      setUploading(false);
    }
  };

  const handleCloseModal = () => {
    closeModal();
    setEditingBanner(null);
    setFormData({
      image: "",
      isActive: true,
    });
    setSelectedFile(null);
    setImagePreview(null);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-title-sm font-semibold text-gray-800 dark:text-white">
            Banner Management
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

  const filteredBanners = (() => {
    const q = String(filterQuery || "").trim().toLowerCase();
    if (!q) return banners;
    return banners.filter((b) => {
      const name = (b.name || b.title || "").toLowerCase();
      const act = b.active || b.isActive ? "active" : "inactive";
      return name.includes(q) || act.includes(q);
    });
  })();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-title-sm font-semibold text-gray-800 dark:text-white">
          Banner Management
        </h1>
        <div className="flex items-center gap-2">
          <input
            type="search"
            placeholder="Search by name or active/inactive…"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="w-48 md:w-56 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button onClick={handleAdd}>
            Add Banner
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
                  Active
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredBanners.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    {banners.length === 0 ? "No banners found" : "No banners match your search"}
                  </td>
                </tr>
              ) : (
                filteredBanners.map((banner) => (
                  <tr key={banner.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {banner.image ? (
                        <img
                          src={banner.image}
                          alt="Banner"
                          className="h-32 w-48 object-cover rounded-lg"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="h-32 w-48 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                          <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${banner.active || banner.isActive
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          }`}
                      >
                        {banner.active || banner.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(banner)}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(banner.id)}
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
              {editingBanner ? "Edit Banner" : "Add Banner"}
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              {editingBanner
                ? "Update the banner details below."
                : "Fill in the details to add a new banner."}
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
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <Label htmlFor="isActive" className="ml-2 mb-0">
                  Active
                </Label>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button
                size="sm"
                variant="outline"
                onClick={handleCloseModal}
                disabled={uploading}
              >
                Cancel
              </Button>
              <button
                type="submit"
                disabled={uploading}
                className="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-4 py-3 text-sm bg-blue-600 text-white shadow-theme-xs hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {uploading
                  ? "Uploading..."
                  : editingBanner
                    ? "Update Banner"
                    : "Add Banner"}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
