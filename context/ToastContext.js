import React, { createContext, useContext } from "react";
import toast, { Toaster } from "react-hot-toast";

const ToastContext = createContext();

const TOAST_STYLE = {
  common: (isDarkMode) => ({
    background: isDarkMode ? "#13101A" : "#FFFFFF", // Dark background for dark mode, white for light mode
    color: isDarkMode ? "#FFFFFF" : "#13101A", // Invert text color accordingly
    padding: "16px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.15)",
    borderRadius: "8px",
  }),

  processing: {
    borderLeft: "4px solid #facc15",
  },
  approve: {
    borderLeft: "4px solid #22c55e",
  },
  complete: {
    borderLeft: "4px solid #22c55e",
  },
  reject: {
    borderLeft: "4px solid #ef4444",
  },
  failed: {
    borderLeft: "4px solid #f97316",
  },
  info: {
    borderLeft: "4px solid #2ed3c0",
  },
};

export const ToastProvider = ({ children, isDarkMode = false }) => {
  const showProcessing = (message) => {
    return toast.loading(message, {
      style: {
        ...TOAST_STYLE.common(isDarkMode),
        ...TOAST_STYLE.processing,
      },
      duration: 5000,
    });
  };

  const showApprove = (message) => {
    return toast.success(message, {
      style: {
        ...TOAST_STYLE.common(isDarkMode),
        ...TOAST_STYLE.approve,
      },
      icon: "🎉",
      duration: 5000,
    });
  };

  const showComplete = (message) => {
    return toast.success(message, {
      style: {
        ...TOAST_STYLE.common(isDarkMode),
        ...TOAST_STYLE.complete,
      },
      icon: "🎉",
      duration: 5000,
    });
  };

  const showReject = (message) => {
    return toast.error(message, {
      style: {
        ...TOAST_STYLE.common(isDarkMode),
        ...TOAST_STYLE.reject,
      },
      duration: 5000,
    });
  };

  const showFailed = (message) => {
    return toast.error(message, {
      style: {
        ...TOAST_STYLE.common(isDarkMode),
        ...TOAST_STYLE.failed,
      },
      icon: "❌",
      duration: 5000,
    });
  };

  const showInfo = (message) => {
    return toast(message, {
      style: {
        ...TOAST_STYLE.common(isDarkMode),
        ...TOAST_STYLE.info,
      },
      icon: "ℹ️",
      duration: 4000,
    });
  };

  const updateToast = (id, state, message) => {
    toast.dismiss(id);
    switch (state.toLowerCase()) {
      case "processing":
        return showProcessing(message);
      case "approve":
        return showApprove(message);
      case "complete":
        return showComplete(message);
      case "reject":
        return showReject(message);
      case "failed":
        return showFailed(message);
      case "info":
        return showInfo(message);
      default:
        return toast(message);
    }
  };

  const notify = {
    start: (message = "Processing Transaction ..") => showProcessing(message),
    update: (id, state, message) => updateToast(id, state, message),
    approve: (id, message = "Transaction Approved") => updateToast(id, "approve", message),
    complete: (id, message = "Transaction Completed successfully") => updateToast(id, "complete", message),
    reject: (id, message = "Transaction has been Rejected") => updateToast(id, "reject", message),
    failed: (id, message = "Transaction has Failed") => updateToast(id, "failed", message),
    info: (id, message = "Info") => updateToast(id, "info", message),
  };

  return (
    <ToastContext.Provider
      value={{
        showProcessing,
        showApprove,
        showComplete,
        showReject,
        showFailed,
        showInfo,
        updateToast,
        notify,
        toast,
      }}
    >
      <Toaster
        position="bottom-right"
        toastOptions={{
          success: {
            iconTheme: {
              primary: "#22c55e",
              secondary: "white",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "white",
            },
          },
        }}
      />
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("Toast must be used within ToastProvider");
  return context;
};
