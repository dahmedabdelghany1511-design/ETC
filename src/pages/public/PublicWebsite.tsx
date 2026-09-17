import React, { useState, useEffect } from "react";
import { User } from "../../types";
import { PublicNavbar, PublicNavView } from "../../components/public/PublicNavbar";
import { PublicFooter } from "../../components/public/PublicFooter";
import { HomePage } from "./HomePage";
import { AboutPage } from "./AboutPage";
import { ServicesPage } from "./ServicesPage";
import { ContactPage } from "./ContactPage";
import { PublicAuthPage } from "./PublicAuthPage";

interface PublicWebsiteProps {
  onLoginSuccess: (user: User) => void;
  initialView?: PublicNavView;
}

export const PublicWebsite: React.FC<PublicWebsiteProps> = ({
  onLoginSuccess,
  initialView = "home",
}) => {
  const [activeView, setActiveView] = useState<PublicNavView>(initialView);

  // Scroll to top upon page navigation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeView]);

  // If user requests login or registration, show the dedicated full-screen auth portal
  if (activeView === "login" || activeView === "register") {
    return (
      <PublicAuthPage
        initialMode={activeView}
        onLoginSuccess={onLoginSuccess}
        onBackToWebsite={() => setActiveView("home")}
      />
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-[#F8FAFC] text-[#1E293B] flex flex-col font-sans selection:bg-[#0A4DA3] selection:text-white">
      {/* Public Top Navbar */}
      <PublicNavbar
        activeView={activeView}
        onNavigate={(view) => setActiveView(view)}
      />

      {/* Main Public Page Content */}
      <main className="flex-1">
        {activeView === "home" && <HomePage onNavigate={(v) => setActiveView(v)} />}
        {activeView === "about" && <AboutPage onNavigate={(v) => setActiveView(v)} />}
        {activeView === "services" && <ServicesPage onNavigate={(v) => setActiveView(v)} />}
        {activeView === "contact" && <ContactPage onNavigate={(v) => setActiveView(v)} />}
      </main>

      {/* Public Footer */}
      <PublicFooter onNavigate={(view) => setActiveView(view)} />
    </div>
  );
};
