import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  businessName: z.string().min(1, "Business name is required"),
  businessType: z.enum([
    "LAW_FIRM",
    "MEDICAL_OFFICE",
    "DENTAL_OFFICE",
    "RESTAURANT",
    "COFFEE_SHOP",
    "RETAIL",
    "OTHER",
  ]),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const chatMessageSchema = z.object({
  message: z.string().min(1),
  businessId: z.string(),
  sessionId: z.string().optional(),
});

export const budgetSchema = z.object({
  businessId: z.string(),
  totalBudget: z.number().positive("Budget must be positive"),
  month: z.string(),
  overrides: z
    .record(z.string(), z.number().min(0).max(100))
    .optional(),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ChatMessageInput = z.infer<typeof chatMessageSchema>;
export type BudgetInput = z.infer<typeof budgetSchema>;
