const DEFAULT_ADMIN_API_URL = 'https://order.spokosopot.pl'

export const getAdminApiUrl = () => {
  const value =
    process.env.ADMIN_API_URL ||
    process.env.NEXT_PUBLIC_ADMIN_API_URL ||
    DEFAULT_ADMIN_API_URL

  return value.replace(/\/+$/, '')
}

export const fetchAdminJson = async <T>(path: string): Promise<T | null> => {
  try {
    const response = await fetch(`${getAdminApiUrl()}${path}`, {
      cache: 'no-store',
      headers: {
        Accept: 'application/json',
      },
    })

    if (!response.ok) return null

    return (await response.json()) as T
  } catch (error) {
    console.error(`Błąd pobierania danych z admin API (${path}):`, error)
    return null
  }
}
