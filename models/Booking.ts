export default interface Booking {
  bookingId: string;
  customerId: string;
  carId: string;
  startDate: Date;
  endDate: Date;
  location: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED"|null;
  totalAmount: number;
}