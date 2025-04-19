import React from 'react';
import { 
  CalendarIcon, 
  UsersIcon, 
  ChartBarIcon, 
  ClipboardIcon 
} from "@heroicons/react/24/outline";

export default function SummaryCards({ stats }) {
  // Mapper les icônes en fonction des labels
  const getIconByLabel = (label) => {
    const lowerLabel = label.toLowerCase();
    if (lowerLabel.includes('réservation') || lowerLabel.includes('reservation')) {
      return <ClipboardIcon className="w-6 h-6" />;
    } else if (lowerLabel.includes('événement') || lowerLabel.includes('evenement') || lowerLabel.includes('event')) {
      return <CalendarIcon className="w-6 h-6" />;
    } else if (lowerLabel.includes('talent')) {
      return <UsersIcon className="w-6 h-6" />;
    } else if (lowerLabel.includes('rapport') || lowerLabel.includes('report')) {
      return <ChartBarIcon className="w-6 h-6" />;
    }
    return <ChartBarIcon className="w-6 h-6" />; // Default icon
  };

  // Couleurs pour les cartes (alternance)
  const bgColors = [
    'bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border-blue-300/20',
    'bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-300/20',
    'bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-300/20',
    'bg-gradient-to-br from-emerald-500/10 to-green-500/10 border-emerald-300/20'
  ];

  const iconBgColors = [
    'bg-gradient-to-br from-blue-500 to-indigo-500 text-white',
    'bg-gradient-to-br from-purple-500 to-pink-500 text-white',
    'bg-gradient-to-br from-amber-500 to-orange-500 text-white',
    'bg-gradient-to-br from-emerald-500 to-green-500 text-white'
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className={`rounded-xl shadow-md p-6 border ${bgColors[idx % bgColors.length]} bg-white flex items-center gap-4`}
        >
          <div className={`p-3 rounded-xl ${iconBgColors[idx % iconBgColors.length]} shadow-lg`}>
            {getIconByLabel(stat.label)}
          </div>
          <div>
            <div className="text-3xl font-bold text-[oklch(0.145_0_0)]">{stat.value}</div>
            <div className="text-sm mt-1 text-[oklch(0.556_0_0)]">{stat.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}