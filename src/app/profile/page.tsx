import { Profile } from "@/components/Profile";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Webhooks | Profile",
    description: "Profile",
};

const ProfilePage: React.FC = () => {
  return (
    <div>
      <Profile />
    </div>
  );
};

export default ProfilePage;