// API functions for fetching data

export async function fetchSuggestions(query: string) {
  try {
    const response = await fetch("https://652f91320b8d8ddac0b2b62b.mockapi.io/autocomplete")
    const data = await response.json()

    // Filter suggestions based on query if provided
    if (query) {
      return data.filter(
        (item: any) =>
          item.name.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase()),
      )
    }

    return data
  } catch (error) {
    console.error("Error fetching suggestions:", error)
    return []
  }
}

