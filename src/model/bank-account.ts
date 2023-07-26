export default interface BankAccount {
  id: number;
  bankName: string;
  accountName: string;
  balance: number;
  active: boolean;
  isSelected: boolean;
  bankLogo: string;
}
