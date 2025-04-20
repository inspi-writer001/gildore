import { useLoginWithEmail } from "@privy-io/react-auth";
import { useState, FormEvent } from "react";
import { InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "../ui/otp-input";
import { InputOTP } from "../ui/otp-input";
import { REGEXP_ONLY_DIGITS } from "input-otp";

interface AuthFormProps {
  codeSent: boolean;
  setCodeSent: React.Dispatch<React.SetStateAction<boolean>>;
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
}

export const AuthForm = ({
  codeSent,
  setCodeSent,
  email,
  setEmail,
}: AuthFormProps) => {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { sendCode, loginWithCode } = useLoginWithEmail();

  const handleEmailSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    // Validate if it's an email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    try {
      await sendCode({ email });
      setCodeSent(true);
    } catch (err) {
      setError("Failed to send verification code. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!code.trim()) {
      setError("Please enter the verification code");
      return;
    }

    setIsLoading(true);
    try {
      await loginWithCode({ code });
      // Successful login - no need to handle redirection here as Privy will handle it
    } catch (err) {
      setError("Invalid verification code. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      className="w-full mt-8"
      onSubmit={codeSent ? handleCodeSubmit : handleEmailSubmit}
    >
      <div className="w-full flex flex-col gap-4">
        <div className="w-full flex flex-col gap-2">
          {!codeSent ? (
            <>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="text-white h-16 bg-[#171717] border border-[#525252] rounded-md px-4 anton"
                placeholder="Enter your email address"
                required
              />
            </>
          ) : (
            <>
              {/* <input
                type="text"
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="text-white h-16 bg-[#171717] border border-[#525252] rounded-md px-4 anton"
                placeholder="Enter verification code"
                required
              /> */}
              <div className="flex items-center justify-center">
                <InputOTP
                    maxLength={6}
                    value={code}
                    onChange={(value) => setCode(value)}
                    pattern={REGEXP_ONLY_DIGITS}
                >
                    <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                    </InputOTPGroup>
                </InputOTP>
              </div>

              <div className="flex items-center gap-2 py-2">
                <p className="text-sm">Didn't get an email?</p>
                <button
                  type="button"
                  onClick={() => {
                    sendCode({ email });
                  }}
                  className="text-[#D48900] text-sm mt-1 hover:underline text-left"
                >
                  Resend Code
                </button>
              </div>
            </>
          )}

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="__cta_button z-20 relative anton text-2xl py-2 rounded-sm text-[#D48900] uppercase font-bold mt-2 border-b-2 border-[#FAC35D] w-full"
            disabled={isLoading}
          >
            {isLoading ? "loading..." : codeSent ? "Verify" : "Continue"}
          </button>
          <div className="anton relative z-10 text-2xl py-2 -mt-8 rounded-sm text-[#C78406] bg-[#C78406] uppercase w-full">
            {isLoading ? "loading..." : codeSent ? "Verify" : "Continue"}
          </div>
        </div>
      </div>
    </form>
  );
};
