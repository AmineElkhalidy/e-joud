"use client";

import React from "react";
import { SelectScrollable } from "./SelectScrollable";
import PriceInput from "@/components/PriceInput";
import QuantityInput from "@/components/QuantityInput";
import { Button } from "@/components/ui/button";

const ClientSelectedProduct = () => {
  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <p className="font-medium">Select the product</p>

      <div className="flex flex-wrap md:flex-nowrap items-center gap-5 mt-4">
        <SelectScrollable />
        <PriceInput />
        <QuantityInput />
      </div>
      <div className="mt-4 flex justify-end">
        <Button>Save</Button>
      </div>
    </div>
  );
};

export default ClientSelectedProduct;
