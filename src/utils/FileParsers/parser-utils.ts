export const DATE_COLUMN_INDEX = 1;
// export const DESC_COLUMN_INDEX = 2;

const DEBIT_STR = "Debit";
const CREDIT_STR = "Credit";
const BALANCE_STR = "Balance";
const DESCRIPTION_STR = "Description";
const PAID_OUT_STR = "Paid out";
const PAID_IN_STR = "Paid in";

const findColumnIndexIncludesText = (headersRow: string[], text: string) => {
  return headersRow.findIndex((title) =>
    title.toLowerCase().includes(text.toLowerCase())
  );
};

export const getDebitAmtIndex = (row: string[]) => {
  return findColumnIndexIncludesText(row, DEBIT_STR);
};

export const getPaidOutAmtIndex = (row: string[]) => {
  return findColumnIndexIncludesText(row, PAID_OUT_STR);
};

export const getPaidInAmtIndex = (row: string[]) => {
  return findColumnIndexIncludesText(row, PAID_IN_STR);
};

export const getCreditAmtIndex = (row: string[]) => {
  return findColumnIndexIncludesText(row, CREDIT_STR);
};

export const getBalanceAmtIndex = (row: string[]) => {
  return findColumnIndexIncludesText(row, BALANCE_STR);
};

export const getDescriptionIndex = (row: string[]) => {
  return findColumnIndexIncludesText(row, DESCRIPTION_STR);
};
