import type { UUID } from './common'
import type { Merchant } from './merchant'

export interface Category {
  id: UUID
  merchant: UUID
  store: UUID | null
  name: string
  display_order: number
  is_active: boolean
}

export interface Modifier {
  id: UUID
  modifier_group: UUID
  name: string
  price_sen: number
  is_available: boolean
}

export interface ModifierGroup {
  id: UUID
  menu_item: UUID
  name: string
  is_required: boolean
  min_select: number
  max_select: number
  modifiers: Modifier[]
}

export interface MenuItem {
  id: UUID
  category: UUID
  merchant: UUID
  name: string
  description: string
  price_sen: number
  is_available: boolean
  display_order: number
  image_url: string | null
  image_placeholder: string | null
  preparation_time_minutes: number
  modifier_groups: ModifierGroup[]
}

export interface MenuCategory extends Category {
  items: MenuItem[]
}

export interface PublicMenu {
  merchant: Merchant
  categories: MenuCategory[]
}
