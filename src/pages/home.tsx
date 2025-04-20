import Evolution from "../components/Evolution";
import FAQ from "../components/FAQ";
import Hero from "../components/Hero";
import HowItWorks from "../components/HowItWorks";
import Navbar from "../components/Navbar";
import Waitlist from "../components/Waitlist";

export const Home = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <Evolution />
      <HowItWorks />
      <FAQ />
      <Waitlist />
    </>
  );
};
