import { Login } from "@/components/Login";
import { getHomepageData } from "@/utils/api";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Webhooks | Sign In",
  description: "Sign in to your account",
};

export default async function SignInPage() {
  const result = await getHomepageData();

  return (
    <div>
      <Login homepageData={result ? result.data : null} />
    </div>
  );
};
