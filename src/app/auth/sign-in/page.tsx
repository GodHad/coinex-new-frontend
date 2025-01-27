import { Login } from "@/components/Login";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Webhooks | Sign In",
    description: "Sign in to your account",
};

const SignInPage: React.FC = () => {
  return (
    <div>
      <Login />
    </div>
  );
};

export default SignInPage;