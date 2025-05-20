"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState, useRef } from "react"
import { MapOpener } from "@/components/map-opener"
import { LinkGenerator } from "@/components/link-generator"
import { getLocationName } from "@/lib/geocoding"

export default function Home() {
  const searchParams = useSearchParams()
  const [location, setLocation] = useState<{
    type: "coordinates" | "pluscode"
    value: { lat?: string; lng?: string; code?: string }
  } | null>(null)
  const [locationName, setLocationName] = useState<string | null>(null)
  const [isLoadingName, setIsLoadingName] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Use a ref to track if we've already processed these search params
  const processedParams = useRef<string | null>(null)

  useEffect(() => {
    // Create a string representation of the current search params to compare
    const currentParams = searchParams.toString()

    // If we've already processed these exact params, don't do it again
    if (processedParams.current === currentParams) {
      return
    }

    // Update our ref to mark these params as processed
    processedParams.current = currentParams

    // Reset state before processing new params
    setError(null)
    setLocationName(null)

    // Check for plus code first
    const plusCode = searchParams.get("code")

    if (plusCode) {
      // Basic validation for plus code format (simplified)
      const plusCodeRegex = /^[23456789CFGHJMPQRVWX]{8,}\+[23456789CFGHJMPQRVWX]{2,}$/
      if (!plusCodeRegex.test(plusCode)) {
        setError("Invalid plus code format.")
        return
      }

      setLocation({
        type: "pluscode",
        value: { code: plusCode },
      })
      return
    }

    // If no plus code, check for lat/lng
    const lat = searchParams.get("lat")
    const lng = searchParams.get("lng")

    if (!lat || !lng) {
      // No location parameters found - we'll show the link generator
      setLocation(null)
      return
    }

    // Basic validation for coordinates
    const latNum = Number.parseFloat(lat)
    const lngNum = Number.parseFloat(lng)

    if (isNaN(latNum) || isNaN(lngNum) || latNum < -90 || latNum > 90 || lngNum < -180 || lngNum > 180) {
      setError("Invalid coordinates. Latitude must be between -90 and 90, and longitude between -180 and 180.")
      return
    }

    setLocation({
      type: "coordinates",
      value: { lat, lng },
    })

    // Fetch location name for coordinates
    setIsLoadingName(true)
    getLocationName(latNum, lngNum)
      .then((name) => {
        setLocationName(name)
      })
      .catch((err) => {
        console.error("Error fetching location name:", err)
        // Don't set an error, just silently fail for location name
      })
      .finally(() => {
        setIsLoadingName(false)
      })
  }, [searchParams])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Location Opener</h1>

          {error ? (
            <p className="mt-2 text-red-500">{error}</p>
          ) : location ? (
            // Show location opener when we have valid coordinates or plus code
            <>
              {locationName && <p className="mt-2 text-lg font-medium text-gray-700">{locationName}</p>}
              {isLoadingName && <p className="mt-2 text-sm text-gray-500">Loading location name...</p>}
              <p className="mt-2 text-gray-600">Choose an app to open this location:</p>
              {location.type === "coordinates" && location.value.lat && location.value.lng && (
                <p className="mt-1 text-sm text-gray-500">
                  Coordinates: {location.value.lat}, {location.value.lng}
                </p>
              )}
              {location.type === "pluscode" && location.value.code && (
                <p className="mt-1 text-sm text-gray-500">Plus Code: {location.value.code}</p>
              )}
              <MapOpener location={location} />
            </>
          ) : (
            // Show link generator when no location is provided
            <LinkGenerator />
          )}
        </div>
      </div>
    </main>
  )
}
