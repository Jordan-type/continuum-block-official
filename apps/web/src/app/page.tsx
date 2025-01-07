import NonDashboardNavbar from "@/components/NonDashboardNavbar";
import Hero from "@/components/Hero"
import Landing from "@/app/(nondashboard)/landing/page";
import ScrollToTop from "@/components/ScrollToTop";
import Team from "@/components/Team"
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="nondashboard-layout">
      <NonDashboardNavbar />
      <Hero />
      <main className="nondashboard-layout__main">
        <Landing />
      </main>
      <Team />
      <Footer />
      <ScrollToTop />
    </div>
  );
}
