import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/format";

interface Props {
  value: number;
  label: string;
  shouldFormat?: boolean;
}

const DataCard = ({ value, label, shouldFormat }: Props) => {
  return (
    <Card>
      <CardHeader className="space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="font-bold text-2xl">
          {shouldFormat ? formatPrice(value) : value}
        </p>
      </CardContent>
    </Card>
  );
};

export default DataCard;
