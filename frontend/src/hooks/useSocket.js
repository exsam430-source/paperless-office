import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { API_CONFIG } from "@config/api.config";
import { useAuthStore } from "@store/authStore";
import { useNotificationStore } from "@store/notificationStore";
import { useFileStore } from "@store/fileStore"; // ✅ Add this

export const useSocket = () => {
  const socketRef = useRef(null);
  const { accessToken, user } = useAuthStore();
  const { addNotification } = useNotificationStore();
  const { updateFileFromSocket } = useFileStore(); // ✅ Add this

  useEffect(() => {
    if (!accessToken || !user) return;

    socketRef.current = io(API_CONFIG.SOCKET_URL, {
      auth: { token: accessToken },
    });

    socketRef.current.on("connect", () => {
      console.log("✅ Socket connected");
      socketRef.current.emit("joinRole", user.role);
      if (user.department?._id) {
        socketRef.current.emit("joinDepartment", user.department._id);
      }
    });

    socketRef.current.on("disconnect", () => {
      console.log("❌ Socket disconnected");
    });

    // File events
    socketRef.current.on("fileCreated", (data) => {
      console.log("📄 Socket: fileCreated", data);
      addNotification({
        type: "info",
        title: "New File Created",
        message: `File ${data.fileId} has been created`,
        data,
      });
      window.dispatchEvent(new CustomEvent("po:fileUpdated", { detail: data }));
    });

    socketRef.current.on("fileAssigned", (data) => {
      console.log("📄 Socket: fileAssigned", data);
      if (data.currentHolderRole === user.role) {
        addNotification({
          type: "info",
          title: "New File Assigned",
          message: `File ${data.fileId} assigned to you`,
          data,
        });
      }
      window.dispatchEvent(new CustomEvent("po:fileUpdated", { detail: data }));
    });

    socketRef.current.on("fileApproved", (data) => {
      console.log("📄 Socket: fileApproved", data.fileId, "Attachments:", data.attachments);
      addNotification({
        type: "success",
        title: "File Approved",
        message: `File ${data.fileId} has been approved`,
        data,
      });
      // ✅ Update store
      updateFileFromSocket(data);
      window.dispatchEvent(new CustomEvent("po:fileUpdated", { detail: data }));
    });

    socketRef.current.on("fileUpdated", (data) => {
      console.log("📄 Socket: fileUpdated", data.fileId, "Attachments:", data.attachments);
      addNotification({
        type: "info",
        title: "File Updated",
        message: `File ${data.fileId} was updated`,
        data,
      });
      // ✅ Update store immediately
      updateFileFromSocket(data);
      window.dispatchEvent(new CustomEvent("po:fileUpdated", { detail: data }));
    });

    socketRef.current.on("fileRejected", (data) => {
      console.log("📄 Socket: fileRejected", data);
      addNotification({
        type: "error",
        title: "File Rejected",
        message: `File ${data.fileId} has been rejected`,
        data,
      });
      updateFileFromSocket(data);
      window.dispatchEvent(new CustomEvent("po:fileUpdated", { detail: data }));
    });

    socketRef.current.on("fileRevisionRequested", (data) => {
      console.log("📄 Socket: fileRevisionRequested", data);
      addNotification({
        type: "warning",
        title: "Revision Requested",
        message: `File ${data.fileId} requires revision`,
        data,
      });
      updateFileFromSocket(data);
      window.dispatchEvent(new CustomEvent("po:fileUpdated", { detail: data }));
    });

    socketRef.current.on("fileFinalApproved", (data) => {
      console.log("📄 Socket: fileFinalApproved", data);
      addNotification({
        type: "success",
        title: "Final Approval",
        message: `File ${data.fileId} fully approved`,
        data,
      });
      updateFileFromSocket(data);
      window.dispatchEvent(new CustomEvent("po:fileUpdated", { detail: data }));
    });

    socketRef.current.on("slaWarning", (data) => {
      addNotification({
        type: "warning",
        title: "SLA Warning",
        message: `File ${data.fileId} approaching deadline`,
        data,
      });
    });

    socketRef.current.on("fileEscalated", (data) => {
      console.log("📄 Socket: fileEscalated", data);
      addNotification({
        type: "error",
        title: "File Escalated",
        message: `File ${data.fileId} has been escalated`,
        data,
      });
      updateFileFromSocket(data);
      window.dispatchEvent(new CustomEvent("po:fileUpdated", { detail: data }));
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [accessToken, user, addNotification, updateFileFromSocket]);

  return socketRef.current;
};