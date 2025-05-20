"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { parseCoordinates } from "@/lib/coordinates"
import { Check, Copy, Link } from "lucide-react"

export function LinkGenerator() {
  const [input, setInput] = useState("")
  const [generatedLink, setGeneratedLink] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const generateLink = () => {
    try {
      setError(null)
      const coordinates = parseCoordinates(input)

      if (!coordinates) {
        setError("Could not parse coordinates. Please check the format.")
        setGeneratedLink(null)
        return
      }

      // Create the URL with the coordinates
      const url = new URL(window.location.href)
      url.search = ""
      url.searchParams.set("lat", coordinates.lat.toString())
      url.searchParams.set("lng", coordinates.lng.toString())

      setGeneratedLink(url.toString())
    } catch (err) {
      console.error("Error generating link:", err)
      setError("An error occurred while generating the link.")
      setGeneratedLink(null)
    }
  }

  const copyToClipboard = async () => {
    if (!generatedLink) return

    try {
      await navigator.clipboard.writeText(generatedLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  return (
    <div className="mt-4 space-y-6">
      <div>
        <p className="mb-4 text-gray-600">Enter coordinates to generate a shareable location link:</p>
        <div className="space-y-4">
          <div>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g., 32.074937, 34.859204 or 32°04'29.8&quot;N 34°51'33.1&quot;E"
              className="text-center"
            />
            <p className="mt-1 text-xs text-gray-500">Supports decimal coordinates and DMS format</p>
          </div>

          <Button onClick={generateLink} className="w-full">
            <Link className="w-4 h-4 mr-2" />
            Generate Link
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {generatedLink && (
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
          <p className="mb-2 text-sm font-medium text-gray-700">Your location link:</p>
          <div className="flex items-center">
            <Input value={generatedLink} readOnly className="text-xs" />
            <Button variant="outline" size="icon" className="ml-2 flex-shrink-0" onClick={copyToClipboard}>
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
          they can easily navigate to your location.
        </p>
      </div>
    </div>
  )
}
