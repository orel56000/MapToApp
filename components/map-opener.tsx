"use client"
import { Button } from "@/components/ui/button"
import { Navigation, Store } from "lucide-react"

interface MapOpenerProps {
  location: {
    type: "coordinates" | "pluscode" | "business-only"
    value: {
      lat?: string
      lng?: string
      code?: string
    }
    googleBusinessUrl?: string
    wazeBusinessUrl?: string
  }
}

export function MapOpener({ location }: MapOpenerProps) {
  const openGoogleMapsNavigation = () => {
    let url = ""

    if (location.type === "coordinates" && location.value.lat && location.value.lng) {
      url = `https://www.google.com/maps/dir/?api=1&destination=${location.value.lat},${location.value.lng}&travelmode=driving`
    } else if (location.type === "pluscode" && location.value.code) {
      url = `https://www.google.com/maps/dir/?api=1&destination=${location.value.code}&travelmode=driving`
    }

    window.open(url, "_blank")
  }

  const openWazeNavigation = () => {
    // Waze doesn't directly support plus codes, so we can only use it with coordinates
    if (location.type === "coordinates" && location.value.lat && location.value.lng) {
      const url = `https://waze.com/ul?ll=${location.value.lat},${location.value.lng}&navigate=yes`
      window.open(url, "_blank")
    } else {
      // Show an alert for plus codes
      alert("Waze doesn't directly support Plus Codes. Please use Google Maps instead.")
    }
  }

  const openGoogleMapsBusiness = () => {
    if (location.googleBusinessUrl) {
      window.open(location.googleBusinessUrl, "_blank")
    } else {
      // If no business URL is provided, open regular Google Maps
      let url = ""

      if (location.type === "coordinates" && location.value.lat && location.value.lng) {
        url = `https://www.google.com/maps/search/?api=1&query=${location.value.lat},${location.value.lng}`
      } else if (location.type === "pluscode" && location.value.code) {
        url = `https://www.google.com/maps/search/?api=1&query=${location.value.code}`
      }

      window.open(url, "_blank")
    }
  }

  const openWazeBusiness = () => {
    if (location.wazeBusinessUrl) {
      window.open(location.wazeBusinessUrl, "_blank")
    } else {
      // If no Waze business URL is provided, show an alert
      alert("No Waze business link was provided for this location.")
    }
  }

  // Disable navigation buttons if we only have business URLs without coordinates
  const isNavigationDisabled = location.type === "business-only"

  // Disable Waze navigation button for plus codes
  const isWazeNavigationDisabled = location.type === "pluscode" || isNavigationDisabled

  // Determine if we have business URLs
  const hasGoogleBusinessUrl = !!location.googleBusinessUrl
  const hasWazeBusinessUrl = !!location.wazeBusinessUrl

  // Disable Waze business button if no URL is provided
  const isWazeBusinessDisabled = !hasWazeBusinessUrl

  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
      {/* Navigation Section */}
      <div className="md:col-span-2 mb-1">
        <h3 className="text-sm font-medium text-gray-500 mb-2">Navigation:</h3>
      </div>

      {/* Google Maps Navigation */}
      <Button
        onClick={openGoogleMapsNavigation}
        disabled={isNavigationDisabled}
        className={`h-16 text-sm bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 flex items-center justify-center ${
          isNavigationDisabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <div className="flex items-center">
          <div className="w-8 h-8 mr-2 flex items-center justify-center">
            <img
              src="/images/google-maps-logo.png"
              alt="Google Maps"
              className="max-h-full max-w-full object-contain"
            />
          </div>
          <div className="flex flex-col items-start">
            <span className="font-medium">Google Maps</span>
            <span className="text-xs text-gray-500 flex items-center">
              <Navigation className="w-3 h-3 mr-1" />
              Navigate
            </span>
          </div>
        </div>
      </Button>

      {/* Waze Navigation */}
      <Button
        onClick={openWazeNavigation}
        disabled={isWazeNavigationDisabled}
        className={`h-16 text-sm bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 flex items-center justify-center ${
          isWazeNavigationDisabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <div className="flex items-center">
          <div className="w-8 h-8 mr-2 flex items-center justify-center">
            <img src="/images/waze-logo.png" alt="Waze" className="max-h-full max-w-full object-contain" />
          </div>
          <div className="flex flex-col items-start">
            <span className="font-medium">Waze</span>
            <span className="text-xs text-gray-500 flex items-center">
              <Navigation className="w-3 h-3 mr-1" />
              Navigate
            </span>
          </div>
        </div>
      </Button>

      {/* Business Section */}
      <div className="md:col-span-2 mt-2 mb-1">
        <h3 className="text-sm font-medium text-gray-500 mb-2">Business Information:</h3>
      </div>

      {/* Google Maps Business */}
      <Button
        onClick={openGoogleMapsBusiness}
        disabled={!hasGoogleBusinessUrl && isNavigationDisabled}
        className={`h-16 text-sm ${
          hasGoogleBusinessUrl
            ? "bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-300"
            : "bg-white hover:bg-gray-100 text-gray-800 border border-gray-300"
        } flex items-center justify-center ${
          !hasGoogleBusinessUrl && isNavigationDisabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <div className="flex items-center">
          <div className="w-8 h-8 mr-2 flex items-center justify-center">
            <img
              src="/images/google-maps-logo.png"
              alt="Google Maps"
              className="max-h-full max-w-full object-contain"
            />
          </div>
          <div className="flex flex-col items-start">
            <span className="font-medium">Google Maps</span>
            <span className="text-xs text-gray-500 flex items-center">
              <Store className="w-3 h-3 mr-1" />
              {hasGoogleBusinessUrl ? "Business Info" : "Location Info"}
            </span>
          </div>
        </div>
      </Button>

      {/* Waze Business */}
      <Button
        onClick={openWazeBusiness}
        disabled={isWazeBusinessDisabled}
        className={`h-16 text-sm ${
          hasWazeBusinessUrl
            ? "bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-300"
            : "bg-white hover:bg-gray-100 text-gray-800 border border-gray-300"
        } flex items-center justify-center ${isWazeBusinessDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <div className="flex items-center">
          <div className="w-8 h-8 mr-2 flex items-center justify-center">
            <img src="/images/waze-logo.png" alt="Waze" className="max-h-full max-w-full object-contain" />
          </div>
          <div className="flex flex-col items-start">
            <span className="font-medium">Waze</span>
            <span className="text-xs text-gray-500 flex items-center">
              <Store className="w-3 h-3 mr-1" />
              Business Info
            </span>
          </div>
        </div>
      </Button>
    </div>
  )
}
