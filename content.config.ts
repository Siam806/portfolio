import { defineCollection, glob } from 'astro:content';
import { projectSchema, serviceSchema } from './src/content/schemas';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/projects' }),
  schema: projectSchema,
});

const services = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/services' }),
  schema: serviceSchema,
});

export const collections = {
  projects,
  services,
};
