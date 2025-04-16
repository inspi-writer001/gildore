import grid from "../assets/grid.svg";
import government from "../assets/landing/evolution/gildore_government.png";
import earth from "../assets/landing/evolution/gildore_earth.png";
import people from "../assets/landing/evolution/gildore_people.png";
import next from "../assets/landing/evolution/gildore_next_evolution.png";

import gildore_stage_icon_1 from "../assets/landing/icons/gildore_stage_icon_1.svg";
import gildore_stage_icon_2 from "../assets/landing/icons/gildore_stage_icon_2.svg";
import gildore_stage_icon_3 from "../assets/landing/icons/gildore_stage_icon_3.svg";

const Evolution = () => {
  return (
    <div className="flex flex-col w-full  relative h-[100vh] justify-center justify-self-center">
      <img src={grid} className="absolute z-10 w-full" />
      <div className="__padded_container p-12 flex flex-col w-full h-full gap-8">
        <div className="__evolution flex flex-row justify-between">
          <div className="__header_text anton text-4xl text-left uppercase w-70 ">
            The Evolution of Money
          </div>
          <div className="__backstory w-96 text-left">
            From ancient bartering to digital assets, money has continuously
            evolved. Gildore combines the best of traditional and modern value
            systems.
          </div>
        </div>
        <div className="__stages flex md:flex-row flex-col gap-4 w-full justify-between relative z-20">
          {evolution.map((item) => {
            return (
              <div className="__evolution_stages flex flex-col h-[470px] md:w-[32%] w-full bg-[#171717] p-8">
                <div className="__button mt-8">
                  <div className="__cta_button z-20 relative h-7 anton text-sm py-1 rounded-sm w-28 text-[#D48900] uppercase font-bold border-b-2 border-[#FAC35D]">
                    {item.type}
                  </div>
                  <div className="anton relative z-10 h-7 -mt-6 rounded-sm w-28 text-[#C78406] bg-[#C78406] uppercase"></div>
                </div>
                <div className="__header anton text-2xl text-left uppercase mt-1">
                  {item.header}
                </div>
                <div className="__description text-left mt-4 text-sm">
                  {item.description}
                </div>
                <img
                  src={item.image}
                  alt="evoluton_image"
                  className="self-center h-64"
                />
              </div>
            );
          })}
        </div>
        <div className="__next bg-[#171717] p-8 relative z-20">
          <div className="__next_flex flex flex-col md:flex-row md:mt-15">
            <div className="__image_container md:w-[50%] md:p-10">
              <img src={next} className="md:w-full w-64" />
            </div>
            <div className="__the_evolution flex flex-col md:w-[50%] text-left gap-4">
              <div className="__title anton text-3xl uppercase ">
                The Next Evolution: Gildore
              </div>
              <div className="__gildore_approach">
                GILDORE combines Earth's oldest reliable money (precious metals)
                with people's digital innovation (blockchain) to create a
                superior savings instrument.
              </div>
              <div className="__gildore_ev w-full flex flex-col gap-4">
                <div className="__1 flex flex-row bg-[#141414] justify-evenly p-2">
                  <div>
                    <img src={gildore_stage_icon_1} />
                  </div>
                  <div className="text-sm">
                    Each token is backed 1:1 by real physical gold or silver
                    stored in secure vaults
                  </div>
                </div>
                <div className="__2 flex flex-row bg-[#141414] justify-evenly p-2">
                  <div>
                    <img src={gildore_stage_icon_2} />
                  </div>
                  <div className="text-sm">
                    Easily convert between digital tokens and physical metals,
                    with options to withdraw your physical assets
                  </div>
                </div>
                <div className="__3 flex flex-row bg-[#141414] justify-evenly p-2">
                  <div>
                    <img src={gildore_stage_icon_3} />
                  </div>
                  <div className="text-sm">
                    Built on Solana's ultra-fast and low-cost blockchain for
                    efficient trading and transfers
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Evolution;

interface IEvolution {
  type: string;
  header: string;
  description: string;
  image: string;
}

const evolution: IEvolution[] = [
  {
    type: "paper money",
    header: "government money",
    description:
      "Fiat currencies controlled by governments and central banks, subject to inflation and policy changes.",
    image: government
  },
  {
    type: "natural money",
    header: "earth's money",
    description:
      "Precious metals like gold and silver - nature's money with intrinsic value, time-tested for thousands of years.",
    image: earth
  },
  {
    type: "Digital Revolution",
    header: "People's money",
    description:
      "Cryptocurrencies built on blockchain technology, offering decentralization and freedom from central control.",
    image: people
  }
];
