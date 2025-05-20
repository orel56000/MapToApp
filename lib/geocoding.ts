/**
 * Fetches the location name from coordinates using OpenStreetMap's Nominatim API
 * This API is free and doesn't require an API key, but has usage limitations
 */
export async function getLocationName(lat: number, lng: number): Promise<string> {
  try {
    // Add a small delay to avoid hitting rate limits
    await new Promise((resolve) => setTimeout(resolve, 300))

    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      {
        headers: {
          // It's good practice to identify your application to the API
          "User-Agent": "LocationOpenerApp/1.0",
        },
      },
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch location name: ${response.status}`)
    }

    const data = await response.json()

    // Format the location name based on available data
    if (data.display_name) {
      // Extract the most relevant parts of the address
      const parts = data.display_name.split(", ")

      // If we have a very long address, simplify it
      if (parts.length > 3) {
        // Try to get a good combination of specific location and area
        return [parts[0], parts[1], parts[parts.length - 3]].join(", ")
      }

      return data.display_name
    }

    return "Unknown location"
  } catch (error) {
    console.error("Error in getLocationName:", error)
    return "Location name unavailable"
  }
}
