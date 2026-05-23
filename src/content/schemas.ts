import { z } from 'zod';

export const projectSchema = z.object({
  title: z.string(),
  slug: z.string(),
  descriptionDe: z.string(),
  descriptionEn: z.string(),
  category: z.enum(['web', 'data-api']),
  techStack: z.array(z.string()),
  featured: z.boolean(),
  githubUrl: z.string().optional(),
  liveUrl: z.string().optional(),
});

export const serviceSchema = z.object({
  titleDe: z.string(),
  titleEn: z.string(),
  descriptionDe: z.string(),
  descriptionEn: z.string(),
  icon: z.string(),
});

export type Project = z.infer<typeof projectSchema>;
export type Service = z.infer<typeof serviceSchema>;
