class Shop {
    private final String title;
    private int total;

    Shop(String title) {
        this.title = title;
    }

    void earn(int amount) {
        total = total + amount;
    }

    int total() {
        return total;
    }

    String title() {
        return title;
    }
}

public class Main {
    public static void main(String[] args) {
        String name1 = "Malibu Club";
        int sale1 = 200;
        int sale2 = 300;
        String name2 = "Print Works";
        int sale3 = 500;
        int sale4 = 250;

        Shop first = new Shop(name1);
        Shop second = new Shop(name2);
        first.earn(sale1);
        second.earn(sale3);
        first.earn(sale2);
        second.earn(sale4);
        for (Shop s : new Shop[] {first, second}) {
            System.out.printf("%s: %d%n", s.title(), s.total());
        }
    }
}
