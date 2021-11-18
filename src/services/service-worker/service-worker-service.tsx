import { useEffect } from "react";
import { AuthStatus, useAuth } from "../auth/AuthContext";

export function useServiceWorker() {
  const { status } = useAuth();

  useEffect(() => {
    if (status !== AuthStatus.Authenticated) return;
    if (!("serviceWorker" in navigator)) return;

    const workerFileUrl = `${process.env.PUBLIC_URL}/service-worker.js`;
    navigator.serviceWorker.register(workerFileUrl);
  }, [status]);
}
