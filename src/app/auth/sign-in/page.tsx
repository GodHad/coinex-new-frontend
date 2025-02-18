import { Login } from "@/components/Login";
import { AdminData } from "@/types/admin-data";
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

export async function getServerSideProps() {
  const result = await getHomepageData();

  return {
    props: {
      result,
    },
  };
}

// Page component
export default function SignInPage({ result }: {
  result?: { data: Partial<AdminData> }
}) {
  return (
    <div>
      <Login homepageData={result ? result.data : null} />
    </div>
  );
}