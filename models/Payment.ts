export default interface Payment {
  paymentId: string;
  bookingId: string;
  amount: number;
  method: "CREDIT_CARD" | "DEBIT_CARD" | "PAYPAL" | "CASH";
  status: "PENDING" | "SUCCESS" | "FAILED";
  createdAt: Date;
}
