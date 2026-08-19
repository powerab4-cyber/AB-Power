export type User = {
  _id: string
  fullName: string
  email: string
  role: 'admin' | 'client'
  age: number | null
  gender: string | null
  height: number | null
  weight: number | null
  activity: string | null
  goals: string[]
  createdAt: string
  updatedAt: string
}

export type AuthResponse = {
  success: true
  token: string
  user: User
}

export type DashboardStats = {
  users: number
  products: number
  orders: number
}

export type Product = {
  _id: string
  image: string
  category: string
  title: string
  description: string
  weight: string
  price: number
  active: boolean
  createdAt: string
  updatedAt: string
}

export type ProductPayload = {
  image: string
  category: string
  title: string
  description: string
  weight: string
  price: number
  active: boolean
}

export type Order = {
  _id: string
  fullName: string
  phone: string
  wilaya: string
  commune: string
  product: Product
  quantity: number
  status: 'pending' | 'confirmed'
  archived: boolean
  createdAt: string
  updatedAt: string
}

export type OrderPayload = {
  fullName: string
  phone: string
  wilaya: string
  commune: string
  product: string
  quantity?: number
}

export type SignupPayload = {
  fullName: string
  email: string
  password: string
  confirm?: string
  age?: number
  gender?: string
  height?: number
  weight?: number
  activity?: string
  goals?: string[]
}

export type NutritionPlan = {
  bmi: number | null
  bmiCategory: string | null
  bmr: number | null
  tdee: number | null
  dailyCalories: number | null
  primaryGoal: string | null
  protein: number | null
  carbs: number | null
  fat: number | null
  water: number | null
}

export type FoodSuggestion = {
  name: string
  category: string
  per100g: { cal: number; protein: number; carbs: number; fat: number }
  goals: string[]
  fit?: number
}

const API_BASE =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? 'https://ab-power.onrender.com' : '')

const TOKEN_KEY = 'abpower_token'

const GET_CACHE_TTL_MS = 60_000
const getCache = new Map<string, { value: unknown; at: number }>()
const inflight = new Map<string, Promise<unknown>>()

async function cachedGet<T>(path: string): Promise<T> {
  const hit = getCache.get(path)
  if (hit && Date.now() - hit.at < GET_CACHE_TTL_MS) return hit.value as T

  const existing = inflight.get(path)
  if (existing) return existing as Promise<T>

  const promise = request<T>(path).then(
    (value) => {
      getCache.set(path, { value, at: Date.now() })
      inflight.delete(path)
      return value
    },
    (err) => {
      inflight.delete(path)
      throw err
    }
  )
  inflight.set(path, promise)
  return promise
}

export function clearGetCache(paths?: string[]): void {
  if (!paths) {
    getCache.clear()
    inflight.clear()
    return
  }
  for (const p of paths) {
    getCache.delete(p)
    inflight.delete(p)
  }
}

export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

