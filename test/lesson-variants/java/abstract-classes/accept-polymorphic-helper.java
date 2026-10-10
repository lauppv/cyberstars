public class Main {
    static abstract class Vehicle {
        String name;

        Vehicle(String name) {
            this.name = name;
        }

        abstract int topSpeed();
    }

    static class SportsCar extends Vehicle {
        SportsCar(String name) {
            super(name);
        }

        @Override
        int topSpeed() {
            return 200 + 40;
        }
    }

    static class Motorcycle extends Vehicle {
        Motorcycle(String name) {
            super(name);
        }

        @Override
        int topSpeed() {
            return 2 * 100;
        }
    }

    static void report(Vehicle v) {
        StringBuilder sb = new StringBuilder();
        sb.append(v.name).append(": ").append(v.topSpeed()).append(" km/h");
        System.out.println(sb);
    }

    public static void main(String[] args) {
        String name1 = "Infernus";
        String name2 = "Angel";
        report(new SportsCar(name1));
        report(new Motorcycle(name2));
    }
}
