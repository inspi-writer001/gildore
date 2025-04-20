import grid from "../assets/grid.svg";
import money_pie from "../assets/landing/how_it_works/gildore_money_pie.png";
import wraped_cash from "../assets/landing/how_it_works/gildore_money_wrap.png";

const HowItWorks = () => {
  return (
    <div
      id="how-it-works"
      className="flex flex-col w-full relative md:min-h-[100vh] justify-center justify-self-center"
    >
      <img src={grid} className="absolute z-10 w-full" />
      <div className="__padded_container md:p-12 p-4 flex flex-col w-full h-full gap-8 mb-20">
        <div className="__how flex flex-col items-center w-full">
          <div className="__header_text anton text-4xl text-center uppercase w-70 ">
            How Gildore Works
          </div>
          <div className="__backstory md:w-96 md:text-base text-sm text-center">
            A simple, secure way to own precious metals on the blockchain with
            full redemption rights.
          </div>
        </div>
      </div>
      <div className="__stages flex md:flex-row md:p-12 p-4 flex-col md:flex-wrap gap-4 w-full justify-between relative z-20">
        {steps.map((item, index) => {
          return (
            <div
              className={` ${
                item.image.length < 2 ? "bg-[#171717]" : "bg-transparent"
              }  ${
                index == 2 || index == 3 ? " md:flex hidden " : " "
              } __evolution_stages flex flex-col h-[420px] md:w-[32%] w-full p-8 py-12 justify-between`}
            >
              {item.image.length < 2 && (
                <div className="__button">
                  <div
                    className={`z-20 text-center flex justify-center items-center relative h-10 anton text-xl py-1 rounded-sm w-7 uppercase font-bold border-b-2 
                   ${
                     item.is_gold
                       ? " border-[#FAC35D] text-[#D48900] __cta_button"
                       : " border-[#BCBBBB] text-[#848484] __cta_button_silver"
                   }`}
                  >
                    {item.step}
                  </div>
                  <div
                    className={`anton relative z-10 h-9 -mt-8 rounded-sm uppercase w-7 ${
                      item.is_gold
                        ? "text-[#C78406] bg-[#C78406]"
                        : "text-[#6F6E6E] bg-[#6F6E6E]"
                    } `}
                  ></div>
                </div>
              )}
              <div className="__texts">
                <div className="__header anton text-3xl text-left uppercase ">
                  {item.header}
                </div>
                <div className="__description text-left text-sm mt-2">
                  {item.description}
                </div>
              </div>
              {item.image.length > 2 && (
                <img
                  src={item.image}
                  alt="evoluton_image"
                  className="self-center h-80"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HowItWorks;

interface IStep {
  step: string;
  header: string;
  description: string;
  image: string;
  is_gold: boolean;
}

const steps: IStep[] = [
  {
    step: "1",
    header: "Purchase Tokens",
    description:
      "Buy GILDORE gold or silver tokens directly from our platform using SOL or other cryptocurrencies",
    image: "",
    is_gold: true
  },
  {
    step: "2",
    header: "Secure Storage",
    description:
      "Your physical metals are stored in high-security vaults, audited regularly and fully insured.",
    image: "",
    is_gold: false
  },
  {
    step: "",
    header: "",
    description: "",
    image: money_pie,
    is_gold: false
  },
  {
    step: "",
    header: "",
    description: "",
    image: wraped_cash,
    is_gold: false
  },
  {
    step: "3",
    header: "Lend or Hold",
    description:
      "Freely Lend your Assets on Solana Lending and Borrowing Platforms or hold them as a hedge against inflation.",
    image: "",
    is_gold: true
  },
  {
    step: "4",
    header: "Redeem Physical Metal",
    description:
      "Convert your tokens to physical gold or silver bars and coins with our simple redemption process.",
    image: "",
    is_gold: false
  }
];
