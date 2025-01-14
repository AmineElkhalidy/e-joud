"use client";

import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import qs from "query-string";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

const SearchInput = () => {
  const [value, setValue] = useState("");
  const debouncedValue = useDebounce(value);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentCatId = searchParams.get("categoryId");

  useEffect(() => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          categoryId: currentCatId,
          name: debouncedValue,
        },
      },
      { skipNull: true, skipEmptyString: true }
    );

    router.push(url);
  }, [currentCatId, debouncedValue, pathname, router]);

  return (
    <div className="relative">
      <Search className="w-4 h-4 absolute top-2.5 left-3 text-slate-600" />

      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full pl-9 rounded-full bg-slate-100 focus-visible:ring-slate-200"
        placeholder="Search for a product"
      />
    </div>
  );
};

export default SearchInput;
