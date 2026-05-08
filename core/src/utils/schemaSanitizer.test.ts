# AETHELGARD MERGED FILE
# Origin Repository: openclaude-main
# Original Path: src\utils\schemaSanitizer.test.ts
# Merge Date: 2026-05-07T19:21:54.168308
# ---

import { describe, expect, test } from 'bun:test'

import { sanitizeSchemaForOpenAICompat } from './schemaSanitizer'

describe('sanitizeSchemaForOpenAICompat', () => {
  test('preserves Grep-like properties.pattern while keeping it required', () => {
    const schema = {
      type: 'object',
      properties: {
        pattern: {
          type: 'string',
          description: 'The regular expression pattern to search for in file contents',
        },
        path: { type: 'string' },
        glob: { type: 'string' },
      },
      required: ['pattern'],
    }

    const sanitized = sanitizeSchemaForOpenAICompat(schema)
    const properties = sanitized.properties as Record<string, unknown> | undefined

    expect(Object.keys(properties ?? {})).toEqual(['pattern', 'path', 'glob'])
    expect(properties?.pattern).toEqual({
      type: 'string',
      description: 'The regular expression pattern to search for in file contents',
    })
    expect(sanitized.required).toEqual(['pattern'])
  })

  test('preserves Glob-like properties.pattern while keeping it required', () => {
    const schema = {
      type: 'object',
      properties: {
        pattern: {
          type: 'string',
          description: 'The glob pattern to match files against',
        },
        path: { type: 'string' },
      },
      required: ['pattern'],
    }

    const sanitized = sanitizeSchemaForOpenAICompat(schema)
    const properties = sanitized.properties as Record<string, unknown> | undefined

    expect(Object.keys(properties ?? {})).toEqual(['pattern', 'path'])
    expect(properties?.pattern).toEqual({
      type: 'string',
      description: 'The glob pattern to match files against',
    })
    expect(sanitized.required).toEqual(['pattern'])
  })

  test('strips JSON Schema validator pattern from string schemas', () => {
    const schema = {
      type: 'string',
      pattern: '^[a-z]+$',
      minLength: 1,
    }

    const sanitized = sanitizeSchemaForOpenAICompat(schema)

    expect(sanitized).toEqual({
      type: 'string',
    })
  })
})
