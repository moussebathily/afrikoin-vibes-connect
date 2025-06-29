
import { z } from 'zod';

// User Action Schemas
export const userRegistrationSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Mot de passe trop court'),
  name: z.string().min(2, 'Nom trop court'),
  country: z.string().min(2, 'Pays requis'),
  phone: z.string().optional()
});

export const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Mot de passe requis')
});

// Marketplace Action Schemas
export const listingSchema = z.object({
  title: z.string().min(5, 'Titre trop court'),
  description: z.string().min(20, 'Description trop courte'),
  price: z.number().positive('Prix invalide'),
  category: z.string().min(1, 'Catégorie requise'),
  location: z.string().min(2, 'Localisation requise'),
  images: z.array(z.string()).min(1, 'Au moins une image requise').max(10, 'Maximum 10 images')
});

export const messageSchema = z.object({
  content: z.string().min(1, 'Message vide').max(1000, 'Message trop long'),
  recipientId: z.string().uuid('ID destinataire invalide'),
  attachments: z.array(z.string()).max(5, 'Maximum 5 pièces jointes').optional()
});

// Payment Action Schemas
export const paymentSchema = z.object({
  amount: z.number().positive('Montant invalide'),
  currency: z.enum(['XOF', 'EUR', 'USD'], { errorMap: () => ({ message: 'Devise non supportée' }) }),
  method: z.enum(['orange_money', 'wave', 'stripe', 'bank_transfer']),
  recipientId: z.string().uuid('ID destinataire invalide')
});

// Live Stream Action Schemas
export const streamSchema = z.object({
  title: z.string().min(5, 'Titre trop court'),
  description: z.string().max(500, 'Description trop longue'),
  category: z.string().min(1, 'Catégorie requise'),
  isPrivate: z.boolean().default(false),
  allowedCountries: z.array(z.string()).optional()
});

// Content Creation Schemas
export const contentSchema = z.object({
  type: z.enum(['video', 'audio', 'image', 'document']),
  title: z.string().min(3, 'Titre trop court'),
  tags: z.array(z.string()).max(10, 'Maximum 10 tags'),
  isPublic: z.boolean().default(true),
  ageRestriction: z.number().min(0).max(18).optional()
});

export type UserRegistration = z.infer<typeof userRegistrationSchema>;
export type Login = z.infer<typeof loginSchema>;
export type Listing = z.infer<typeof listingSchema>;
export type Message = z.infer<typeof messageSchema>;
export type Payment = z.infer<typeof paymentSchema>;
export type Stream = z.infer<typeof streamSchema>;
export type Content = z.infer<typeof contentSchema>;
