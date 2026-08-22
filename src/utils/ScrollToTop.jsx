import { useEffect } from "react";
import { useLocation } from "react-router";

export default function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    // Only scrollable pages return to the top after navigation.
    if (pathname.startsWith("/shop") || pathname.startsWith("/cart")) {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
}
