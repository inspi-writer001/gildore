import "../styles/polygon.css";
import "../styles/button.css";
import gold from "../assets/landing/gildore_gold.png";
import silver from "../assets/landing/gildore_silver.png";
import grid from "../assets/grid.svg";

const Hero = () => {
  return (
    <div className="flex flex-col w-full p-4 relative h-[100vh] justify-center justify-self-center">
      <div className="gildore_hero flex flex-col w-full h-full relative justify-center items-center">
        <div className="p_outer absolute z-10">
          <div className="p_inner"></div>
        </div>

        <img src={gold} className="absolute z-20 bottom-0 left-0" />
        <img src={silver} className="absolute z-20 bottom-0 right-0" />
        <img src={grid} className="absolute z-20 w-full" />

        <h1 className="__gildore_hero anton font-bold text-7xl uppercase relative z-20">
          Nature's Money. Reinvented.
        </h1>

        <h2 className="__gildore_info inter w-2xl relative z-20">
          Save in real gold and silver, backed by bankss. Mint tokens, grow
          wealth, and own Earth's money - all on Solana
        </h2>

        <div className="__cta_button z-20 relative anton text-2xl py-2 rounded-sm w-60 text-[#D48900] uppercase font-bold mt-8 border-b-2 border-[#FAC35D]">
          Join Waiting List
        </div>
        <div className="anton relative z-10 text-2xl py-2 -mt-8 rounded-sm w-60 text-[#C78406] bg-[#C78406] uppercase">
          Join Waiting List
        </div>

        <button className="__slanted_button absolute w-56 bottom-0 z-20">
          SCROLL DOWN <span>V</span>
        </button>
      </div>
    </div>
  );
};

export default Hero;
