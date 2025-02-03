export default interface Booking {
  bookingId: string;
  customerId: string;
  carNumberPlate: string;
  startDate: Date;
  endDate: Date;
  location: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  totalAmount: number;
  createdAt: Date;
  minRentalPeriod: number;
  maxRentalPeriod: number;
}
