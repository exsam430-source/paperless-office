import React, { useState, useRef } from 'react';
import Modal from '@components/common/Modal';
import Button from '@components/common/Button';
import Avatar from '@components/common/Avatar';
import { Upload, Trash2, Camera } from 'lucide-react';
import { useAuth } from '@hooks/useAuth';
import { useNotifications } from '@hooks/useNotifications';
import { authAPI } from '@api/auth.api';

export default function ProfilePictureModal({ open, onClose }) {
  const { user, refreshUserData } = useAuth(); // ✅ Use refreshUserData
  const { showToast } = useNotifications();
  const fileInputRef = useRef(null);

  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showToast('error', 'Please select an image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast('error', 'Image size must be less than 5MB');
      return;
    }

    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    try {
      console.log('Uploading profile picture...');
      const response = await authAPI.uploadProfilePicture(selectedFile);
      console.log('Upload response:', response);
      
      // ✅ Refresh user data from backend
      await refreshUserData();
      
      showToast('success', 'Profile picture updated successfully');
      handleClose();
    } catch (error) {
      console.error('Upload error:', error);
      showToast('error', error.response?.data?.message || 'Failed to upload profile picture');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      console.log('Deleting profile picture...');
      await authAPI.deleteProfilePicture();
      
      // ✅ Refresh user data from backend
      await refreshUserData();
      
      showToast('success', 'Profile picture removed successfully');
      handleClose();
    } catch (error) {
      console.error('Delete error:', error);
      showToast('error', error.response?.data?.message || 'Failed to remove profile picture');
    } finally {
      setDeleting(false);
    }
  };

  const handleClose = () => {
    setPreview(null);
    setSelectedFile(null);
    onClose();
  };

  return (
    <Modal
      isOpen={open}
      onClose={handleClose}
      title="Profile Picture"
      size="md"
      footer={
        <>
          <Button variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          {preview && (
            <Button 
              variant="primary" 
              onClick={handleUpload} 
              isLoading={uploading}
              leftIcon={<Upload className="w-4 h-4" />}
            >
              Upload
            </Button>
          )}
        </>
      }
    >
      <div className="space-y-6">
        {/* Current/Preview Picture */}
        <div className="flex flex-col items-center">
          {preview ? (
            <div className="relative">
              <img
                src={preview}
                alt="Preview"
                className="w-32 h-32 rounded-full object-cover border-4 border-primary-500 shadow-lg"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 hover:opacity-100 transition-opacity">
                <p className="text-white text-sm font-medium">Preview</p>
              </div>
            </div>
          ) : (
            <Avatar
              src={user?.profilePicture}
              name={user?.name}
              size="2xl"
              className="mb-4"
            />
          )}
        </div>

        {/* Upload Section */}
        <div className="space-y-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          <Button
            variant="outline"
            fullWidth
            leftIcon={<Camera className="w-4 h-4" />}
            onClick={() => fileInputRef.current?.click()}
          >
            {preview ? 'Choose Different Image' : 'Choose Image'}
          </Button>

          {user?.profilePicture && !preview && (
            <Button
              variant="danger"
              fullWidth
              leftIcon={<Trash2 className="w-4 h-4" />}
              onClick={handleDelete}
              isLoading={deleting}
            >
              Remove Profile Picture
            </Button>
          )}
        </div>

        {/* Guidelines */}
        <div className="p-4 rounded-lg bg-secondary-50 dark:bg-secondary-800">
          <p className="text-xs font-medium text-secondary-700 dark:text-secondary-300 mb-2">
            Image Guidelines:
          </p>
          <ul className="text-xs text-secondary-600 dark:text-secondary-400 space-y-1">
            <li>• Accepted formats: JPG, PNG, GIF, WebP</li>
            <li>• Maximum size: 5MB</li>
            <li>• Recommended: Square image (1:1 ratio)</li>
            <li>• Minimum resolution: 200x200 pixels</li>
          </ul>
        </div>
      </div>
    </Modal>
  );
}