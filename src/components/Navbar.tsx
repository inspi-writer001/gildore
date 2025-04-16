import gildore_logo from "../assets/gildore_logo.png";

const navItems = ["About Us", "Evolution", "How It Works", "FAQ"];

const Navbar = () => {
  return (
    <nav className="fixed w-[90vw] max-w-[1024px] h-20 z-50 left-1/2 -translate-x-1/2 px-6 py-4 flex items-center justify-between mt-10">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <img src={gildore_logo} alt="Gildore Logo" className="h-6 w-6" />
        <span className="text-white font-extrabold text-lg tracking-wider anton">
          GILDORE
        </span>
      </div>

      {/* Navigation */}
      <div className="bg-[#1a1a1a] px-6 h-full py-1 rounded-lg flex items-center gap-6 text-sm text-gray-400">
        {navItems.map((item, idx) => (
          <div
            key={item}
            className="relative group cursor-pointer uppercase font-medium"
          >
            <span
              className={`group-hover:text-white ${
                idx === 0 ? "text-white" : ""
              }`}
            >
              {item}
            </span>
            {idx === 0 && (
              <span className="absolute left-1/2 -bottom-3 transform -translate-x-1/2 w-1 h-1  bg-yellow-500" />
            )}
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <div>
        <div className="__cta_button z-20 relative anton text-sm py-1 rounded-sm w-40 text-[#D48900] uppercase font-bold border-b-2 border-[#FAC35D]">
          Join Waiting List
        </div>
        <div className="anton relative z-10 text-2xl -mt-7 rounded-sm w-40 text-[#C78406] bg-[#C78406] uppercase">
          Join Waiting List
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
