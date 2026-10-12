public class Main {
    static class Business {
        int earnings() { return 0; }
    }

    static class Club extends Business {
        int customers;
        Club(int c) { customers = c; }
        @Override int earnings() { return 50 * customers; }
    }

    static class CarWash extends Business {
        int cars, price;
        CarWash(int c, int p) { cars = c; price = p; }
        @Override int earnings() { return price * cars; }
    }

    public static void main(String[] args) {
        int price = 8;
        int cars = 30;
        int customers = 120;
        Club club = new Club(customers);
        CarWash wash = new CarWash(cars, price);
        System.out.printf("Club earnings: %d%nCar wash earnings: %d%n", club.earnings(), wash.earnings());
    }
}
