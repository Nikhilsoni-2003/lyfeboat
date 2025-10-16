import type { AxiosError } from "axios";
import { toast } from "sonner";

export const handleError = (error: AxiosError) => {
  // console.log(error);
  if (error.status === 400) {
    toast.info(error.message);
    return;
  }
  if (error.response) {
    // CHECKING FOR INTERNET CONNECTION ERROR
    if (!window.navigator.onLine) {
      toast.info("Please Check your Internet connection");
      return;
    }
    if (error.code === "ERR_NETWORK") {
      toast.info("Failed to connect to server");
      return;
    }
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    // console.log(error.request);
  } else {
    // Something happened in setting up the request that triggered an Error
    // console.log("Error", error.message);
  }
};
