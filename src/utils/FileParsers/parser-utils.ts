export const DATE_COLUMN_INDEX = 1;
export const DESC_COLUMN_INDEX = 2;

const DEBIT_STR = "Debit";
const CREDIT_STR = "Credit";
const BALANCE_STR = "Balance";

export const getDebitAmtIndex = (headersRow: string[]) => {
  return headersRow.findIndex((title) =>
    title.toLowerCase().includes(DEBIT_STR.toLowerCase())
  );
};

export const getCreditAmtIndex = (headersRow: string[]) => {
  return headersRow.findIndex((title) =>
    title.toLowerCase().includes(CREDIT_STR.toLowerCase())
  );
};

export const getBalanceAmtIndex = (headersRow: string[]) => {
  return headersRow.findIndex((title) =>
    title.toLowerCase().includes(BALANCE_STR.toLowerCase())
  );
};
