import { Profile } from "@/components/Profile";
import Head from "next/head";

const ProfilePage = ({ pageTitle }: { pageTitle: string; }) => {
    return (
        <>
            <Head>
                <title>{`${pageTitle || "Webhooks"} | Profile`}</title>
                <meta name="description" content="Profile" />
                
            </Head>
            <Profile />
        </>
    );
};

export default ProfilePage;