export interface Product {
  id: number
  title: string
  price: number
  description: string
  image: string
  category: string
  rating: {
    rate: number
    count: number
  }
}

export type Category = string

export interface EnquiryRequest {
  productId: number
  name: string
  email: string
  message: string
}

export interface EnquiryResponse {
  id: string
  submittedAt: string
}

export interface ApiResponse<T> {
  data: T
}

export interface ApiError {
  error: string
  details?: Array<{ field: string; message: string }>
}
