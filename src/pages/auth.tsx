import { useState } from "react";
import { useLogin } from "@privy-io/react-auth";
import { AuthForm } from "../components/auth/AuthForm";

export const Auth = () => {
  const [codeSent, setCodeSent] = useState(false);
  const [email, setEmail] = useState("");
  const { login } = useLogin();
  return (
    <div className="max-w-[520px] w-full mx-auto">
      <h3 className="text-white anton text-4xl uppercase font-bold">
        {codeSent ? "Enter confirmation code" : "Let's get started"}
      </h3>
      <p className="text-white/80 text-xl mt-2 text-center">
        {codeSent
          ? `Please check ${email} for an email from privy.io and enter your code below.`
          : "Fill in the details to get started"}
      </p>
      <AuthForm
        email={email}
        setEmail={setEmail}
        setCodeSent={setCodeSent}
        codeSent={codeSent}
      />
      {!codeSent && (
        <>
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-white/20" />
            <span className="text-white/50 text-sm uppercase anton">or</span>
            <div className="flex-1 h-px bg-white/20" />
          </div>
          <button
            type="button"
            onClick={() => login({ loginMethods: ["wallet"] })}
            className="__cta_button z-20 relative anton text-2xl py-2 rounded-sm text-[#D48900] uppercase font-bold border-b-2 border-[#FAC35D] w-full"
          >
            Connect Wallet
          </button>
          <div className="anton relative z-10 text-2xl py-2 -mt-8 rounded-sm text-[#C78406] bg-[#C78406] uppercase w-full">
            Connect Wallet
          </div>
        </>
      )}
    </div>
  );
};
