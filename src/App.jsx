import { Icon } from "@iconify/react";
import NavBar from "./composants/NavBar";
import Hero from "./composants/Hero";
import HomeProduct from "./composants/home-products";
import WhyChooseUs from "./composants/whyChoseUs";
import Footer from "./composants/footer";
import Sidebar from "./composants/SideBar";
import Overlay from "./composants/Overlay";
import { Outlet } from "react-router";
import { useEffect, useState } from "react";
import Loader from "./composants/Loader";
import ScrollToTop from "./utils/ScrollToTop";
import useFetchData from "./hooks/useFetchData";
import styles from "./styles/app.module.css";

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { data, loading, error } = useFetchData();
  const [cartArticles, setCartArticles] = useState([]);

  return (
    <div>
      <ScrollToTop />
      {isSidebarOpen && <Overlay closeSidebar={setIsSidebarOpen} />}
      {isSidebarOpen && <Sidebar closeSidebar={setIsSidebarOpen} />}
      <div>
        <NavBar
          openSidebar={setIsSidebarOpen}
          nbrOfItems={cartArticles.reduce((acc, elt) => acc + elt.count, 0)}
        />
        {loading ? (
          <Loader />
        ) : error ? (
          <p className={styles.error}>
            Oups! Quelque chose c'est mal passé lors du chargement des
            ressources.
          </p>
        ) : (
          <Outlet context={{ data, cartArticles, setCartArticles }} />
        )}
        <Footer />
      </div>
    </div>
  );
}
