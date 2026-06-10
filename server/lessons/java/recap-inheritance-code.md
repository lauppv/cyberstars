abstract class Vehicle {
}

class Car extends Vehicle {
    Car(String name) { super(name); }
}

class Truck extends Vehicle {
    Truck(String name) { super(name); }
}

class Motorcycle extends Vehicle {
    Motorcycle(String name) { super(name); }
}

public class Main {
    public static void main(String[] args) {
        Vehicle[] fleet = {
            new Car("BMW"),
            new Truck("Volvo"),
            new Motorcycle("Harley")
        };

        for (Vehicle v : fleet) {
            v.drive(15);
        }

        fleet[1].drive(20);

        for (Vehicle v : fleet) {
            System.out.println(v);
        }
    }
}
