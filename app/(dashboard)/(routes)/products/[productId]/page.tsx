import React from "react";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { CircleDollarSign, LayoutDashboard } from "lucide-react";
import { IconBadge } from "@/components/IconBadge";
import ProductNameForm from "./_components/ProductNameForm";
import ProductPriceForm from "./_components/ProductPriceForm";
import CategoryForm from "./_components/CategoryForm";
import ProductActions from "./_components/Actions";
import ProductQuantityForm from "./_components/ProductQuantityForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const ProductDetailsPage = async ({
  params,
}: {
  params: { productId: string };
}) => {
  const { productId } = await params;
  const { userId } = await auth();

  if (!userId) return redirect("/products");

  const product = await db.product.findUnique({
    where: {
      id: productId,
    },
  });

  // Get the categories from db
  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const options = categories.map((c) => ({
    label: c.name,
    value: c.id,
  }));

  if (!product) return redirect("/products");

  const requiredFields = [
    product.name,
    product.price,
    product.quantity,
    product.categoryId,
  ];

  const totalFields = requiredFields.length;

  // ! this is genius
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields}/${totalFields})`;
  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      <div>
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-semibold">Product setup</h1>
            <span className="text-sm text-slate-700">
              Complete all fields {`${completionText}`}
            </span>
          </div>

          <ProductActions productId={productId} />
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-16">
          <div>
            <div className="flex items-center gap-x-2 font-medium">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-lg font-semibold">Customize your product</h2>
            </div>

            <ProductNameForm initialData={product} productId={productId} />
            <CategoryForm
              initialData={product}
              productId={productId}
              options={options}
            />
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={CircleDollarSign} />
                <h2 className="text-lg font-semibold">Sell your product</h2>
              </div>

              <ProductPriceForm initialData={product} productId={productId} />
            </div>

            <ProductQuantityForm initialData={product} productId={productId} />
          </div>
        </div>

        <div className="w-full mt-6 flex justify-end">
          {/* bg-sky-700 duration-300 hover:bg-sky-900 */}
          <Button disabled={!isComplete} className="py-4 px-6 ">
            <Link href="/products">Finish</Link>
          </Button>
        </div>
      </div>
    </>
  );
};

export default ProductDetailsPage;
