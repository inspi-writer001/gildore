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
    <div
      id="evolution"
      className="flex flex-col w-full relative md:min-h-[100vh] justify-center justify-self-center"
    >
      <img src={grid} className="absolute z-10 w-full" />
      <div className="__padded_container md:p-12 p-5 flex flex-col w-full h-full gap-8 mb-10">
        <div className="__evolution flex flex-col md:flex-row justify-between gap-2">
          <div className="__header_text anton text-4xl text-left uppercase w-70 ">
            The Evolution of Money
          </div>
          <div className="__backstory md:w-96 text-left md:text-base text-sm">
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
                  <div className=" z-20 relative h-7 anton text-sm py-1 rounded-sm w-28 uppercase font-bold border-b-2 border-[#BCBBBB] text-[#848484] __cta_button_silver">
                    {item.type}
                  </div>
                  <div className="anton relative z-10 h-7 -mt-6 rounded-sm w-28 text-[#6F6E6E] bg-[#6F6E6E] uppercase"></div>
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
            <div className="__image_container md:w-[50%] md:p-10 flex justify-center">
              <img src={next} className="md:w-full w-64" />
            </div>
            <div className="__the_evolution flex flex-col md:mt-0 mt-10 md:w-[50%] text-left gap-4">
              <div className="__title anton text-3xl uppercase ">
                The Next Evolution: Gildore
              </div>
              <div className="__gildore_approach">
                GILDORE combines Earth's oldest reliable money (precious metals)
                with people's digital innovation (blockchain) to create a
                superior savings instrument.
              </div>
              <div className="__gildore_ev w-full flex flex-col gap-4">
                <div className="__1 flex flex-row bg-[#141414] p-2 items-center">
                  <div className="flex mx-2">
                    <img src={gildore_stage_icon_1} className="md:w-7 w-12" />
                  </div>
                  <div className="text-sm">
                    Each token is backed 1:1 by real physical gold or silver
                    stored in secure vaults
                  </div>
                </div>
                <div className="__2 flex flex-row bg-[#141414] p-2 items-center">
                  <div className="flex mx-2">
                    <img src={gildore_stage_icon_2} className="md:w-7 w-12" />
                  </div>
                  <div className="text-sm">
                    Easily convert between digital tokens and physical metals,
                    with options to withdraw your physical assets
                  </div>
                </div>
                <div className="__3 flex flex-row bg-[#141414] p-2 items-center">
                  <div className="flex mx-2">
                    <img src={gildore_stage_icon_3} className="md:w-7 w-12" />
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
