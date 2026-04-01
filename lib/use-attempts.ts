"use client";

import { useState } from "react";
import { readAttempts, type AttemptRecord } from "@/lib/attempt-store";

export function useAttempts() {
  const [attempts] = useState<AttemptRecord[]>(() => readAttempts());
  return attempts;
}
