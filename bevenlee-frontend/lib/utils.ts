import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Add this:
export function hasEnvVars(...vars: string[]) {
  return vars.every((v) => process.env[v] !== undefined);
}