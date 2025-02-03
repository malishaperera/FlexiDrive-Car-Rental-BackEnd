export default interface Car {
  carNumberPlate: string;
  brand: string;
  model: string;
  year: number;
  pricePerDay: number;
  status: "AVAILABLE" | "RENTED" | "MAINTENANCE";
  seatingCapacity: number;
  transmission: "AUTOMATIC" | "MANUAL";
  fuelType: "PETROL" | "DIESEL" | "HYBRID" | "ELECTRIC";
  features?: object; // JSON field
  image1?: string;
  image2?: string;
  image3?: string;
  createdAt: Date;
  minRentalPeriod: number;
  maxRentalPeriod: number;
}
