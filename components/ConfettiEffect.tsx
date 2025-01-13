"use client";

import { useEffect } from "react";
import { useConfettiStore } from "@/hooks/useConfettiStore";

interface Props {
  isComplete: boolean;
}

export function ConfettiEffect({ isComplete }: Props) {
  const confetti = useConfettiStore();

  useEffect(() => {
    // Fire confetti only if the form is complete and confetti hasn't been fired
    if (isComplete && !confetti.hasFired) {
      confetti.onOpen();
    }

    // Optional: Reset if the form becomes incomplete again
    if (!isComplete) {
      confetti.reset();
    }
  }, [isComplete, confetti]);

  return null;
}
