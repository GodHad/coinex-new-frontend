import { Profile } from "@/components/Profile";
import { getPageData } from "@/utils/api";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await getPageData();
  return {
        title: `${pageData.pageTitle || 'Webhooks'} | Profile`,
        description: "Profile",
        icons: {
            icon: pageData.favicon,
        },
    };
}

const ProfilePage: React.FC = () => {
  return (
    <div>
      <Profile />
    </div>
  );
};

export default ProfilePage;