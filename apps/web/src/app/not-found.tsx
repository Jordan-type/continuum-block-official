import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SunMoon } from "lucide-react";
import Image from "next/image";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <div className="not-found-page">

      {/* Main Content */}
      <div className="not-found-page__content">
        {/* Logo */}
        <div className="not-found-page__logo">
          <Image src="/404_page.png" alt="404" width={500} height={500} />
        </div>
        {/* Message */}
        <div className="not-found-page__message">
          <h2 className="not-found-page__subtitle">Page Not Found?</h2>
          <p className="not-found-page__description">
            Whoops, this is embarrassing. Looks like the page you were looking for wasn’t found.
          </p>
        </div>

        {/* Back to Home Button */}
        <Link href="/">
          <Button className="not-found-page__button">Back to Home</Button>
        </Link>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}