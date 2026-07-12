/**
 * Contact form validation utilities
 */

import { ContactFormData } from "@/lib/types/contact";

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * Validates contact form data
 */
export function validateContactForm(data: ContactFormData): ValidationResult {
  const errors: Record<string, string> = {};

  const name = (data.name || "").trim();
  const email = (data.email || "").trim();
  const phone = (data.phone || "").trim();

  // Name validation
  if (name.length === 0) {
    errors.name = "Name is required";
  } else if (name.length < 2) {
    errors.name = "Name must be at least 2 characters";
  }

  // Email validation
  if (email.length === 0) {
    errors.email = "Email is required";
  } else if (!isValidEmail(email)) {
    errors.email = "Invalid email format";
  }

  // Phone validation
  if (phone.length === 0) {
    errors.phone = "Phone number is required";
  } else if (!isValidPhone(phone)) {
    errors.phone = "Invalid phone number format";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validates email format
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates phone number format (supports various formats)
 */
function isValidPhone(phone: string): boolean {
  // Extract all digits from the phone number
  const digits = phone.replace(/\D/g, "");
  
  // Check if the number of digits is reasonable (between 7 and 18 digits)
  return digits.length >= 7 && digits.length <= 18;
}
