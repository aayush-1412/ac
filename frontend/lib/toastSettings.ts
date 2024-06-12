import { Id, ToastOptions, UpdateOptions, toast } from "react-toastify";

class NotificationManager {
  static defaultToastOptions: ToastOptions = {
    position: "bottom-right",
    autoClose: 2500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "dark",
  };

  // Show success toast
  static showSuccess(message: string, toastId: string = "default"): Id {
    return toast.success(message, { ...this.defaultToastOptions, toastId });
  }

  // Show error toast
  static showError(message: string, toastId: string = "default"): Id {
    return toast.error(message, { ...this.defaultToastOptions, toastId });
  }

  // Show loading toast
  static showLoading(
    message: string = "Loading...",
    toastId: string = "default"
  ): Id {
    return toast.loading(message, { ...this.defaultToastOptions, toastId });
  }

  // Update loading toast to success or error
  static updateLoadingToast(
    loaderId: Id,
    message: string,
    status: number
  ): void {
    const updatedSettings: UpdateOptions = { ...this.defaultToastOptions };
    updatedSettings.render = message;
    updatedSettings.type = status === 1 ? "success" : "error";
    updatedSettings.isLoading = false;
    toast.update(loaderId, updatedSettings);
  }
}

// Default settings for message toasts
export const defaultMessageToastOptions: ToastOptions = {
  position: "bottom-right",
  autoClose: 3000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: false,
  draggable: true,
  progress: undefined,
  theme: "dark",
};

export default NotificationManager;
