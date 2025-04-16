import { useState } from "react";
import grid from "../assets/grid.svg";
const Waitlist = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    // /api/signup
    // Replace with your Supabase or API endpoint
    const response = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });

    if (response.ok) {
      setSubmitted(true);
    } else {
      alert("Something went wrong");
    }
  };
  return (
    <div className="flex flex-col w-full relative items-center justify-self-center overflow-hidden">
      <img src={grid} className="absolute z-10 w-full" />
      <div className="__padded_container p-12 flex flex-col w-full h-full gap-8 mb-20 relative z-20">
        <div className="__how flex flex-col items-center w-full">
          <div className="__header_text anton text-4xl text-center uppercase w-80 ">
            Join our journey and get early access
          </div>
          <div className="__backstory w-96 text-center">
            Join our extensive waitlist today and get notified when we launch 🎉
          </div>
          {!submitted ? (
            <form
              onSubmit={handleSubmit}
              className="space-y-4 w-full md:w-[60%] mt-6 md:max-w-[700px]"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full px-4 py-4 text-gray-200 text-xs rounded-md border border-gray-700 anton"
              />
              <div className="relative flex flex-col items-center w-full">
                <button
                  type="submit"
                  className="__cta_button z-20 relative anton text-2xl py-2 rounded-sm w-full text-[#D48900] uppercase font-bold mt-2 border-b-2 border-[#FAC35D]"
                >
                  Continue
                </button>
                <div className="anton relative z-10 text-2xl py-2 -mt-10.5 rounded-xl w-full text-[#C78406] bg-[#C78406] uppercase">
                  Continue
                </div>
              </div>
            </form>
          ) : (
            <p className="text-green-400">You're on the list! 🎉</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Waitlist;
