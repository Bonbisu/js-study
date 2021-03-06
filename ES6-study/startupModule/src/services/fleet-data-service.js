import { Car } from "../classes/car.js";
import { Drone } from "../classes/drone.js";
import { DataError } from "./data-error.js";

export class FleetDataService {
    constructor() {
        this.cars = [];
        this.drones = [];
        this.errors = [];
        
    }

    getCarByLicense(license) {
        return this.cars.find(function (car) { // Returns the value of the first element in the array where predicate is true, and undefined otherwise. USE A FUNCTION HERE
            return car.license === license;
        })
    }

    getCarsSortedByLicense() {
        return this.cars.sort(function (car1, car2) { // sort is a confusing function. If the first element in array should appear first(left), the function must return negative, if should appear after(right), must return positive
            if (car1.license < car2.license)
                return -1; // car1 becomes first
            if (car1.license > car2.license)
                return 1; // car2 becomes first
            else
                return 0;
        })
    }

    filterCarsByMake(filter) {
        return this.cars.filter(car => car.make.indexOf(filter) >= 0); // fat arrow syntax of ES6
    }

    loadData(fleet) {
        console.log('Loading Data');
        
        for (let data of fleet) {
            switch (data.type) {
                case 'car':
                    if (this.validateCarData(data) ) { // execute if have no errors
                        let car = this.loadCar(data);
                        if (car) {
                            this.cars.push(car);
                        }
                    } else {
                        let e = new DataError('invalid car data', data);
                        this.errors.push(e);
                    }
                    break;

                case 'drone':
                    if (this.validateDroneData(data) ) {
                        let drone = this.loadDrone(data);
                        if (drone) {
                            this.drones.push(drone);
                        } 
                    } else {
                            let e = new DataError('invalid drone data', data);
                            this.errors.push(e);
                    }
                    break;

                default:
                    let e = new DataError('Invalid vehicle type', data);
                    this.errors.push(e);
                    break;
            }            
        }
        console.log('Load complete');
        
    }
     
    loadCar(car) {
        try{ // if ocurrs some problem inside the block, jump to catch
            let c = new Car(car.license, car.model, car.latLong);
            c.miles = car.miles;
            c.make = car.make;
            return c;
        } catch(e) {
            this.errors.push(new DataError('error loading car', car) );
        }
        return null;
    }

    loadDrone(drone) {
        try {
            let d = new Drone(drone.license, drone.model, drone.latLong);
            d.airTimeHours = drone.airTimeHours;
            d.base = drone.base;
            return d;
        } catch(e) {
            this.errors.push(new DataError('error loading drone', drone) );
        }
        return null;
    }

    validateCarData(car) {
        let requiredProps = 'license model latLong miles make'.split(' ');
        let hasErrors = false;

        for (let field of requiredProps) {
            if ( ! car[field] ) {
                this.errors.push(new DataError(`invalid field ${field}`, car) ); // ES6 backtick syntax allows to use iterated variable
                hasErrors = true;
            }
        }

        if (Number.isNaN(Number.parseFloat(car.miles) ) ) {
            this.errors.push(new DataError('invalid mileage', car) );
            hasErrors = true;
        }
        return !hasErrors; // send true if no errors
    }

    validateDroneData(drone) {
        let requiredProps = 'license model latLong airTimeHours base'.split(' ');
        let hasErrors = false;
        
        for (let field of requiredProps) {
            if ( ! drone[field] ) {
                this.errors.push(new DataError(`invalid field ${field}`, drone) );
                hasErrors = true;
            }
        }

        if (Number.isNaN(Number.parseFloat(drone.airTimeHours) ) ) {
            this.errors.push(new DataError('invalid air time', drone) );
            hasErrors = true;
        }
        return !hasErrors;
    }
}