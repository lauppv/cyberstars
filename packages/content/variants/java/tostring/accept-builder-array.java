class Car {
    String make;
    int year;

    Car(String m, int y) {
        make = m;
        year = y;
    }

    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append(make).append(" (").append(year).append(')');
        return sb.toString();
    }
}

public class Main {
    public static void main(String[] args) {
        String make1 = "Infernus";
        int year1 = 1986;
        String make2 = "Cheetah";
        int year2 = 1984;

        Car[] garage = { new Car(make1, year1), new Car(make2, year2) };
        for (Car c : garage) {
            System.out.println(c);
        }
    }
}
