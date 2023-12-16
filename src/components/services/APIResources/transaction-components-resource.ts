import { Category } from "../../../model/category";
import { Description } from "../../../model/description";
import { Tag } from "../../../model/tag";
import { TransactionComponents } from "../../../model/transaction-components";
import { deserializeCategories } from "./remote-transaction-category";
import { deserializeTags } from "./remote-transaction-tag";
import { deserializeDescriptions } from "./remote-transacton-description";

interface TransactionComponentsRemote {
  categories: {
    _embedded: {
      categories: Category[];
    };
  };
  descriptions: {
    _embedded: {
      descriptions: Description[];
    };
  };
  tags: {
    _embedded: {
      tags: Tag[];
    };
  };
}

export const deserializeTransactionComponents = (
  transactionComponents: TransactionComponentsRemote
): TransactionComponents => {
  return {
    categories: deserializeCategories(
      transactionComponents.categories._embedded.categories
    ),
    descriptions: deserializeDescriptions(
      transactionComponents.descriptions._embedded.descriptions
    ),
    tags: deserializeTags(transactionComponents.tags._embedded.tags),
  } as TransactionComponents;
};
