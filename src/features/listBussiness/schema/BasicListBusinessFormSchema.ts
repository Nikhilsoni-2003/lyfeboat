import { z } from "zod";

export const BasicListBusinessFormSchema = z.object({
  name: z.string().min(1).max(100),
  tagline: z.string().max(100).optional(),
  description: z.string().optional().default(""),
  logo: z.string().uuid().optional().default(""),
  contact_no: z
    .string()
    .min(1)
    .max(15)
    .regex(/^\+?[0-9]{7,15}$/, "Invalid phone number format"),
  whatsapp_no: z.string().max(15).optional(),
  opening_time: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:MM)"),
  closing_time: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:MM)"),
  establishment: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  payment_mode: z.string().uuid(),
  email: z.string().email().max(254),
  website: z.string().url().max(200).optional().default(""),
  plan: z.string().uuid(),
});
