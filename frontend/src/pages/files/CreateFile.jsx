import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Upload, FileText, X, CheckCircle } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { useFiles } from "@hooks/useFiles";
import { useNotifications } from "@hooks/useNotifications";
import { departmentsAPI } from "@api/departments.api";
import { fileCreationSchema } from "@utils/validators";
import Card from "@components/common/Card";
import Input from "@components/common/Input";
import Button from "@components/common/Button";
import { cn } from "@utils/cn";
import { formatFileSize } from "@utils/formatters";

const CreateFile = () => {
  const navigate = useNavigate();
  const { createFile } = useFiles();
  const { showToast } = useNotifications();
  const [departments, setDepartments] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // At the top with your other state variables
  const [workflows, setWorkflows] = useState([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState("");
  const [workflowError, setWorkflowError] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(fileCreationSchema),
  });

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await departmentsAPI.getAllDepartments();
      setDepartments(response.data);
    } catch (error) {
      showToast("error", "Failed to fetch departments");
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    maxFiles: 5,
    onDrop: (acceptedFiles) => {
      setAttachments([...attachments, ...acceptedFiles]);
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

  const removeAttachment = (index) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  // Create a function to handle department changes
  const handleDepartmentChange = async (e) => {
    const departmentId = e.target.value;

    // This ensures react-hook-form still registers the department change
    const event = {
      target: {
        name: "department",
        value: departmentId,
      },
    };

    register("department").onChange(event);
    setWorkflowError(null);

    if (!departmentId) {
      setWorkflows([]);
      setSelectedWorkflow("");
      return;
    }

    try {
      // Call API to get workflows for this department
      const response = await fetch(`/api/workflows/department/${departmentId}`);
      if (!response.ok) throw new Error("Failed to fetch workflows");

      const data = await response.json();

      if (data && data.length > 0) {
        setWorkflows(data);
        setSelectedWorkflow(data[0]._id); // Select first workflow by default
      } else {
        setWorkflows([]);
        setSelectedWorkflow("");
        setWorkflowError(
          "No workflows defined for this department. Please create a workflow first.",
        );
      }
    } catch (error) {
      console.error("Error fetching workflows:", error);
      setWorkflowError("Error loading workflows. Please try again.");
    }
  };

  // Update the onSubmit function to include workflow
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      if (workflowError) {
        showToast("error", "Please select a department with a valid workflow");
        setIsSubmitting(false);
        return;
      }

      const departmentId =
        typeof data.department === "object"
          ? data.department._id
          : data.department;

      const effectiveFileType =
        typeof data.fileType === "object" ? data.fileType.value : data.fileType;

      const formData = {
        title: data.title,
        description: data.description || "",
        fileType: effectiveFileType,
        department: departmentId,
        workflow: selectedWorkflow, // Include the workflow ID
        attachments,
      };

      const response = await createFile(formData);
      showToast("success", "File created successfully!");
      navigate(`/files/${response.data._id}`);
    } catch (error) {
      showToast(
        "error",
        error.response?.data?.message || "Failed to create file",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const fileTypes = [
    { value: "LEAVE_APPLICATION", label: "Leave Application" },
    { value: "BUDGET_REQUEST", label: "Budget Request" },
    { value: "PURCHASE_ORDER", label: "Purchase Order" },
    { value: "ACADEMIC_REQUEST", label: "Academic Request" },
    { value: "HR_DOCUMENT", label: "HR Document" },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-secondary-900 dark:text-white mb-2">
          Create New File
        </h1>
        <option value="AUTO">AUTO (AI Suggested)</option>
        <p className="text-secondary-600 dark:text-secondary-400">
          Submit a new document for approval workflow
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1.5">
                  File Type *
                </label>
                <select
                  className={cn(
                    "w-full px-4 py-2.5 rounded-lg border transition-all duration-200",
                    "bg-white dark:bg-secondary-800",
                    "text-secondary-900 dark:text-secondary-100",
                    "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent",
                    errors.fileType
                      ? "border-danger-500"
                      : "border-secondary-300 dark:border-secondary-600",
                  )}
                  {...register("fileType")}
                >
                  <option value="">Select file type</option>
                  {fileTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                {errors.fileType && (
                  <p className="mt-1.5 text-sm text-danger-600 dark:text-danger-400">
                    {errors.fileType.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1.5">
                  Department *
                </label>
                <select
                  className={cn(
                    "w-full px-4 py-2.5 rounded-lg border transition-all duration-200",
                    "bg-white dark:bg-secondary-800",
                    "text-secondary-900 dark:text-secondary-100",
                    "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent",
                    errors.department
                      ? "border-danger-500"
                      : "border-secondary-300 dark:border-secondary-600",
                  )}
                  {...register("department")}
                >
                  <option value="">Select department</option>
                  {departments.map((dept) => (
                    <option key={dept._id} value={dept._id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
                {errors.department && (
                  <p className="mt-1.5 text-sm text-danger-600 dark:text-danger-400">
                    {errors.department.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* File Attachments */}
        <Card>
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
            Attachments
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

          {attachments.length > 0 && (
            <div className="mt-4 space-y-2">
              {attachments.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg bg-secondary-50 dark:bg-secondary-700/50 border border-secondary-200 dark:border-secondary-600"
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
                    onClick={() => removeAttachment(index)}
                    className="text-danger-600 hover:text-danger-700 dark:text-danger-400 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* AI Notice */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded-lg">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-1">
                AI-Powered Processing
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-400">
                Your file will be automatically analyzed for priority and
                potential delays using our AI system
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
          <Button type="button" variant="ghost" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            leftIcon={<FileText className="w-4 h-4" />}
          >
            Create File
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateFile;
