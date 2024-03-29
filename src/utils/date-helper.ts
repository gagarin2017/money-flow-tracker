import moment from "moment";

export const DATE_FORMAT_DD_MM_YYYY = "DD-MM-YYYY";
export const DATE_FORMAT_YYYY_MM_DD = "YYYY-MM-DD";
export const DATE_FORMAT_DD_SLASH_MM_SLASH_YY = "DD/MM/YY";

export const getAmountString = (amount: number) => {
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
};

export const getStringFromDate = (date: Date) => {
  return moment(date).format(DATE_FORMAT_YYYY_MM_DD);
};

export const getStringFromDateWFormatter = (date: Date, formatter: string) => {
  return moment(date).format(formatter);
};

export const getDateFromString = (dateString: string) => {
  return moment(dateString, DATE_FORMAT_YYYY_MM_DD).toDate();
};

export const getDateFromStringWFormatter = (
  dateString: string,
  formatter: string
) => {
  return moment(dateString, formatter).toDate();
};
