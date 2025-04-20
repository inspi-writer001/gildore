import { useState } from "react";
import { AuthForm } from "../components/auth/AuthForm";

export const Auth = () => {
  const [codeSent, setCodeSent] = useState(false);
  const [email, setEmail] = useState("");
  return (
    <div className="max-w-[520px] w-full mx-auto">
      <h3 className="text-white anton text-4xl uppercase font-bold">
        {codeSent ? "Enter confirmation code" : "Let’s get started"}
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
    </div>
  );
};
