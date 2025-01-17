import React from "react";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { CircleDollarSign, LayoutDashboard } from "lucide-react";
import { IconBadge } from "@/components/IconBadge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import CategoryActions from "./_components/Actions";
import CategoryNameForm from "./_components/CategoryNameForm";

const CategoryDetailsPage = async ({
  params,
}: {
  params: { categoryId: string };
}) => {
  const { categoryId } = await params;
  const { userId } = await auth();

  if (!userId) return redirect("/categories");

  const category = await db.category.findUnique({
    where: {
      id: categoryId,
    },
  });

  if (!category) return redirect("/categories");

  return (
    <>
      <div>
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-semibold">Category setup</h1>
          </div>

          <CategoryActions categoryId={categoryId} />
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-16">
          <div>
            <div className="flex items-center gap-x-2 font-medium">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-lg font-semibold">Customize your category</h2>
            </div>

            <CategoryNameForm initialData={category} categoryId={categoryId} />
          </div>
        </div>

        <div className="w-full mt-6 flex justify-end">
          {/* bg-sky-700 duration-300 hover:bg-sky-900 */}
          <Button className="py-4 px-6 ">
            <Link href="/categories">Finish</Link>
          </Button>
        </div>
      </div>
    </>
  );
};

export default CategoryDetailsPage;
