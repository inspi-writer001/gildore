import Evolution from "../components/Evolution";
import FAQ from "../components/FAQ";
import Hero from "../components/Hero";
import HowItWorks from "../components/HowItWorks";
import Navbar from "../components/Navbar";
import Waitlist from "../components/Waitlist";

export const Home = () => {
  return (
      <div className="gildore_landing mx-auto w-full">
        <div className="flex flex-col w-full h-full overflow-hidden">
          <Navbar />
          <Hero />
          <Evolution />
          <HowItWorks />
          <FAQ />
          <Waitlist />
        </div>
      </div>
  );
};
