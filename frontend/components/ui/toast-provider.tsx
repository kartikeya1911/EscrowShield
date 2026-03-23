"use client";

import { Toaster } from "react-hot-toast";

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          borderRadius: "10px",
          border: "1px solid #dce3df",
          background: "#ffffff",
          color: "#0f172a"
        },
        success: {
          iconTheme: {
            primary: "#16a34a",
            secondary: "#f0fdf4"
          }
        }
      }}
    />
  );
}
