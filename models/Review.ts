export default interface Review {
  id: number;
  customerId: string;
  carNumberPlate: string;
  rating: number;
  comment?: string;
  createdAt: Date;
}
