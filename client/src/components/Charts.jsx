"use client"

import { useState, useEffect, useRef } from "react"
import api from "../api"
import { jsPDF } from "jspdf"
import html2canvas from "html2canvas"
import Chart from "chart.js/auto"

export default function Charts() {
  const [reportData, setReportData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [timeframe, setTimeframe] = useState("month")
  const [chartType, setChartType] = useState("bar")
  const [exporting, setExporting] = useState(false)
  const chartRef = useRef(null)
  const chartInstance = useRef(null)

  useEffect(() => {
    fetchReports()
  }, [timeframe])

  useEffect(() => {
    if (reportData.length > 0) {
      renderChart()
    }
  }, [reportData, chartType])

  const fetchReports = async () => {
    setLoading(true)
    try {
      // Essayer de récupérer les données réelles
      const response = await api.get(`/reports?timeframe=${timeframe}`)
      setReportData(response.data)
      setError(null)
    } catch (error) {
      console.error("Error fetching reports:", error)
      setError("Impossible de charger les données des rapports")

      // Utiliser des données fictives pour le développement
      if (timeframe === "month") {
        setReportData([
          { label: "Janvier", value: 12 },
          { label: "Février", value: 19 },
          { label: "Mars", value: 15 },
          { label: "Avril", value: 22 },
          { label: "Mai", value: 28 },
          { label: "Juin", value: 32 },
        ])
      } else if (timeframe === "quarter") {
        setReportData([
          { label: "Q1", value: 45 },
          { label: "Q2", value: 82 },
          { label: "Q3", value: 67 },
          { label: "Q4", value: 53 },
        ])
      } else {
        setReportData([
          { label: "2023", value: 156 },
          { label: "2024", value: 247 },
          { label: "2025", value: 189 },
        ])
      }
    } finally {
      setLoading(false)
    }
  }

  const renderChart = () => {
    const ctx = document.getElementById("reportChart")
    
    // Détruire le graphique existant s'il y en a un
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }
    
    // Préparer les données pour Chart.js
    const labels = reportData.map(item => item.label)
    const values = reportData.map(item => item.value)
    
    // Configurer les couleurs
    const backgroundColors = [
      'rgba(139, 68, 37, 0.7)',
      'rgba(205, 133, 63, 0.7)',
      'rgba(210, 105, 30, 0.7)',
      'rgba(160, 82, 45, 0.7)',
      'rgba(165, 42, 42, 0.7)',
      'rgba(178, 34, 34, 0.7)',
    ]
    
    // Créer le graphique
    chartInstance.current = new Chart(ctx, {
      type: chartType,
      data: {
        labels: labels,
        datasets: [{
          label: 'Nombre d\'activités',
          data: values,
          backgroundColor: chartType === 'line' 
            ? 'rgba(139, 68, 37, 0.2)' 
            : backgroundColors,
          borderColor: chartType === 'line' 
            ? 'rgba(139, 68, 37, 1)' 
            : backgroundColors.map(color => color.replace('0.7', '1')),
          borderWidth: 1,
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: chartType !== 'bar',
            position: 'top',
          },
          title: {
            display: true,
            text: `Rapport d'activités - ${getTimeframeLabel()}`,
            font: {
              size: 16
            }
          }
        },
        scales: chartType !== 'pie' && chartType !== 'doughnut' ? {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Nombre d\'activités'
            }
          }
        } : undefined
      }
    })
  }

  // Calculer le total des activités
  const totalActivities = reportData.reduce((sum, item) => sum + item.value, 0)

  // Trouver le mois le plus actif
  const mostActiveMonth =
    reportData.length > 0
      ? reportData.reduce((max, item) => (item.value > max.value ? item : max), reportData[0]).label
      : "N/A"

  // Calculer la moyenne mensuelle
  const monthlyAverage = reportData.length > 0 ? Math.round(totalActivities / reportData.length) : 0

  const exportToPDF = async () => {
    if (!chartRef.current) return
    
    setExporting(true)
    try {
      const canvas = await html2canvas(chartRef.current)
      const imgData = canvas.toDataURL('image/png')
      
      const pdf = new jsPDF('landscape', 'mm', 'a4')
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      
      // Ajouter un titre
      pdf.setFontSize(18)
      pdf.setTextColor(40, 40, 40)
      const title = `Rapport d'activités - ${getTimeframeLabel()}`
      pdf.text(title, pdfWidth/2, 20, { align: 'center' })
      
      // Ajouter la date
      pdf.setFontSize(12)
      pdf.setTextColor(100, 100, 100)
      const date = new Date().toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
      pdf.text(`Généré le ${date}`, pdfWidth/2, 30, { align: 'center' })
      
      // Ajouter l'image du graphique
      const imgWidth = pdfWidth - 40
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      pdf.addImage(imgData, 'PNG', 20, 40, imgWidth, imgHeight)
      
      // Ajouter les statistiques récapitulatives
      pdf.setFontSize(14)
      pdf.setTextColor(40, 40, 40)
      pdf.text('Résumé des statistiques', 20, imgHeight + 50)
      
      pdf.setFontSize(12)
      pdf.text(`Total des activités: ${totalActivities}`, 20, imgHeight + 60)
      pdf.text(`${timeframe === 'month' ? 'Mois' : timeframe === 'quarter' ? 'Trimestre' : 'Année'} le plus actif: ${mostActiveMonth}`, 20, imgHeight + 70)
      pdf.text(`Moyenne ${timeframe === 'month' ? 'mensuelle' : timeframe === 'quarter' ? 'trimestrielle' : 'annuelle'}: ${monthlyAverage}`, 20, imgHeight + 80)
      
      // Enregistrer le PDF
      pdf.save(`rapport-activites-${timeframe}-${date}.pdf`)
    } catch (error) {
      console.error('Error exporting to PDF:', error)
    } finally {
      setExporting(false)
    }
  }

  const getTimeframeLabel = () => {
    switch (timeframe) {
      case 'month':
        return 'Mensuel'
      case 'quarter':
        return 'Trimestriel'
      case 'year':
        return 'Annuel'
      default:
        return 'Mensuel'
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[oklch(47.3%_0.137_46.201)]"></div>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow" ref={chartRef}>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-[oklch(0.145_0_0)]">Rapport d'activités</h3>
        <div className="flex gap-2">
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(47.3%_0.137_46.201)]"
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
          >
            <option value="month">Ce mois</option>
            <option value="quarter">Ce trimestre</option>
            <option value="year">Cette année</option>
          </select>
          
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(47.3%_0.137_46.201)]"
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
          >
            <option value="bar">Graphique à barres</option>
            <option value="line">Graphique linéaire</option>
            <option value="pie">Graphique circulaire</option>
            <option value="doughnut">Graphique en anneau</option>
          </select>
          
          <button
            onClick={exportToPDF}
            disabled={exporting}
            className="px-4 py-2 bg-[oklch(47.3%_0.137_46.201)] text-white rounded-lg hover:bg-[oklch(50%_0.137_46.201)] transition-colors flex items-center gap-1 disabled:opacity-50"
          >
            {exporting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Exportation...
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Exporter PDF
              </>
            )}
          </button>
        </div>
      </div>

      {/* Zone du graphique */}
      <div className="h-64 mb-6">
        <canvas id="reportChart" width="400" height="200"></canvas>
      </div>

      {/* Statistiques récapitulatives */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-indigo-50 p-4 rounded-lg">
          <h4 className="font-medium text-indigo-800">Total des activités</h4>
          <p className="text-2xl font-bold mt-2">{totalActivities}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-medium text-green-800">
            {timeframe === "month" ? "Mois" : timeframe === "quarter" ? "Trimestre" : "Année"} le plus actif
          </h4>
          <p className="text-2xl font-bold mt-2">{mostActiveMonth}</p>
        </div>
        <div className="bg-amber-50 p-4 rounded-lg">
          <h4 className="font-medium text-amber-800">
            Moyenne {timeframe === "month" ? "mensuelle" : timeframe === "quarter" ? "trimestrielle" : "annuelle"}
          </h4>
          <p className="text-2xl font-bold mt-2">{monthlyAverage}</p>
        </div>
      </div>
    </div>
  )
}
