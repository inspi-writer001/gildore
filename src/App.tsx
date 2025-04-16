import "./App.css";
import Evolution from "./components/Evolution";
import FAQ from "./components/FAQ";
import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";
import Navbar from "./components/Navbar";
import Waitlist from "./components/Waitlist";

function App() {
  return (
    <div className="gildore_landing flex flex-col w-full h-full">
      <Navbar />
      <Hero />
      <Evolution />
      <HowItWorks />
      <FAQ />
      <Waitlist />
    </div>
  );
}

export default App;
