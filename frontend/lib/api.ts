export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5005/api"

export const apiUrl = (path: string) =>
  `${API_URL}${path.startsWith("/") ? path : `/${path}`}`

export async function fetchCatalogProducts() {
  const response = await fetch(apiUrl("/catalog"))
  if (!response.ok) {
    throw new Error("Failed to fetch products")
  }
  const data = await response.json()
  return data.data // Following sendSuccess structure { success: true, data: [...] }
}

export async function fetchCatalogProduct(id: string) {
  const response = await fetch(apiUrl(`/catalog/${id}`))
  if (!response.ok) {
    throw new Error("Failed to fetch product")
  }
  const data = await response.json()
  return data.data
}
