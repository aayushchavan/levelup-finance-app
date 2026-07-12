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
  // Remove spaces, dashes, parentheses, and plus signs
  const cleaned = phone.replace(/[\s\-()+ ]/g, "");
  
  // Check if it contains only digits and has a reasonable length (7-15 digits)
  const phoneRegex = /^\d{7,15}$/;
  return phoneRegex.test(cleaned);
}
