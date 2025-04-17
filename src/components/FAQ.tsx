import { useState } from "react";
import grid from "../assets/grid.svg";
const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  return (
    <div
      id="faq"
      className="flex flex-col w-full relative md:min-h-[100vh] items-center justify-self-center"
    >
      <img src={grid} className="absolute z-10 w-full" />
      <div className="__padded_container md:p-12 p-4 flex flex-col w-full h-full gap-8 mb-20 relative z-20">
        <div className="__how flex flex-col items-center w-full">
          <div className="__header_text anton text-4xl text-center uppercase w-70 ">
            Frequently Asked Questions
          </div>
          <div className="__backstory md:w-96 md:text-base text-sm text-center">
            Find answers to common questions about Gildore tokens, storage,
            redemption, and security.
          </div>
        </div>
        <div className="p-6 rounded-md md:min-w-3xl max-w-3xl mx-auto space-y-2 text-left">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="border border-[#1a1a1a] px-4 py-3 rounded-md cursor-pointer bg-[#171717]"
              onClick={() => toggle(idx)}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-white font-semibold anton">
                  {faq.question}
                </h3>
                <span className="text-white anton text-3xl transition-transform duration-200 px-4">
                  {openIndex === idx ? "−" : "+"}
                </span>
              </div>
              {openIndex === idx && (
                <p className="text-gray-400 mt-2 text-sm">{faq.answer}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "How are GILDORE tokens different from other gold/silver tokens?",
    answer:
      "GILDORE tokens are built on Solana for faster transactions and lower fees, with a simple 1:1 redemption process. Unlike many competitors, we allow direct redemption for physical metals, not just cash value, and our storage is fully audited and insured."
  },
  {
    question: "Is there a minimum purchase requirement?",
    answer: "No, you can start with as little or as much as you like."
  },
  {
    question: "Where are the physical metals stored?",
    answer:
      "They are held in fully insured and audited vaults with trusted custodians."
  },
  {
    question: "How do I redeem my tokens for physical metals?",
    answer:
      "Simply initiate a redemption request in your dashboard. We'll guide you through shipping or local pickup options."
  },
  {
    question: "Are there any fees associated with Gildore?",
    answer:
      "Yes, there is a small management fee, and redemption incurs shipping or handling costs."
  },
  {
    question: "Can I trade Gildore tokens on exchanges?",
    answer:
      "We are working with several DEXs and CEXs to list Gildore tokens soon."
  },
  {
    question: "How do you ensure the security of the metals?",
    answer:
      "Our metals are stored in highly secure, insured vaults and are regularly audited by third-party firms."
  }
];
