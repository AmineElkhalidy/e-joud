import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import ProfilesList from "./_components/ProfilesList";
import AddProfileDialog from "./_components/AddProfileDialog";

export const metadata: Metadata = {
  title: "Profiles | E-JOUD",
  description: "Manage user profiles.",
};

const ProfilesPage = async () => {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/sign-in");
  }

  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  const formattedUsers = users.map((user) => ({
    id: user.id,
    fullName: `${user.firstName} ${user.lastName}`,
    email: user.email,
    role: user.role,
  }));

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-4 mb-12 md:gap-0">
        <h1 className="text-xl font-semibold">User Profiles</h1>
        <AddProfileDialog />
      </div>
      <ProfilesList users={formattedUsers} />
    </div>
  );
};

export default ProfilesPage;
