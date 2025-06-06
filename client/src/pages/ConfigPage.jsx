"use client"

import { useState } from "react"
import DashboardLayout from "../components/DashboardLayout"

export default function ConfigPage() {
  const [loading, setLoading] = useState(false)
  const [generalSettings, setGeneralSettings] = useState({
    siteName: "Centre Culturel Ouarzazate",
    contactEmail: "contact@culture-ouarzazate.ma",
    timezone: "Africa/Casablanca",
  })
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    weeklyReports: false,
  })
  const [securitySettings, setSecuritySettings] = useState({
    sessionDuration: 60,
    activityLogging: true,
  })

  const handleSaveSettings = (e) => {
    e.preventDefault()
    // Implement settings save functionality here
    alert("Paramètres enregistrés avec succès")
  }

  return (
    <DashboardLayout>
      <div className="max-w-full mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[oklch(0.145_0_0)]">Configuration du système</h1>
            <p className="text-[oklch(0.556_0_0)] mt-1">Gérez les paramètres du système</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-md border border-[oklch(0.922_0_0)] mb-8 p-6">
          <form onSubmit={handleSaveSettings}>
            <h2 className="text-lg font-semibold mb-6 text-[oklch(0.145_0_0)]">Paramètres du tableau de bord</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-md font-semibold mb-4 text-[oklch(0.145_0_0)]">Informations générales</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-[oklch(0.3_0_0)]">Nom de la plateforme</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-[oklch(0.8_0_0)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(47.3%_0.137_46.201)]"
                      value={generalSettings.siteName}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, siteName: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-[oklch(0.3_0_0)]">Email de contact</label>
                    <input
                      type="email"
                      className="w-full px-4 py-2 border border-[oklch(0.8_0_0)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(47.3%_0.137_46.201)]"
                      value={generalSettings.contactEmail}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, contactEmail: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-[oklch(0.3_0_0)]">Fuseau horaire</label>
                    <select
                      className="w-full px-4 py-2 border border-[oklch(0.8_0_0)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(47.3%_0.137_46.201)]"
                      value={generalSettings.timezone}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, timezone: e.target.value })}
                    >
                      <option value="Africa/Casablanca">Africa/Casablanca</option>
                      <option value="Europe/Paris">Europe/Paris</option>
                      <option value="UTC">UTC</option>
                    </select>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-md font-semibold mb-4 text-[oklch(0.145_0_0)]">Options de notifications</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-[oklch(0.3_0_0)]">Notifications par email</h4>
                      <p className="text-sm text-[oklch(0.556_0_0)]">Recevoir les notifications par email</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={notificationSettings.emailNotifications}
                        onChange={(e) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            emailNotifications: e.target.checked,
                          })
                        }
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[oklch(47.3%_0.137_46.201)]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[oklch(47.3%_0.137_46.201)]"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-[oklch(0.3_0_0)]">Rapports hebdomadaires</h4>
                      <p className="text-sm text-[oklch(0.556_0_0)]">Recevoir un rapport hebdomadaire</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={notificationSettings.weeklyReports}
                        onChange={(e) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            weeklyReports: e.target.checked,
                          })
                        }
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[oklch(47.3%_0.137_46.201)]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[oklch(47.3%_0.137_46.201)]"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[oklch(0.922_0_0)]">
              <h3 className="text-md font-semibold mb-4 text-[oklch(0.145_0_0)]">Sécurité et accès</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <div className="space-y-4">
                    <div>
                      <label className="block mb-2 text-sm font-medium text-[oklch(0.3_0_0)]">
                        Durée de session (minutes)
                      </label>
                      <input
                        type="number"
                        className="w-full px-4 py-2 border border-[oklch(0.8_0_0)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(47.3%_0.137_46.201)]"
                        value={securitySettings.sessionDuration}
                        onChange={(e) =>
                          setSecuritySettings({
                            ...securitySettings,
                            sessionDuration: Number.parseInt(e.target.value),
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-medium text-[oklch(0.3_0_0)]">Journalisation des activités</h4>
                      <p className="text-sm text-[oklch(0.556_0_0)]">Enregistrer toutes les activités admin</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={securitySettings.activityLogging}
                        onChange={(e) =>
                          setSecuritySettings({
                            ...securitySettings,
                            activityLogging: e.target.checked,
                          })
                        }
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[oklch(47.3%_0.137_46.201)]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[oklch(47.3%_0.137_46.201)]"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button className="px-6 py-2 bg-gray-200 text-[oklch(0.145_0_0)] rounded-lg shadow hover:bg-gray-300 transition-colors mr-4">
                Annuler
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-[oklch(47.3%_0.137_46.201)] text-white rounded-lg shadow hover:bg-[oklch(50%_0.137_46.201)] transition-colors"
              >
                Enregistrer les modifications
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}
