/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { HelpDeskModal } from './components/common/HelpDeskModal';
import { MercadoPagoModal } from './components/payment/MercadoPagoModal';
import { CourseShowcase } from './components/public/CourseShowcase';
import { StudentPortal } from './components/student/StudentPortal';
import { TeacherPortal } from './components/teacher/TeacherPortal';
import { AdminPortal } from './components/admin/AdminPortal';
import { SchoolChat } from './components/chat/SchoolChat';
import { AcademicCalendarAndLibrary } from './components/academic/AcademicCalendarAndLibrary';
import { SystemManualsView } from './components/docs/SystemManualsView';
import { CertificateValidator } from './components/public/CertificateValidator';
import { AuthModal } from './components/auth/AuthModal';
import { SofiaVirtualAssistant } from './components/marketing/SofiaVirtualAssistant';

const MainContent: React.FC = () => {
  const { activeNavTab } = useApp();

  return (
    <main className="min-h-[calc(100vh-4rem)] flex-1">
      {activeNavTab === 'showcase' && <CourseShowcase />}
      {activeNavTab === 'student' && <StudentPortal />}
      {activeNavTab === 'teacher' && <TeacherPortal />}
      {activeNavTab === 'admin' && <AdminPortal />}
      {activeNavTab === 'validator' && <CertificateValidator />}
      {activeNavTab === 'chat' && <SchoolChat />}
      {activeNavTab === 'calendar' && <AcademicCalendarAndLibrary />}
      {activeNavTab === 'manuals' && <SystemManualsView />}
    </main>
  );
};

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
        <Navbar />
        <MainContent />
        <Footer />

        {/* Global Modals & Virtual Specialist */}
        <MercadoPagoModal />
        <HelpDeskModal />
        <AuthModal />
        <SofiaVirtualAssistant />
      </div>
    </AppProvider>
  );
}
