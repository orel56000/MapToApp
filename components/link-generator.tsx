"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { parseCoordinates } from "@/lib/coordinates"
import { Check, Copy, Link, Loader2 } from "lucide-react"

export function LinkGenerator() {
  const [input, setInput] = useState("")
  const [googleBusinessUrl, setGoogleBusinessUrl] = useState("")
  const [wazeBusinessUrl, setWazeBusinessUrl] = useState("")
  const [generatedLink, setGeneratedLink] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showGoogleMapsHelp, setShowGoogleMapsHelp] = useState(false)

  const generateLink = async () => {
    try {
      setError(null)
      setIsLoading(true)
      setShowGoogleMapsHelp(false)

      // Create the URL with the coordinates
      const url = new URL(window.location.href)
      url.search = ""

      // Check if input is a URL
      const isUrl =
        input.startsWith("http://") ||
        input.startsWith("https://") ||
        input.includes("maps.app.goo.gl") ||
        input.includes("goo.gl") ||
        input.includes("google.com/maps")

      if (isUrl) {
        // For Google Maps links, show the help section instead of trying to parse
        setShowGoogleMapsHelp(true)
        setIsLoading(false)
        return
      }

      // Check if we have coordinates
      let hasCoordinates = false
      if (input.trim()) {
        // Handle direct coordinate input
        const coordinates = parseCoordinates(input)

        if (coordinates) {
          url.searchParams.set("lat", coordinates.lat.toString())
          url.searchParams.set("lng", coordinates.lng.toString())
          hasCoordinates = true
        } else {
          setError(
            "Could not parse coordinates. Please enter coordinates in decimal format (e.g., 32.074937, 34.859204) or DMS format (e.g., 32°04'29.8\"N 34°51'33.1\"E).",
          )
          setGeneratedLink(null)
          setIsLoading(false)
          return
        }
      }

      // Add business URLs if provided
      let hasBusinessUrls = false
      if (googleBusinessUrl.trim()) {
        url.searchParams.set("google", googleBusinessUrl.trim())
        hasBusinessUrls = true
      }

      if (wazeBusinessUrl.trim()) {
        url.searchParams.set("waze", wazeBusinessUrl.trim())
        hasBusinessUrls = true
      }

      // Ensure we have either coordinates or at least one business URL
      if (!hasCoordinates && !hasBusinessUrls) {
        setError("Please enter either coordinates or at least one business URL.")
        setGeneratedLink(null)
        setIsLoading(false)
        return
      }

      setGeneratedLink(url.toString())
    } catch (err) {
      console.error("Error generating link:", err)
      setError(`An error occurred while generating the link: ${err instanceof Error ? err.message : String(err)}`)
      setGeneratedLink(null)
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  return (
    <div className="mt-4 space-y-6">
      <div>
        <p className="mb-4 text-gray-600">Enter location information to generate a shareable link:</p>
        <div className="space-y-4">
          <div>
            <p className="mb-1 text-sm text-gray-600">Coordinates (optional if business links are provided):</p>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g., 32.074937, 34.859204 or 32°04'29.8&quot;N 34°51'33.1&quot;E"
              className="text-center"
            />
            <p className="mt-1 text-xs text-gray-500">
              Supports decimal coordinates (e.g., 32.074937, 34.859204) and DMS format
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-sm text-gray-600 font-medium">Business links (optional if coordinates are provided):</p>

            <div>
              <p className="mb-1 text-xs text-gray-600">Google Maps business link:</p>
              <Input
                value={googleBusinessUrl}
                onChange={(e) => setGoogleBusinessUrl(e.target.value)}
                placeholder="e.g., https://maps.app.goo.gl/..."
                className="text-center"
              />
            </div>

            <div>
              <p className="mb-1 text-xs text-gray-600">Waze business link:</p>
              <Input
                value={wazeBusinessUrl}
                onChange={(e) => setWazeBusinessUrl(e.target.value)}
                placeholder="e.g., https://waze.com/ul/..."
                className="text-center"
              />
            </div>

            <p className="mt-1 text-xs text-gray-500">
              Add direct links to the business on Google Maps and Waze for additional information
            </p>
          </div>

          <Button onClick={generateLink} className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Link className="w-4 h-4 mr-2" />
                Generate Link
              </>
            )}
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {showGoogleMapsHelp && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-md space-y-4">
          <p className="text-sm font-medium text-blue-800">
            It looks like you entered a map link. Due to technical limitations, we can't automatically extract
            coordinates from map links.
          </p>
          <div className="space-y-2">
            <p className="text-sm text-blue-700 font-medium">To get coordinates from Google Maps:</p>
            <ol className="text-xs text-blue-700 list-decimal pl-5 space-y-1">
              <li>Right-click on the location in Google Maps</li>
              <li>Select "What's here?" or look at the info card at the bottom</li>
              <li>Copy the coordinates (e.g., 32.074937, 34.859204)</li>
              <li>Paste them in the input field above</li>
            </ol>
            <p className="text-sm text-blue-700 mt-2">
              You can also paste your Google Maps and Waze business links in the "Business links" fields to include them
              as options.
            </p>
          </div>
        </div>
      )}

      {generatedLink && (
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
          <p className="mb-2 text-sm font-medium text-gray-700">Your location link:</p>
          <div className="flex items-center">
            <Input value={generatedLink} readOnly className="text-xs" />
            <Button
              variant="outline"
              size="icon"
              className="ml-2 flex-shrink-0"
              onClick={() => copyToClipboard(generatedLink)}
            >
              {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          <div className="mt-4">
            <Button variant="default" className="w-full" onClick={() => (window.location.href = generatedLink)}>
              Open This Location
            </Button>
          </div>
        </div>
      )}

      <div className="border-t border-gray-200 pt-4">
        <p className="text-sm text-gray-500">
          This tool creates a link that opens a location in Google Maps or Waze. Share the generated link with others so
          they can easily navigate to your location or view business information.
        </p>
      </div>
    </div>
  )
}
