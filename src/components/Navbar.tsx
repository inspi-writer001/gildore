import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import gildore_logo from "../assets/gildore_logo.png";
import { useState } from "react";

const navItems = ["About Us", "Evolution", "How It Works", "FAQ"];
function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const Navbar = () => {
  const [activeNav, setActiveNav] = useState(navItems[0]);
  return (
    <Disclosure as="nav">
      <div className="fixed w-[90vw] max-w-[1024px] h-20 z-50 left-1/2 -translate-x-1/2 px-6 py-4 flex items-center justify-between mt-10 bg-transparent">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img src={gildore_logo} alt="Gildore Logo" className=" w-10" />
          <span className="text-white font-extrabold text-xl tracking-wider anton">
            GILDORE
          </span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex bg-[#1a1a1a] px-6 h-full py-1 rounded-lg items-center gap-6 text-sm text-gray-400">
          {navItems.map((item) => (
            <div
              key={item}
              className="relative group cursor-pointer uppercase font-medium"
              onClick={(e) => {
                e.preventDefault();
                const targetId = "#" + item.toLowerCase().split(" ").join("-");
                const target = document.querySelector(targetId);
                if (target) {
                  target.scrollIntoView({ behavior: "smooth", block: "start" });
                  window.history.pushState(null, "", targetId);
                }
                setActiveNav(item);
              }}
            >
              <span
                className={classNames(
                  "group-hover:text-white",
                  activeNav === item ? "text-white" : ""
                )}
              >
                {item}
              </span>
              {activeNav === item && (
                <span className="absolute left-1/2 -bottom-3 transform -translate-x-1/2 w-1 h-1 bg-yellow-500" />
              )}
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="hidden md:block">
          <div
            className="__cta_button z-20 relative anton text-sm py-1 rounded-sm w-40 text-[#D48900] uppercase font-bold border-b-2 border-[#FAC35D]"
            onClick={(e) => {
              e.preventDefault();
              const targetId = "#waitlist";
              const target = document.querySelector(targetId);
              if (target) {
                target.scrollIntoView({ behavior: "smooth", block: "start" });
                window.history.pushState(null, "", targetId);
              }
            }}
          >
            Join Waiting List
          </div>
          <div className="anton relative z-10 text-2xl -mt-7 rounded-sm w-40 text-[#C78406] bg-[#C78406] uppercase">
            Join Waiting List
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <DisclosureButton className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
            <Bars3Icon className="block h-6 w-6" />
            <XMarkIcon className="hidden h-6 w-6" />
          </DisclosureButton>
        </div>
      </div>

      {/* Mobile Navigation */}
      <DisclosurePanel className="md:hidden">
        <div className="pt-24 space-y-1 px-4 pb-3 bg-[#1a1a1a] w-[90vw] max-w-[1024px] mx-auto rounded-b-2xl text-sm text-gray-400 fixed left-1/2 -translate-x-1/2 z-40">
          {navItems.map((item) => (
            <div
              key={item}
              className="relative group cursor-pointer uppercase font-medium py-2"
              onClick={(e) => {
                e.preventDefault();
                const targetId = "#" + item.toLowerCase().split(" ").join("-");
                const target = document.querySelector(targetId);
                if (target) {
                  target.scrollIntoView({ behavior: "smooth", block: "start" });
                  window.history.pushState(null, "", targetId);
                }
                setActiveNav(item);
              }}
            >
              <span
                className={classNames(
                  "group-hover:text-white",
                  activeNav === item ? "text-white" : ""
                )}
              >
                {item}
              </span>
              {activeNav === item && (
                <span className="absolute left-1/2 bottom-0 transform -translate-x-1/2 w-1 h-1 bg-yellow-500" />
              )}
            </div>
          ))}
          <div className="pt-4">
            <div
              className="__cta_button z-20 relative anton text-sm py-1 rounded-sm w-full text-center text-[#D48900] uppercase font-bold border-b-2 border-[#FAC35D]"
              onClick={(e) => {
                e.preventDefault();
                const targetId = "#waitlist";
                const target = document.querySelector(targetId);
                if (target) {
                  target.scrollIntoView({ behavior: "smooth", block: "start" });
                  window.history.pushState(null, "", targetId);
                }
              }}
            >
              Join Waiting List
            </div>
            <div className="anton relative z-10 text-2xl -mt-7 rounded-sm w-full text-center text-[#C78406] bg-[#C78406] uppercase">
              Join Waiting List
            </div>
          </div>
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
};

export default Navbar;
