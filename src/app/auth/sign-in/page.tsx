import { Login } from "@/components/Login";
import { getHomepageData, getPageData } from "@/utils/api";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await getPageData();
  return {
    title: `${pageData.pageTitle || 'Webhooks'} | Sign In`,
    description: "Sign in to your account",
    icons: {
      icon: pageData.favicon,
    },
  };
}

export default async function SignInPage() {
  const result = await getHomepageData();

  return (
    <div>
      <Login homepageData={result ? result.data : null} />
    </div>
  );
};
