// Format the number as a currency
export const getAmountAsFormatedString = (amount: number | null) => {
  if (amount) {
    return new Intl.NumberFormat("en-IE", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  }

  return "";
};
