import { Login } from "@/components/Login";
import { AdminData } from "@/types/admin-data";
import { getHomepageData } from "@/utils/api";
import Head from "next/head";

export async function getServerSideProps() {
  const homepageData = await getHomepageData();
  return {
    props: {
      homepageData: homepageData.data,
    }
  }
}

export default function SignInPage({ pageTitle, homepageData }: { pageTitle: string; homepageData: Partial<AdminData> }) {
  return (
    <>
      <Head>
        <title>{`${pageTitle || "Webhooks"} | Admin`}</title>
        <meta name="description" content="Sign in to your account" />
      </Head>
      <Login homepageData={homepageData ? homepageData : null} />
    </>
  );
};
