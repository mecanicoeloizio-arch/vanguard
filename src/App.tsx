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
import { TalentCooperativePortal } from './components/cooperative/TalentCooperativePortal';
import { EnrollmentFormModal } from './components/academic/EnrollmentFormModal';
import { WebmailPortal } from './components/mail/WebmailPortal';
import { ElowaWhatsAppPortal } from './components/elowa/ElowaWhatsAppPortal';
import { EloSignApp } from './components/elosign/EloSignApp';
import { EloContabilApp } from './components/elocontabil/EloContabilApp';
import { EloMakPortal } from './components/elomak/EloMakPortal';
import { GrupoEloizioPortal } from './components/portal/GrupoEloizioPortal';
import { CentralMasterPanel } from './components/admin/CentralMasterPanel';
import { LGPDBanner } from './components/common/LGPDBanner';

const MainContent: React.FC = () => {
  const { activeNavTab } = useApp();

  return (
    <main className="min-h-[calc(100vh-4rem)] flex-1">
      {activeNavTab === 'portal' && <GrupoEloizioPortal />}
      {activeNavTab === 'showcase' && <CourseShowcase />}
      {activeNavTab === 'elomak' && <EloMakPortal />}
      {activeNavTab === 'cooperative' && <TalentCooperativePortal />}
      {activeNavTab === 'student' && <StudentPortal />}
      {activeNavTab === 'teacher' && <TeacherPortal />}
      {activeNavTab === 'admin' && <AdminPortal />}
      {activeNavTab === 'central_config' && <CentralMasterPanel />}
      {activeNavTab === 'validator' && <CertificateValidator />}
      {activeNavTab === 'chat' && <SchoolChat />}
      {activeNavTab === 'calendar' && <AcademicCalendarAndLibrary />}
      {activeNavTab === 'manuals' && <SystemManualsView />}
      {activeNavTab === 'webmail' && <WebmailPortal />}
      {activeNavTab === 'elowa' && <ElowaWhatsAppPortal />}
      {activeNavTab === 'elosign' && <EloSignApp />}
      {activeNavTab === 'elocontabil' && <EloContabilApp />}
    </main>
  );
};

const AppModals: React.FC = () => {
  const { showEnrollmentModal, setShowEnrollmentModal, selectedCourseForEnrollment } = useApp();

  return (
    <>
      <MercadoPagoModal />
      <HelpDeskModal />
      <AuthModal />
      <SofiaVirtualAssistant />
      <LGPDBanner />
      <EnrollmentFormModal
        isOpen={showEnrollmentModal}
        onClose={() => setShowEnrollmentModal(false)}
        preselectedCourse={selectedCourseForEnrollment}
      />
    </>
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
        <AppModals />
      </div>
    </AppProvider>
  );
}
