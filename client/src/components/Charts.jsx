"use client";

import { useState, useEffect, useRef } from "react";
import api from "../api";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import Chart from "chart.js/auto";
import { Pie, Bar, Line, Doughnut } from "react-chartjs-2";

export default function Charts() {
  const [data, setData] = useState({
    reservations: [],
    events: [],
    users: [],
  });
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState("month");
  const [chartType, setChartType] = useState("bar");
  const [dataset, setDataset] = useState("reservations");
  const [exporting, setExporting] = useState(false);
  const chartRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, [timeframe]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/reports?timeframe=${timeframe}`);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      // Fallback data
      setData({
        reservations: [
          { label: "Jan", value: 12 },
          { label: "Fév", value: 19 },
          { label: "Mar", value: 15 },
          { label: "Avr", value: 22 },
          { label: "Mai", value: 28 },
          { label: "Jun", value: 32 },
        ],
        events: [
          { label: "Jan", value: 5 },
          { label: "Fév", value: 8 },
          { label: "Mar", value: 6 },
          { label: "Avr", value: 10 },
          { label: "Mai", value: 12 },
          { label: "Jun", value: 15 },
        ],
        users: [
          { label: "Jan", value: 3 },
          { label: "Fév", value: 5 },
          { label: "Mar", value: 4 },
          { label: "Avr", value: 7 },
          { label: "Mai", value: 8 },
          { label: "Jun", value: 10 },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  const exportToPDF = async () => {
    if (!chartRef.current) return;
    
    setExporting(true);
    try {
      const canvas = await html2canvas(chartRef.current);
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // Add title
      pdf.setFontSize(18);
      pdf.setTextColor(40, 40, 40);
      const title = `Rapport ${getTimeframeLabel()} - ${getDatasetLabel()}`;
      pdf.text(title, pdfWidth/2, 20, { align: 'center' });
      
      // Add date
      pdf.setFontSize(12);
      pdf.setTextColor(100, 100, 100);
      const date = new Date().toLocaleDateString('fr-FR');
      pdf.text(`Généré le ${date}`, pdfWidth/2, 30, { align: 'center' });
      
      // Add chart image
      const imgWidth = pdfWidth - 40;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 20, 40, imgWidth, imgHeight);
      
      // Save the PDF
      pdf.save(`rapport-${dataset}-${timeframe}-${date}.pdf`);
    } catch (error) {
      console.error('Error exporting to PDF:', error);
    } finally {
      setExporting(false);
    }
  };

  const getTimeframeLabel = () => {
    switch (timeframe) {
      case 'month': return 'Mensuel';
      case 'quarter': return 'Trimestriel';
      case 'year': return 'Annuel';
      default: return 'Mensuel';
    }
  };

  const getDatasetLabel = () => {
    switch (dataset) {
      case 'reservations': return 'Réservations';
      case 'events': return 'Événements';
      case 'users': return 'Utilisateurs';
      default: return 'Réservations';
    }
  };

  const chartData = {
    labels: data[dataset]?.map(item => item.label) || [],
    datasets: [
      {
        label: getDatasetLabel(),
        data: data[dataset]?.map(item => item.value) || [],
        backgroundColor: [
          'rgba(139, 68, 37, 0.7)',
          'rgba(205, 133, 63, 0.7)',
          'rgba(210, 105, 30, 0.7)',
          'rgba(160, 82, 45, 0.7)',
          'rgba(165, 42, 42, 0.7)',
          'rgba(178, 34, 34, 0.7)',
        ],
        borderColor: [
          'rgba(139, 68, 37, 1)',
          'rgba(205, 133, 63, 1)',
          'rgba(210, 105, 30, 1)',
          'rgba(160, 82, 45, 1)',
          'rgba(165, 42, 42, 1)',
          'rgba(178, 34, 34, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `${getDatasetLabel()} - ${getTimeframeLabel()}`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[oklch(47.3%_0.137_46.201)]"></div>
      </div>
    );
  }

  const renderChart = () => {
    switch (chartType) {
      case 'pie':
        return <Pie data={chartData} options={options} />;
      case 'bar':
        return <Bar data={chartData} options={options} />;
      case 'line':
        return <Line data={chartData} options={options} />;
      case 'doughnut':
        return <Doughnut data={chartData} options={options} />;
      default:
        return <Bar data={chartData} options={options} />;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow" ref={chartRef}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h3 className="text-lg font-semibold text-[oklch(0.145_0_0)]">
          Rapport d'activités
        </h3>
        
        <div className="flex flex-wrap gap-2">
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
            value={dataset}
            onChange={(e) => setDataset(e.target.value)}
          >
            <option value="reservations">Réservations</option>
            <option value="events">Événements</option>
            <option value="users">Utilisateurs</option>
          </select>
          
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(47.3%_0.137_46.201)]"
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
          >
            <option value="bar">Barres</option>
            <option value="line">Ligne</option>
            <option value="pie">Circulaire</option>
            <option value="doughnut">Anneau</option>
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
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Exporter
              </>
            )}
          </button>
        </div>
      </div>

      <div className="h-96 mb-6">
        {renderChart()}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-indigo-50 p-4 rounded-lg">
          <h4 className="font-medium text-indigo-800">Total</h4>
          <p className="text-2xl font-bold mt-2">
            {data[dataset]?.reduce((sum, item) => sum + item.value, 0) || 0}
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-medium text-green-800">Max</h4>
          <p className="text-2xl font-bold mt-2">
            {data[dataset]?.length > 0 
              ? Math.max(...data[dataset].map(item => item.value)) 
              : 0}
          </p>
        </div>
        <div className="bg-amber-50 p-4 rounded-lg">
          <h4 className="font-medium text-amber-800">Moyenne</h4>
          <p className="text-2xl font-bold mt-2">
            {data[dataset]?.length > 0 
              ? Math.round(data[dataset].reduce((sum, item) => sum + item.value, 0) / data[dataset].length) 
              : 0}
          </p>
        </div>
      </div>
    </div>
  );
}