class Business {
    int earnings() {
        return 0;
    }
}

class Club extends Business {
    private final int guests;

    Club(int guests) {
        this.guests = guests;
    }

    @Override
    int earnings() {
        return guests * 50;
    }
}

class CarWash extends Business {
    private final int washed;
    private final int fee;

    CarWash(int washed, int fee) {
        this.washed = washed;
        this.fee = fee;
    }

    @Override
    int earnings() {
        int total = 0;
        for (int i = 0; i < washed; i++) {
            total += fee;
        }
        return total;
    }
}

public class Main {
    public static void main(String[] args) {
        int customers = 120;
        int cars = 30;
        int price = 8;
        Business[] places = { new Club(customers), new CarWash(cars, price) };
        String[] labels = { "Club earnings: ", "Car wash earnings: " };
        for (int i = 0; i < places.length; i++) {
            System.out.println(labels[i] + places[i].earnings());
        }
    }
}
