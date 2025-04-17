import { useState } from "react";
import grid from "../assets/grid.svg";
const Waitlist = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      const data = await response.json(); // Store parsed body here

      if (response.ok) {
        setSubmitted(true);
      } else if (response.status === 409 && data.message) {
        alert("Yo! 🤝, You're on the waitlist already");
      } else {
        alert("Something went wrong");
      }
    } catch (error) {
      alert("Something went wrong");
    } finally {
      setLoading(false); // stop loading
    }
  };
  return (
    <div
      id="waitlist"
      className="flex flex-col w-full relative items-center justify-self-center overflow-hidden"
    >
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
                  className="__cta_button z-20 flex flex-row justify-center items-center relative anton text-2xl py-2 rounded-sm w-full text-[#D48900] uppercase font-bold mt-2 border-b-2 border-[#FAC35D] min-h-12"
                  disabled={loading}
                >
                  {loading ? (
                    <svg
                      className="animate-spin h-5 w-5 text-[#D48900] self-center"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      ></path>
                    </svg>
                  ) : (
                    "Continue"
                  )}
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
