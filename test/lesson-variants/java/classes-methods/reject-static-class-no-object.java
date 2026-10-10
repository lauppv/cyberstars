public class Main {
    static class Ledger {
        static int add(int total, int amount) {
            return total + amount;
        }

        static String line(String name, int total) {
            return name + ": " + total;
        }
    }

    public static void main(String[] args) {
        String name1 = "Malibu Club";
        int sale1 = 200;
        int sale2 = 300;
        String name2 = "Print Works";
        int sale3 = 500;
        int sale4 = 250;
        System.out.println(Ledger.line(name1, Ledger.add(Ledger.add(0, sale1), sale2)));
        System.out.println(Ledger.line(name2, Ledger.add(Ledger.add(0, sale3), sale4)));
    }
}
