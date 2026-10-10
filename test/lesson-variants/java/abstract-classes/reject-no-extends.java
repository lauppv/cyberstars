public class Main {
    static abstract class Vehicle {
        abstract int topSpeed();
    }

    static class SportsCar {
        String name;

        SportsCar(String name) {
            this.name = name;
        }

        int topSpeed() {
            return 240;
        }
    }

    static class Motorcycle {
        String name;

        Motorcycle(String name) {
            this.name = name;
        }

        int topSpeed() {
            return 200;
        }
    }

    public static void main(String[] args) {
        String name1 = "Infernus";
        String name2 = "Angel";
        SportsCar car = new SportsCar(name1);
        Motorcycle bike = new Motorcycle(name2);
        System.out.println(car.name + ": " + car.topSpeed() + " km/h");
        System.out.println(bike.name + ": " + bike.topSpeed() + " km/h");
    }
}
