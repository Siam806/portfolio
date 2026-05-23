import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { projectSchema, serviceSchema } from './content/schemas';

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
