public class Main {
    static class Vehicle {
        String name;

        Vehicle(String name) {
            this.name = name;
        }

        int topSpeed() {
            return 0;
        }
    }

    static class SportsCar extends Vehicle {
        SportsCar(String name) {
            super(name);
        }

        @Override
        int topSpeed() {
            return 240;
        }
    }

    static class Motorcycle extends Vehicle {
        Motorcycle(String name) {
            super(name);
        }

        @Override
        int topSpeed() {
            return 200;
        }
    }

    public static void main(String[] args) {
        String name1 = "Infernus";
        String name2 = "Angel";
        Vehicle[] garage = {new SportsCar(name1), new Motorcycle(name2)};
        for (Vehicle v : garage) {
            System.out.println(v.name + ": " + v.topSpeed() + " km/h");
        }
    }
}
