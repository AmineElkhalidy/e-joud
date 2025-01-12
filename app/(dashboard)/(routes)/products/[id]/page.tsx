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

const ProductDetailsPage = async ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const { userId } = await auth();

  if (!userId) redirect("/products");

  const product = await db.product.findUnique({
    where: {
      id,
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

  if (!product) redirect("/products");

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
    <div className="">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium">Product setup</h1>
          <span className="text-sm text-slate-700">
            Complete all fields {`${completionText}`}
          </span>
        </div>

        <ProductActions disabled={!isComplete} productId={id} />
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-16">
        <div>
          <div className="flex items-center gap-x-2 font-medium">
            <IconBadge icon={LayoutDashboard} />
            <h2 className="text-lg font-medium">Customize your product</h2>
          </div>

          <ProductNameForm initialData={product} productId={id} />
          <CategoryForm
            initialData={product}
            productId={id}
            options={options}
          />
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={CircleDollarSign} />
              <h2 className="text-lg font-medium">Sell your product</h2>
            </div>

            <ProductPriceForm initialData={product} productId={id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
