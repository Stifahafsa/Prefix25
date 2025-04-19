import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import api from '../api';

// Register the necessary components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function ReportsChart() {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        // Try to fetch reports data
        const response = await api.get('/reports');
        setReportData(response.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching reports:', error);
        setError('Impossible de charger les données des rapports');
        
        // Fallback to mock data if API fails
        setReportData([
          { label: 'Janvier', value: 12 },
          { label: 'Février', value: 19 },
          { label: 'Mars', value: 15 },
          { label: 'Avril', value: 22 },
          { label: 'Mai', value: 28 },
          { label: 'Juin', value: 32 }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const data = {
    labels: reportData.map(report => report.label),
    datasets: [
      {
        label: 'Activités mensuelles',
        data: reportData.map(report => report.value),
        backgroundColor: 'rgba(79, 70, 229, 0.6)',
        borderColor: 'rgba(79, 70, 229, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Statistiques mensuelles',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Nombre d\'activités'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Mois'
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-4">
        <p>{error}</p>
        <p className="mt-2 text-sm">Affichage des données de démonstration.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Rapport d'activités</h3>
      <div className="h-80">
        <Bar data={data} options={options} />
      </div>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-indigo-50 p-4 rounded-lg">
          <h4 className="font-medium text-indigo-800">Total des activités</h4>
          <p className="text-2xl font-bold mt-2">
            {reportData.reduce((sum, item) => sum + item.value, 0)}
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-medium text-green-800">Mois le plus actif</h4>
          <p className="text-2xl font-bold mt-2">
            {reportData.length > 0 ? 
              reportData.reduce((max, item) => item.value > max.value ? item : max, reportData[0]).label 
              : 'N/A'}
          </p>
        </div>
        <div className="bg-amber-50 p-4 rounded-lg">
          <h4 className="font-medium text-amber-800">Moyenne mensuelle</h4>
          <p className="text-2xl font-bold mt-2">
            {reportData.length > 0 ? 
              Math.round(reportData.reduce((sum, item) => sum + item.value, 0) / reportData.length) 
              : 'N/A'}
          </p>
        </div>
      </div>
    </div>
  );
}