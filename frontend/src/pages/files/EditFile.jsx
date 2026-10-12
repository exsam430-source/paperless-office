import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Upload, FileText, X, ArrowLeft, Save } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { useFiles } from "@hooks/useFiles";
import { useNotifications } from "@hooks/useNotifications";
import { departmentsAPI } from "@api/departments.api";
import Card from "@components/common/Card";
import Input from "@components/common/Input";
import Button from "@components/common/Button";
import LoadingSpinner from "@components/common/LoadingSpinner";
import { cn } from "@utils/cn";
import { formatFileSize } from "@utils/formatters";

// ✅ Validation schema (same as create, but without file type/department)
const editFileSchema = yup.object({
  title: yup.string().required("Title is required"),
  description: yup.string(),
});

const EditFile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentFile, fetchFileById, updateFile, clearCurrentFile } = useFiles();
  const { showToast } = useNotifications();

  const [newAttachments, setNewAttachments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(editFileSchema),
  });

  // ✅ Fetch file data
  useEffect(() => {
    const loadFile = async () => {
      try {
        await fetchFileById(id);
        setIsLoading(false);
      } catch (error) {
        showToast("error", "Failed to load file");
        navigate("/my-files");
      }
    };

    loadFile();

    return () => clearCurrentFile();
  }, [id]);

  // ✅ Populate form when file loads
  useEffect(() => {
    if (currentFile) {
      setValue("title", currentFile.title);
      setValue("description", currentFile.description || "");
    }
  }, [currentFile, setValue]);

  // ✅ Check if user can edit
  useEffect(() => {
    if (currentFile && !['PENDING', 'REVISION'].includes(currentFile.status)) {
      showToast("error", `Cannot edit file with status: ${currentFile.status}`);
      navigate("/my-files");
    }
  }, [currentFile]);

  // ✅ Dropzone for new attachments
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    maxFiles: 5,
    onDrop: (acceptedFiles) => {
      setNewAttachments([...newAttachments, ...acceptedFiles]);
    },
    onDropRejected: (rejectedFiles) => {
      rejectedFiles.forEach((file) => {
        if (file.errors[0]?.code === "file-too-large") {
          showToast("error", "File size must be less than 10MB");
        } else if (file.errors[0]?.code === "file-invalid-type") {
          showToast("error", "Only PDF files are allowed");
        }
      });
    },
  });

  const removeNewAttachment = (index) => {
    setNewAttachments(newAttachments.filter((_, i) => i !== index));
  };

  // ✅ Submit update
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const formData = {
        title: data.title,
        description: data.description || "",
        fileType: currentFile.fileType, // Keep existing
        department: currentFile.department._id || currentFile.department, // Keep existing
        attachments: newAttachments, // Only send new attachments
      };

      await updateFile(id, formData);
      showToast("success", "File updated successfully!");
      navigate(`/files/${id}`);
    } catch (error) {
      showToast(
        "error",
        error.response?.data?.message || "Failed to update file",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !currentFile) {
    return <LoadingSpinner fullScreen text="Loading file..." />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          Back
        </Button>
        <h1 className="text-2xl sm:text-3xl font-bold text-secondary-900 dark:text-white mb-2">
          Edit File
        </h1>
        <p className="text-secondary-600 dark:text-secondary-400">
          Update file information and add new attachments
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
            Basic Information
          </h3>

          <div className="space-y-4">
            <Input
              label="File Title *"
              placeholder="Enter a descriptive title"
              error={errors.title?.message}
              {...register("title")}
            />

            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1.5">
                Description
              </label>
              <textarea
                rows={4}
                className="w-full px-4 py-2.5 rounded-lg border border-secondary-300 dark:border-secondary-600 bg-white dark:bg-secondary-800 text-secondary-900 dark:text-secondary-100 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                placeholder="Provide details about this file..."
                {...register("description")}
              />
              {errors.description && (
                <p className="mt-1.5 text-sm text-danger-600 dark:text-danger-400">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Read-only fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1.5">
                  File Type (Read Only)
                </label>
                <input
                  type="text"
                  value={currentFile.fileType?.replaceAll("_", " ")}
                  disabled
                  className="w-full px-4 py-2.5 rounded-lg border border-secondary-300 dark:border-secondary-600 bg-secondary-100 dark:bg-secondary-700 text-secondary-700 dark:text-secondary-300 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1.5">
                  Department (Read Only)
                </label>
                <input
                  type="text"
                  value={currentFile.department?.name}
                  disabled
                  className="w-full px-4 py-2.5 rounded-lg border border-secondary-300 dark:border-secondary-600 bg-secondary-100 dark:bg-secondary-700 text-secondary-700 dark:text-secondary-300 cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Existing Attachments */}
        {currentFile.attachments && currentFile.attachments.length > 0 && (
          <Card>
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
              Existing Attachments ({currentFile.attachments.length})
            </h3>
            <div className="space-y-2">
              {currentFile.attachments.map((attachment, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg bg-secondary-50 dark:bg-secondary-700/50 border border-secondary-200 dark:border-secondary-600"
                >
                  <FileText className="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-secondary-900 dark:text-white truncate">
                      {attachment}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-secondary-500 dark:text-secondary-400">
              Existing attachments cannot be removed. You can add new ones below.
            </p>
          </Card>
        )}

        {/* New Attachments */}
        <Card>
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
            Add New Attachments (Optional)
          </h3>

          <div
            {...getRootProps()}
            className={cn(
              "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200",
              isDragActive
                ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                : "border-secondary-300 dark:border-secondary-600 hover:border-primary-400 dark:hover:border-primary-500",
            )}
          >
            <input {...getInputProps()} />
            <Upload className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
            <p className="text-secondary-900 dark:text-white font-medium mb-1">
              {isDragActive ? "Drop files here" : "Drag & drop files here"}
            </p>
            <p className="text-sm text-secondary-500 dark:text-secondary-400">
              or click to browse (PDF only, max 10MB per file)
            </p>
          </div>

          {newAttachments.length > 0 && (
            <div className="mt-4 space-y-2">
              {newAttachments.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800"
                >
                  <FileText className="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-secondary-900 dark:text-white truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-secondary-500 dark:text-secondary-400">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeNewAttachment(index)}
                    className="text-danger-600 hover:text-danger-700 dark:text-danger-400 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
          <Button type="button" variant="ghost" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditFile;