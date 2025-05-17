import Payee from "./payee";

export default interface Rule {
  id: number;
  name: string;
  payee: Payee | undefined;
  matchingString: string;
}
