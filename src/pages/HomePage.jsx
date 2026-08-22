import HomeProduct from "../composants/home-products";
import WhyChoseUs from "../composants/whyChoseUs";
import Hero from "../composants/Hero";
import { useOutletContext } from "react-router";

export default function HomePage() {
  const {data} = useOutletContext();
  return (
    <>
      <Hero />
      <HomeProduct data={data}/>
      <WhyChoseUs />
    </>
  );
}
