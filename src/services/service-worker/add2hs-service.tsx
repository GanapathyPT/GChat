import { useEffect, useState } from "react";

let prompt: Event | undefined;

export function useA2HSButton() {
  const [isPromptVisible, setIsPromptVisible] = useState<boolean>(false);

  useEffect(() => {
    const savePromptEvent = (event: Event) => {
      event.preventDefault();
      prompt = event;
      setIsPromptVisible(true);
    };

    window.addEventListener("beforeinstallprompt", savePromptEvent);
    return () =>
      window.removeEventListener("beforeinstallprompt", savePromptEvent);
  }, []);

  useEffect(() => {
    const removePromptEvent = (event: Event) => {
      setIsPromptVisible(false);
      prompt = undefined;
    };

    window.addEventListener("appinstalled", removePromptEvent);
    return () => window.removeEventListener("appinstalled", removePromptEvent);
  }, []);

  const showPrompt = async () => {
    if (prompt === undefined) return;

    (prompt as any).prompt();
    const { outcome }: { outcome: string } = await (prompt as any).userChoice;
    if (outcome === "accepted") setIsPromptVisible(false);
  };

  return {
    isPromptVisible,
    showPrompt,
  };
}
