import { describe, expect, it } from 'vitest'
import { projectSchema, serviceSchema } from './schemas'

describe('projectSchema', () => {
  it('validates a valid project entry', () => {
    const validProject = {
      title: 'CTG Spare Parts Shop',
      slug: 'ctg-spare-parts-shop',
      descriptionDe: 'E-Commerce-Plattform für Ersatzteile',
      descriptionEn: 'E-commerce platform for spare parts',
      category: 'web' as const,
      techStack: ['Astro', 'React', 'Stripe'],
      featured: true,
      githubUrl: 'https://github.com/example/ctg-spare-parts',
      liveUrl: 'https://ctg-spare-parts.example.com',
    }

    const result = projectSchema.safeParse(validProject)
    expect(result.success).toBe(true)
  })

  it('validates a valid project entry without optional fields', () => {
    const validProject = {
      title: 'DB Scraper',
      slug: 'db-scraper',
      descriptionDe: 'Automatisierte Datenerfassung',
      descriptionEn: 'Automated data scraping',
      category: 'data-api' as const,
      techStack: ['Python', 'Scrapy'],
      featured: false,
    }

    const result = projectSchema.safeParse(validProject)
    expect(result.success).toBe(true)
  })

  it('rejects a project entry missing required field (category)', () => {
    const invalidProject = {
      title: 'Invalid Project',
      slug: 'invalid-project',
      descriptionDe: 'Missing category',
      descriptionEn: 'Missing category',
      techStack: ['Astro'],
      featured: false,
    }

    const result = projectSchema.safeParse(invalidProject)
    expect(result.success).toBe(false)
    if (!result.success) {
      const hasCategoryError = result.error.issues.some((issue) => issue.path[0] === 'category')
      expect(hasCategoryError).toBe(true)
    }
  })

  it('rejects a project entry with invalid category', () => {
    const invalidProject = {
      title: 'Invalid Project',
      slug: 'invalid-project',
      descriptionDe: 'Invalid category',
      descriptionEn: 'Invalid category',
      category: 'invalid',
      techStack: ['Astro'],
      featured: false,
    }

    const result = projectSchema.safeParse(invalidProject)
    expect(result.success).toBe(false)
  })
})

describe('serviceSchema', () => {
  it('validates a valid service entry', () => {
    const validService = {
      titleDe: 'Webentwicklung',
      titleEn: 'Web Development',
      descriptionDe: 'Moderne Websites',
      descriptionEn: 'Modern websites',
      icon: 'Globe',
    }

    const result = serviceSchema.safeParse(validService)
    expect(result.success).toBe(true)
  })

  it('rejects a service entry missing required field', () => {
    const invalidService = {
      titleDe: 'Webentwicklung',
      titleEn: 'Web Development',
      descriptionDe: 'Moderne Websites',
      icon: 'Globe',
    }

    const result = serviceSchema.safeParse(invalidService)
    expect(result.success).toBe(false)
    if (!result.success) {
      const hasDescriptionEnError = result.error.issues.some(
        (issue) => issue.path[0] === 'descriptionEn'
      )
      expect(hasDescriptionEnError).toBe(true)
    }
  })
})
