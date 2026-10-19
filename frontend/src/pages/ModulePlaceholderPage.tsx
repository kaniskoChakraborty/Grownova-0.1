import React, { useState } from 'react';
import { AppShell } from '../layouts/AppShell';
import { useLocation, Link } from 'react-router-dom';
import { Bell, CheckCircle2 } from 'lucide-react';
import { CrmModuleView } from '../components/modules/CrmModuleView';
import { AccountingModuleView } from '../components/modules/AccountingModuleView';
import { InventoryModuleView } from '../components/modules/InventoryModuleView';
import { HrModuleView } from '../components/modules/HrModuleView';
import { ReportsModuleView } from '../components/modules/ReportsModuleView';
import {
  PeopleModuleView,
  ProjectsModuleView,
  DocumentsModuleView,
  ComplianceModuleView,
  SettingsModuleView,
  CalendarModuleView
} from '../components/modules/ExtendedModuleViews';
import { QuickActionModals, type ActionModalType } from '../components/dashboard/QuickActionModals';

export const ModulePlaceholderPage: React.FC = () => {
  const location = useLocation();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<ActionModalType>(null);

  // Extract path key from URL (e.g., 'crm', 'accounting', etc.)
  const pathKey = location.pathname.split('/')[2]?.toLowerCase() || 'crm';

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const renderModuleContent = () => {
    switch (pathKey) {
      case 'crm':
        return (
          <CrmModuleView
            onNotify={triggerToast}
            onOpenActionModal={(type) => setActiveModal(type)}
          />
        );
      case 'accounting':
        return (
          <AccountingModuleView
            onNotify={triggerToast}
            onOpenActionModal={(type) => setActiveModal(type)}
          />
        );
      case 'inventory':
        return (
          <InventoryModuleView
            onNotify={triggerToast}
            onOpenActionModal={(type) => setActiveModal(type)}
          />
        );
      case 'hr':
        return (
          <HrModuleView
            onNotify={triggerToast}
            onOpenActionModal={(type) => setActiveModal(type)}
          />
        );
      case 'reports':
        return (
          <ReportsModuleView
            onNotify={triggerToast}
          />
        );
      case 'people':
        return (
          <PeopleModuleView
            onNotify={triggerToast}
          />
        );
      case 'projects':
        return (
          <ProjectsModuleView
            onNotify={triggerToast}
          />
        );
      case 'documents':
        return (
          <DocumentsModuleView
            onNotify={triggerToast}
          />
        );
      case 'compliance':
        return (
          <ComplianceModuleView
            onNotify={triggerToast}
          />
        );
      case 'settings':
        return (
          <SettingsModuleView
            onNotify={triggerToast}
          />
        );
      case 'calendar':
        return (
          <CalendarModuleView
            onNotify={triggerToast}
          />
        );
      default:
        return (
          <CrmModuleView
            onNotify={triggerToast}
            onOpenActionModal={(type) => setActiveModal(type)}
          />
        );
    }
  };

  return (
    <AppShell>
      <div className="w-full max-w-[1600px] mx-auto space-y-4 pb-12">
        
        {/* Clean Workspace Breadcrumb */}
        <div className="flex items-center justify-between text-xs text-[#55677D] py-1">
          <div className="flex items-center gap-2">
            <Link to="/dashboard" className="hover:text-[#102B4E] transition-colors font-medium">Workspace</Link>
            <span className="text-[#55677D]/40">/</span>
            <span className="text-[#102B4E] font-semibold capitalize">{pathKey}</span>
          </div>
        </div>

        {/* Dynamic Module Content View */}
        {renderModuleContent()}

        {/* Quick Action Modals */}
        <QuickActionModals
          activeModal={activeModal}
          onClose={() => setActiveModal(null)}
          onNotify={triggerToast}
        />

        {/* Floating Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-full os-nav-island shadow-2xl border border-white/95 animate-in fade-in slide-in-from-bottom-3 duration-300">
            <Bell className="w-4 h-4 text-[#C69A43]" />
            <span className="text-xs font-bold text-[#102B4E]">{toastMessage}</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
        )}

      </div>
    </AppShell>
  );
};

export default ModulePlaceholderPage;
