import dotenv from 'dotenv';
import { Request, Response } from 'express';
import Car from "../models/Car";
import { carDelete, carRegister, carsGetAll, carUpdate, isCarCredentials} from "../databse/car-client";


dotenv.config();

export const registerCar = async (req: Request, res: Response): Promise<any> => {
    // const{carNumberPlate,brand,carModel, carYear, carColor, carType, carStatus, carPrice} = req.body;
    console.log(req.body);
    try{
        const car:Car = {
            carId: req.body.carId,
            carNumberPlate: req.body.carNumberPlate,
            brand: req.body.brand,
            model: req.body.model,
            year: parseInt(req.body.year),
            pricePerDay: req.body.pricePerDay,
            status: req.body.status,
            seatingCapacity: req.body.seatingCapacity,
            transmission: req.body.transmission,
            fuelType: req.body.fuelType,
            features: req.body.features,
            image1: req.body.image1,
            image2: req.body.image2,
            image3: req.body.image3,
            minRentalPeriod: req.body.minRentalPeriod,
            maxRentalPeriod: req.body.maxRentalPeriod
        }
        const newCar = await carRegister(car);
        res.status(201).json(newCar);
    }catch (error) {
        return res.status(500).json({message: "Internal Server Error"});
    }
}

export const getAllCars = async (req: Request, res: Response): Promise<any> => {
    try {
        const cars = await carsGetAll(false);
        return res.json(cars);

    }catch (err){
        return res.status(500).json({message: "Internal Server Error"});
    }
}

export const getCarById = async (req: Request, res: Response): Promise<any> => {
    const {carId} = req.params;
    try {

        console.log(carId)
        const car = await isCarCredentials(carId);

        console.log(car);

        if (car == null) {
            return res.status(404).json({ message: 'Car not founds' });
        }
        return res.status(200).json(car);
    }catch (err){
        return res.status(500).json({message: "Internal Server Error"});
    }
}

export const updateCar = async (req: Request, res: Response): Promise<any> => {

    const  carId = req.params.carId;
    const car:Car = req.body;

    console.log(req.body);

    try {
        const isCar = await isCarCredentials(carId);

        if (isCar == null){
            return res.status(404).json({ message: 'Car not found' });
        }

        const updateCar = await carUpdate(carId,car);
        return res.status(200).json({
            message: 'Car updated successfully',
            car: updateCar
        });

    }catch (err){
        console.error("Error in updateCustomer:", err);
        return res.status(500).json({
            message: 'Internal Server Error',
            error: err,
        });
    }
}

export const deleteCar = async (req: Request, res: Response): Promise<any> => {

    const carId = req.params.carId;
    try {
        const car = await isCarCredentials(carId);

        if (car == null) {
            return res.status(404).json({ message: 'Car not found' });
        }

        const deleteCar = await carDelete(carId);
        return res.status(200).json({
            message: 'Car deleted successfully',
        });

    }catch (err){
        return res.status(500).json({message: "Internal Server Error"});
    }
}


// export const getAvailableCar = async (req: Request, res: Response): Promise<any> => {
//     try {
//         const cars = await carsGetAll(true);
//
//         if (cars.length === 0) {
//             return res.status(404).json({ message: "No available cars found" });
//         }
//         return res.json(cars);
//     } catch (error) {
//         console.error("Error fetching available cars:", error);
//         return res.status(500).json({ message: "Internal Server Error" });
//     }
// };

export const getAvailableCar = async (req: Request, res: Response): Promise<any> => {
    try {
        const cars = await carsGetAll(true);

        // if (!cars || cars.length === 0) {
        //     return res.status(404).json({ message: "No available cars found" });
        // }
        return res.status(200).json(cars);
    } catch (error) {
        console.error("Error fetching available cars:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
