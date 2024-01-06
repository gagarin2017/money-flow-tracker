export const isSpringBoot = true;

export const BASE_URL = isSpringBoot
  ? "http://localhost:8080/api"
  : "http://localhost:3005";

export const CATEGORIES_NODE = "categories";
export const DESCRIPTIONS_NODE = "descriptions";
export const TAGS_NODE = "tags";
export const PAYEES_NODE = "payees";
export const TRANSACTION_COMPONENTS_NODE = "transaction-components";

export const ISO_DATE_FORMAT = "YYYY-MM-DD";
