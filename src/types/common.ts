export type UUID = string

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    page: number
    page_size: number
    total_count: number
    total_pages: number
  }
}

export interface ApiResponse<T> {
  data: T
}

export interface ApiError {
  error: {
    code: string
    message: string
  }
}
