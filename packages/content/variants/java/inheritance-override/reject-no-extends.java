public class Main {
    static class Club {
        int customers;
        Club(int customers) { this.customers = customers; }
        int earnings() { return customers * 50; }
    }

    static class CarWash {
        int cars, price;
        CarWash(int cars, int price) { this.cars = cars; this.price = price; }
        int earnings() { return cars * price; }
    }

    public static void main(String[] args) {
        int customers = 120;
        int cars = 30;
        int price = 8;
        System.out.println("Club earnings: " + new Club(customers).earnings());
        System.out.println("Car wash earnings: " + new CarWash(cars, price).earnings());
    }
}
