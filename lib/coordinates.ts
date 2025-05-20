/**
 * Parses different coordinate formats and returns standardized decimal coordinates
 * Supports:
 * - Decimal: "32.074937, 34.859204"
 * - DMS: "32°04'29.8\"N 34°51'33.1\"E"
 */
export function parseCoordinates(input: string): { lat: number; lng: number } | null {
  // Clean up the input
  const cleaned = input.trim()

  // Try to parse as decimal coordinates first (most common format)
  const decimalRegex = /^\s*(-?\d+\.?\d*)\s*[,\s]\s*(-?\d+\.?\d*)\s*$/
  const decimalMatch = cleaned.match(decimalRegex)

  if (decimalMatch) {
    const lat = Number.parseFloat(decimalMatch[1])
    const lng = Number.parseFloat(decimalMatch[2])

    // Validate the coordinates
    if (isValidCoordinate(lat, lng)) {
      return { lat, lng }
    }
    return null
  }

  // Try to parse as DMS format
  // This regex handles formats like: 32°04'29.8"N 34°51'33.1"E
  const dmsRegex = /(\d+)°(\d+)'(\d+\.?\d*)["']?([NS])\s+(\d+)°(\d+)'(\d+\.?\d*)["']?([EW])/i
  const dmsMatch = cleaned.match(dmsRegex)

  if (dmsMatch) {
    // Extract DMS components for latitude
    const latDeg = Number.parseInt(dmsMatch[1])
    const latMin = Number.parseInt(dmsMatch[2])
    const latSec = Number.parseFloat(dmsMatch[3])
    const latDir = dmsMatch[4].toUpperCase()

    // Extract DMS components for longitude
    const lngDeg = Number.parseInt(dmsMatch[5])
    const lngMin = Number.parseInt(dmsMatch[6])
    const lngSec = Number.parseFloat(dmsMatch[7])
    const lngDir = dmsMatch[8].toUpperCase()

    // Convert DMS to decimal
    let lat = latDeg + latMin / 60 + latSec / 3600
    let lng = lngDeg + lngMin / 60 + lngSec / 3600

    // Apply direction
    if (latDir === "S") lat = -lat
    if (lngDir === "W") lng = -lng

    // Validate the coordinates
    if (isValidCoordinate(lat, lng)) {
      return { lat, lng }
    }
    return null
  }

  // Could not parse the coordinates
  return null
}

/**
 * Validates that coordinates are within valid ranges
 */
function isValidCoordinate(lat: number, lng: number): boolean {
  return !isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180
}
