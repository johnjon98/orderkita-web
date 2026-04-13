import { apiClient } from './base'
import type { Category, MenuItem, ModifierGroup, Modifier, PublicMenu } from '@/types/menu'
import type { PaginatedResponse, UUID } from '@/types/common'

export interface CreateCategoryPayload {
  name: string
  store?: UUID
  display_order?: number
}

export interface CreateMenuItemPayload {
  name: string
  description?: string
  category: UUID
  price_sen: number
  is_available?: boolean
  display_order?: number
  preparation_time_minutes?: number
}

export interface CreateModifierGroupPayload {
  menu_item: UUID
  name: string
  is_required?: boolean
  min_select?: number
  max_select?: number
}

export interface CreateModifierPayload {
  modifier_group: UUID
  name: string
  price_sen?: number
  is_available?: boolean
}

export const menusApi = {
  getPublicMenu(slug: string): Promise<PublicMenu> {
    return apiClient.get(`/menu/${slug}/`)
  },

  listCategories(params?: Record<string, string | number | boolean>): Promise<PaginatedResponse<Category>> {
    return apiClient.get('/categories/', params)
  },

  createCategory(payload: CreateCategoryPayload): Promise<Category> {
    return apiClient.post('/categories/', payload)
  },

  updateCategory(id: UUID, payload: Partial<CreateCategoryPayload>): Promise<Category> {
    return apiClient.patch(`/categories/${id}/`, payload)
  },

  deleteCategory(id: UUID): Promise<void> {
    return apiClient.delete(`/categories/${id}/`)
  },

  listMenuItems(params?: Record<string, string | number | boolean>): Promise<PaginatedResponse<MenuItem>> {
    return apiClient.get('/menu-items/', params)
  },

  getMenuItem(id: UUID): Promise<MenuItem> {
    return apiClient.get(`/menu-items/${id}/`)
  },

  createMenuItem(payload: CreateMenuItemPayload): Promise<MenuItem> {
    return apiClient.post('/menu-items/', payload)
  },

  updateMenuItem(id: UUID, payload: Partial<CreateMenuItemPayload>): Promise<MenuItem> {
    return apiClient.patch(`/menu-items/${id}/`, payload)
  },

  deleteMenuItem(id: UUID): Promise<void> {
    return apiClient.delete(`/menu-items/${id}/`)
  },

  uploadMenuItemImage(id: UUID, file: File): Promise<{ image_url: string }> {
    const form = new FormData()
    form.append('image', file)
    return apiClient.postForm(`/menu-items/${id}/upload-image/`, form)
  },

  createModifierGroup(payload: CreateModifierGroupPayload): Promise<ModifierGroup> {
    return apiClient.post('/modifier-groups/', payload)
  },

  updateModifierGroup(id: UUID, payload: Partial<CreateModifierGroupPayload>): Promise<ModifierGroup> {
    return apiClient.patch(`/modifier-groups/${id}/`, payload)
  },

  deleteModifierGroup(id: UUID): Promise<void> {
    return apiClient.delete(`/modifier-groups/${id}/`)
  },

  createModifier(payload: CreateModifierPayload): Promise<Modifier> {
    return apiClient.post('/modifiers/', payload)
  },

  updateModifier(id: UUID, payload: Partial<CreateModifierPayload>): Promise<Modifier> {
    return apiClient.patch(`/modifiers/${id}/`, payload)
  },

  deleteModifier(id: UUID): Promise<void> {
    return apiClient.delete(`/modifiers/${id}/`)
  },
}
