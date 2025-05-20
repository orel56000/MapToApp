"use client"
import { Button } from "@/components/ui/button"

interface MapOpenerProps {
  location: {
    type: "coordinates" | "pluscode"
    value: {
      lat?: string
      lng?: string
      code?: string
    }
  }
}

export function MapOpener({ location }: MapOpenerProps) {
  const openGoogleMaps = () => {
    let url = ""

    if (location.type === "coordinates" && location.value.lat && location.value.lng) {
      url = `https://www.google.com/maps/search/?api=1&query=${location.value.lat},${location.value.lng}`
    } else if (location.type === "pluscode" && location.value.code) {
      url = `https://www.google.com/maps/search/?api=1&query=${location.value.code}`
    }

    window.open(url, "_blank")
  }

  const openWaze = () => {
    // Waze doesn't directly support plus codes, so we can only use it with coordinates
    if (location.type === "coordinates" && location.value.lat && location.value.lng) {
      const url = `https://waze.com/ul?ll=${location.value.lat},${location.value.lng}&navigate=yes`
      window.open(url, "_blank")
    } else {
      // Show an alert for plus codes
      alert("Waze doesn't directly support Plus Codes. Please use Google Maps instead.")
    }
  }

  // Disable Waze button for plus codes
  const isWazeDisabled = location.type === "pluscode"

  return (
    <div className="mt-6 space-y-4">
      <Button
        onClick={openGoogleMaps}
        className="w-full h-16 text-lg bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 flex items-center justify-center"
      >
        <div className="flex items-center">
          <div className="w-10 h-10 mr-3 flex items-center justify-center">
            <img
              src="/images/google-maps-logo.png"
              alt="Google Maps"
              className="max-h-full max-w-full object-contain"
            />
          </div>
          <span>Open in Google Maps</span>
        </div>
      </Button>

      <Button
        onClick={openWaze}
        disabled={isWazeDisabled}
        className={`w-full h-16 text-lg bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 flex items-center justify-center ${
          isWazeDisabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <div className="flex items-center">
          <div className="w-10 h-10 mr-3 flex items-center justify-center">
            <img src="/images/waze-logo.png" alt="Waze" className="max-h-full max-w-full object-contain" />
          </div>
          <span>Open in Waze</span>
          {isWazeDisabled && <span className="ml-2 text-xs text-red-500">(Plus Codes not supported)</span>}
        </div>
      </Button>
    </div>
  )
}
