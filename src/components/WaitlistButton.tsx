import { FC } from "react";

interface IButton {
  distance: string;
  height: string;
}

const WaitlistButton: FC<IButton> = () => {
  return (
    <div>
      <div className="__cta_button z-20 relative anton text-2xl py-2 rounded-sm w-60 text-[#D48900] uppercase font-bold mt-8 border-b-2 border-[#FAC35D]">
        Join Waiting List
      </div>
      <div className="anton relative z-10 text-2xl py-2 -mt-8 rounded-sm w-60 text-[#C78406] bg-[#C78406] uppercase">
        Join Waiting List
      </div>
    </div>
  );
};

export default WaitlistButton;
