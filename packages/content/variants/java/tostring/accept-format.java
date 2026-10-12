class Car {
    private final String brand;
    private final int built;

    public Car(String brand, int built) {
        this.brand = brand;
        this.built = built;
    }

    @Override
    public String toString() {
        return String.format("%s (%d)", brand, built);
    }
}

public class Main {
    public static void main(String[] args) {
        String make1 = "Infernus";
        int year1 = 1986;
        String make2 = "Cheetah";
        int year2 = 1984;

        System.out.println(new Car(make1, year1));
        System.out.println(new Car(make2, year2));
    }
}