function serverMessage(data: unknown): string | null {
  return data && typeof data === 'object' && 'error' in data && typeof (data as { error: unknown }).error === 'string'
    ? (data as { error: string }).error
    : null
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string | null): void {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

async function request<T>(
  path: string,
  options: { method?: string; body?: unknown; token?: string | null } = {}
): Promise<T> {
  const { method = 'GET', body, token } = options

  const headers: Record<string, string> = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (token) headers['Authorization'] = `Bearer ${token}`

  let res: Response
  try {
    res = await fetch(`${API_BASE}/api${path}`, {
      method,
      headers,
      cache: 'no-store',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new Error('تعذّر الاتصال بالخادم، حاول مجدداً')
  }

  const data: unknown = await res.json().catch(() => null)

  if (!res.ok) {
    throw new ApiError(serverMessage(data) ?? 'حدث خطأ، حاول مجدداً', res.status)
  }

  return data as T
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  return request<AuthResponse>('/auth/login', { method: 'POST', body: { email, password } })
}

export async function signup(payload: SignupPayload): Promise<AuthResponse> {
  return request<AuthResponse>('/auth/signup', { method: 'POST', body: payload })
}

export async function getMe(token: string): Promise<{ success: true; user: User }> {
  return request<{ success: true; user: User }>('/auth/me', { token })
}

export async function getStats(token: string): Promise<{ success: true; stats: DashboardStats }> {
  return request<{ success: true; stats: DashboardStats }>('/admin/stats', { token })
}

export async function getUsers(token: string): Promise<{ success: true; users: User[] }> {
  return request<{ success: true; users: User[] }>('/admin/users', { token })
}

export async function deleteUser(token: string, id: string): Promise<{ success: true; message: string }> {
  return request<{ success: true; message: string }>(`/admin/users/${id}`, { method: 'DELETE', token })
}

export async function updateProfile(
  token: string,
  payload: {
    fullName?: string
    email?: string
    age?: number
    gender?: string
    height?: number
    weight?: number
    activity?: string
    goals?: string[]
  }
): Promise<{ success: true; user: User }> {
  return request<{ success: true; user: User }>('/auth/me', { method: 'PATCH', body: payload, token })
}

export async function getNutrition(
  token: string
): Promise<{ success: true; plan: NutritionPlan; foods: FoodSuggestion[] }> {
  return request<{ success: true; plan: NutritionPlan; foods: FoodSuggestion[] }>('/nutrition', { token })
}

export async function changePassword(
  token: string,
  payload: { currentPassword: string; newPassword: string; confirm?: string }
): Promise<{ success: true; message: string }> {
  return request<{ success: true; message: string }>('/auth/change-password', { method: 'POST', body: payload, token })
}

export async function getProducts(): Promise<{ success: true; products: Product[] }> {
  return cachedGet<{ success: true; products: Product[] }>('/products')
}

export async function getProduct(id: string): Promise<{ success: true; product: Product }> {
  return cachedGet<{ success: true; product: Product }>(`/products/${id}`)
}

export async function getAdminProducts(token: string): Promise<{ success: true; products: Product[] }> {
  return request<{ success: true; products: Product[] }>('/admin/products', { token })
}

export async function createProduct(token: string, payload: ProductPayload): Promise<{ success: true; product: Product }> {
  clearGetCache(['/products'])
  return request<{ success: true; product: Product }>('/admin/products', { method: 'POST', body: payload, token })
}

export async function updateProduct(
  token: string,
  id: string,
  payload: Partial<ProductPayload>
): Promise<{ success: true; product: Product }> {
  clearGetCache(['/products', `/products/${id}`])
  return request<{ success: true; product: Product }>(`/admin/products/${id}`, {
    method: 'PATCH',
    body: payload,
    token,
  })
}

export async function deleteProduct(token: string, id: string): Promise<{ success: true; message: string }> {
  clearGetCache(['/products', `/products/${id}`])
  return request<{ success: true; message: string }>(`/admin/products/${id}`, { method: 'DELETE', token })
}

export async function createOrder(payload: OrderPayload): Promise<{ success: true; order: Order }> {
  return request<{ success: true; order: Order }>('/orders', { method: 'POST', body: payload })
}

export async function getOrders(token: string): Promise<{ success: true; orders: Order[] }> {
  return request<{ success: true; orders: Order[] }>('/admin/orders', { token })
}

export async function confirmOrder(token: string, id: string): Promise<{ success: true; order: Order }> {
  return request<{ success: true; order: Order }>(`/admin/orders/${id}/confirm`, { method: 'PATCH', token })
}

export async function deleteOrder(token: string, id: string): Promise<{ success: true; message: string }> {
  return request<{ success: true; message: string }>(`/admin/orders/${id}`, { method: 'DELETE', token })
}

export async function uploadImage(token: string, file: File): Promise<{ success: true; url: string }> {
  const formData = new FormData()
  formData.append('image', file)

  const headers: Record<string, string> = {}
  if (token) headers['Authorization'] = `Bearer ${token}`

  let res: Response
  try {
    res = await fetch(`${API_BASE}/api/upload`, { method: 'POST', headers, body: formData })
  } catch {
    throw new Error('تعذّر رفع الصورة، حاول مجدداً')
  }

  const data: unknown = await res.json().catch(() => null)
  if (!res.ok) {
    throw new ApiError(serverMessage(data) ?? 'حدث خطأ أثناء رفع الصورة', res.status)
  }

  return data as { success: true; url: string }
}
