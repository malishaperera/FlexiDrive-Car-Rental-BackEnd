import Car from "../models/Car";
import { PrismaClient } from "@prisma/client";
import {generateCarId} from "../controllers/util/generateID.controller";

const prisma = new PrismaClient();

export async function carRegister(car: Car){

    try{

        const newCarId = await generateCarId();

        const addedCar = await prisma.car.create({
            data: {
                carId: newCarId,
                carNumberPlate: car.carNumberPlate,
                brand: car.brand,
                model: car.model,
                year: car.year,
                pricePerDay: car.pricePerDay,
                status: car.status,
                seatingCapacity: car.seatingCapacity,
                transmission:car.transmission,
                fuelType: car.fuelType,
                features: car.features,
                image1: car.image1,
                image2: car.image2,
                image3: car.image3,
                minRentalPeriod: car.minRentalPeriod,
                maxRentalPeriod: car.maxRentalPeriod
            }
        });
        console.log("Car created:", addedCar);
        return addedCar;
    }catch (err){
        console.error("Error in carRegister:", err);
        throw new Error('Error creating customer');
    }
}

// export async function carsGetAll(onlyAvailable = false){
//     try {
//         const cars = await prisma.car.findMany({
//             where: onlyAvailable ? { status: 'AVAILABLE' } : {}
//         });
//         return cars;
//     } catch (err) {
//         console.error("Error in getAllCars:", err);
//
//     }
// }
export async function carsGetAll(onlyAvailable = false) {
    try {
        const cars = await prisma.car.findMany({
            where: onlyAvailable ? { status: 'AVAILABLE' } : {},
        });
        return cars;
    } catch (err) {
        console.error("Error in getAllCars:", err);
        throw new Error('Error getting cars');
    }
}


export async function carDelete(carId: string){
    try {
        const deleteCar = await prisma.car.delete({
            where:{carId:carId}
        })
        return deleteCar;

    }catch (err){
        console.error('Error in deleteCar:', err);
        throw new Error('Error deleting car');
    }
}


export async function carUpdate(carId:string,car:Car){

    try{

        const updatedCar=await prisma.car.update({
            where:{carId:carId},
            data: {
                carNumberPlate: car.carNumberPlate,
                brand: car.brand,
                model: car.model,
                year: car.year,
                pricePerDay: car.pricePerDay,
                status: car.status,
                seatingCapacity: car.seatingCapacity,
                transmission:car.transmission,
                fuelType: car.fuelType,
                features: car.features,
                image1: car.image1,
                image2: car.image2,
                image3: car.image3,
                minRentalPeriod: car.minRentalPeriod,
                maxRentalPeriod: car.maxRentalPeriod
            }
        });
        return updatedCar;
    }catch (err){
        console.error('Error in updateCar:', err);
        throw new Error('Error updating car');
    }
}

export async function isCarCredentials(carId: string){
    try{
        if (!carId) {
            throw new Error("carId is required");
        }

        let car = await prisma.car.findUnique({
            where: {carId}
        });
        return car;
    }catch (err){
        console.error("Error in isCarCredentials:", err);
        throw new Error('Error verifying car credentials');
    }
}

// export async function carCredentials(carId: string){
//     try{
//         if (!carId) {
//             throw new Error("carNumberPlate is required");
//         }
//
//         let car = await prisma.car.findUnique({
//             where: { carId: carId }
//         });
//         return car;
//     }catch (err){
//         console.error("Error in isCarCredentials:", err);
//         throw new Error('Error verifying car credentials');
//     }
// }