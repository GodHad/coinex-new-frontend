import { Register } from "@/components/Register";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Webhooks | Sign Up",
    description: "Create your account",
};

const SignUpPage: React.FC = () => {
  return (
    <div>
      <Register />
    </div>
  );
};

export default SignUpPage;