import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users2,
  Folder,
  BarChart2,
  TrendingUp,
  Box,
  UserCheck,
  FileText,
  PieChart,
  ShieldCheck,
  Settings
} from 'lucide-react';
import { LiveBackendFeaturesModal } from './LiveBackendFeaturesModal';

interface AppTileConfig {
  name: string;
  path: string;
  icon: React.ElementType;
  iconColor: string;
}

const WORKSPACE_APPS: AppTileConfig[] = [
  {
    name: 'People',
    path: '/dashboard/people',
    icon: Users2,
    iconColor: '#2563EB', // Blue
  },
  {
    name: 'Projects',
    path: '/dashboard/projects',
    icon: Folder,
    iconColor: '#0284C7', // Sky Blue
  },
  {
    name: 'Finance',
    path: '/dashboard/accounting',
    icon: BarChart2,
    iconColor: '#059669', // Emerald Green
  },
  {
    name: 'Sales & CRM',
    path: '/dashboard/crm',
    icon: TrendingUp,
    iconColor: '#D97706', // Warm Gold / Amber
  },
  {
    name: 'Inventory',
    path: '/dashboard/inventory',
    icon: Box,
    iconColor: '#10B981', // Mint Teal
  },
  {
    name: 'HR & Payroll',
    path: '/dashboard/hr',
    icon: UserCheck,
    iconColor: '#059669', // Emerald
  },
  {
    name: 'Documents',
    path: '/dashboard/documents',
    icon: FileText,
    iconColor: '#3B82F6', // Blue
  },
  {
    name: 'Reports',
    path: '/dashboard/reports',
    icon: PieChart,
    iconColor: '#0D9488', // Teal
  },
  {
    name: 'Compliance',
    path: '/dashboard/compliance',
    icon: ShieldCheck,
    iconColor: '#2563EB', // Blue
  },
  {
    name: 'Settings',
    path: '/dashboard/settings',
    icon: Settings,
    iconColor: '#9333EA', // Purple
  },
];

export const WorkspaceGrid: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <div className="w-full select-none">
      {/* Section Header matching canonical reference exactly */}
      <div className="flex items-center justify-between mb-2.5 px-1">
        <h3 className="text-xs sm:text-[13px] font-semibold text-[#65758B] tracking-wide">
          Your Workspace
        </h3>

        <button
          onClick={() => setIsModalOpen(true)}
          className="text-xs font-semibold text-[#102B4E] hover:text-[#C69A43] transition-colors flex items-center gap-1 group cursor-pointer"
        >
          <span>All Apps</span>
          <span className="transition-transform group-hover:translate-x-0.5">→</span>
        </button>
      </div>

      {/* Exact 2 Rows × 5 Columns Grid matching reference image */}
      <div className="grid grid-cols-5 gap-2 sm:gap-2.5">
        {WORKSPACE_APPS.map((app) => {
          const Icon = app.icon;
          return (
            <Link
              key={app.name}
              to={app.path}
              className="gn-app-tile p-2.5 sm:p-3 flex flex-col items-center justify-center text-center cursor-pointer group relative aspect-square sm:aspect-auto sm:min-h-[76px]"
            >
              {/* Clean App Icon */}
              <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center mb-1 transition-transform group-hover:scale-110 duration-200">
                <Icon
                  className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.8]"
                  style={{ color: app.iconColor }}
                />
              </div>

              {/* Compact App Label */}
              <span className="text-[10.5px] sm:text-[11.5px] font-semibold text-[#102B4E] leading-tight truncate max-w-full">
                {app.name}
              </span>
            </Link>
          );
        })}
      </div>

      {/* All Apps & Backend Modules Directory Modal */}
      <LiveBackendFeaturesModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
