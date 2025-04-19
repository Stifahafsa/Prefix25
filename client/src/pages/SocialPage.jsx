"use client"

import { useState } from "react"
import DashboardLayout from "../components/DashboardLayout"

export default function SocialPage() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [selectedPlatforms, setSelectedPlatforms] = useState({
    facebook: true,
    twitter: false,
    instagram: true,
    linkedin: false,
  })
  const [selectedEvent, setSelectedEvent] = useState("")
  const [events, setEvents] = useState([
    { id: 1, title: "Concert Andalou" },
    { id: 2, title: "Atelier Photo" },
    { id: 3, title: "Exposition Art Contemporain" },
    { id: 4, title: "Conférence Littéraire" },
  ])

  const handleShare = (e) => {
    e.preventDefault()
    // Implement sharing functionality here
    alert(
      `Message partagé sur ${Object.keys(selectedPlatforms)
        .filter((platform) => selectedPlatforms[platform])
        .join(", ")}`,
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-full mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[oklch(0.145_0_0)]">Réseaux Sociaux</h1>
            <p className="text-[oklch(0.556_0_0)] mt-1">Partagez du contenu sur les réseaux sociaux</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-md border border-[oklch(0.922_0_0)] mb-8 p-6">
          <form onSubmit={handleShare}>
            <div className="mb-6">
              <label htmlFor="event" className="block text-sm font-medium text-[oklch(0.3_0_0)] mb-2">
                Événement associé (optionnel)
              </label>
              <select
                id="event"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(47.3%_0.137_46.201)]"
                value={selectedEvent}
                onChange={(e) => setSelectedEvent(e.target.value)}
              >
                <option value="">Sélectionner un événement</option>
                {events.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label htmlFor="message" className="block text-sm font-medium text-[oklch(0.3_0_0)] mb-2">
                Message
              </label>
              <textarea
                id="message"
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(47.3%_0.137_46.201)]"
                placeholder="Écrivez votre message ici..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              ></textarea>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-[oklch(0.3_0_0)] mb-2">Plateformes</label>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="facebook"
                    className="h-4 w-4 rounded border-gray-300 text-[oklch(47.3%_0.137_46.201)] focus:ring-[oklch(47.3%_0.137_46.201)]"
                    checked={selectedPlatforms.facebook}
                    onChange={(e) => setSelectedPlatforms({ ...selectedPlatforms, facebook: e.target.checked })}
                  />
                  <label htmlFor="facebook" className="ml-2 text-sm text-gray-700">
                    Facebook
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="twitter"
                    className="h-4 w-4 rounded border-gray-300 text-[oklch(47.3%_0.137_46.201)] focus:ring-[oklch(47.3%_0.137_46.201)]"
                    checked={selectedPlatforms.twitter}
                    onChange={(e) => setSelectedPlatforms({ ...selectedPlatforms, twitter: e.target.checked })}
                  />
                  <label htmlFor="twitter" className="ml-2 text-sm text-gray-700">
                    Twitter
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="instagram"
                    className="h-4 w-4 rounded border-gray-300 text-[oklch(47.3%_0.137_46.201)] focus:ring-[oklch(47.3%_0.137_46.201)]"
                    checked={selectedPlatforms.instagram}
                    onChange={(e) => setSelectedPlatforms({ ...selectedPlatforms, instagram: e.target.checked })}
                  />
                  <label htmlFor="instagram" className="ml-2 text-sm text-gray-700">
                    Instagram
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="linkedin"
                    className="h-4 w-4 rounded border-gray-300 text-[oklch(47.3%_0.137_46.201)] focus:ring-[oklch(47.3%_0.137_46.201)]"
                    checked={selectedPlatforms.linkedin}
                    onChange={(e) => setSelectedPlatforms({ ...selectedPlatforms, linkedin: e.target.checked })}
                  />
                  <label htmlFor="linkedin" className="ml-2 text-sm text-gray-700">
                    LinkedIn
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-[oklch(47.3%_0.137_46.201)] text-white rounded-lg shadow hover:bg-[oklch(50%_0.137_46.201)] transition-colors"
              >
                Partager
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}
