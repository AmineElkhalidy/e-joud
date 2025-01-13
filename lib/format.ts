// export const formatPrice = (price: number) => {
//   return new Intl.NumberFormat("en-US", {
//     style: "currency",
//     currency: "MAD",
//   }).format(price);
// };

export const formatPrice = (price: number) => {
  return `${new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price)} MAD`;
};
