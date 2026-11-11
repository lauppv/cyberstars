```java
import java.util.*;

public class Main {
    static class KioskException extends Exception {
        KioskException(String message) { super(message); }
    }
    static class UnknownProductException extends KioskException {
        UnknownProductException(String code) { super("Unknown product " + code); }
    }
    static class WeighFirstException extends KioskException {
        WeighFirstException(String name) { super("Put the " + name + " on the scale first"); }
    }
    static class StaffNeededException extends KioskException {
        StaffNeededException() { super("Please wait for a staff member to check your age"); }
    }
    static class PaymentException extends KioskException {
        PaymentException(String message) { super(message); }
    }

    record Product(String code, String name, int price, String kind) {}
    record Line(Product product, int qty, int grams, int cost) {}

    static Map<String, Product> products = new LinkedHashMap<>();
    static List<Line> basket = new ArrayList<>();
    static List<Product> waiting = new ArrayList<>();
    static int sales = 0, takings = 0, attempts = 0;

    static String money(int cents) { return String.format("%d.%02d", cents / 100, cents % 100); }

    static Product find(String code) throws UnknownProductException {
        Product p = products.get(code);
        if (p == null) throw new UnknownProductException(code);
        return p;
    }

    static int total() { return basket.stream().mapToInt(Line::cost).sum(); }

    static void scan(String code, int qty) throws KioskException {
        Product p = find(code);
        if (p.kind().equals("kg")) throw new WeighFirstException(p.name());
        if (p.kind().equals("alcohol")) {
            for (int i = 0; i < qty; i++) waiting.add(p);
            throw new StaffNeededException();
        }
        basket.add(new Line(p, qty, 0, p.price() * qty));
        System.out.println(p.name() + " x" + qty + " " + money(p.price() * qty));
    }

    static void pay(String how, String amount) throws KioskException {
        if (basket.isEmpty() && waiting.isEmpty()) throw new PaymentException("Nothing to pay for");
        if (!waiting.isEmpty()) throw new StaffNeededException();
        int due = total();
        if (how.equals("cash")) {
            int given = (int) Math.round(Double.parseDouble(amount) * 100);
            if (given < due) throw new PaymentException("That's " + money(due - given) + " short");
            System.out.println("Paid " + money(given) + " in cash, change " + money(given - due));
        } else if (how.equals("card")) {
            if (!amount.matches("\\d{4}")) throw new PaymentException("A PIN has 4 digits");
            if (due > 50000) throw new PaymentException("Card declined: over 500.00");
            System.out.println("Paid " + money(due) + " by card");
        } else {
            throw new PaymentException("Pay by cash or card");
        }
        System.out.println("Receipt:");
        for (Line l : basket) {
            String what = l.grams() > 0 ? l.product().name() + " " + l.grams() + " g" : l.product().name() + " x" + l.qty();
            System.out.println("  " + what + " " + money(l.cost()));
        }
        System.out.println("  Total " + money(due));
        sales++;
        takings += due;
        basket.clear();
    }

    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int n = Integer.parseInt(in.nextLine().trim());
        for (int i = 0; i < n; i++) {
            String[] p = in.nextLine().trim().split("\\s+");
            products.put(p[0], new Product(p[0], p[1], (int) Math.round(Double.parseDouble(p[2]) * 100), p[3]));
        }
        System.out.println("Kiosk ready, " + n + " products");
        while (in.hasNextLine()) {
            String line = in.nextLine().trim();
            if (line.isEmpty()) continue;
            String[] w = line.split("\\s+");
            try {
                switch (w[0]) {
                    case "quit" -> {
                        System.out.println("Sales: " + sales + ", takings " + money(takings) + ", payment attempts " + attempts);
                        return;
                    }
                    case "scan" -> {
                        if (w.length < 2 || w.length > 3) throw new IllegalArgumentException("Usage: scan <code> [quantity]");
                        int qty = w.length == 3 ? Integer.parseInt(w[2]) : 1;
                        if (qty < 1) throw new IllegalArgumentException("Usage: scan <code> [quantity]");
                        scan(w[1], qty);
                    }
                    case "weigh" -> {
                        if (w.length != 3) throw new IllegalArgumentException("Usage: weigh <code> <grams>");
                        Product p = find(w[1]);
                        int grams = Integer.parseInt(w[2]);
                        if (!p.kind().equals("kg")) throw new KioskException(p.name() + " isn't sold by weight");
                        if (grams < 1) throw new IllegalArgumentException("Usage: weigh <code> <grams>");
                        int cost = (int) Math.round(p.price() * grams / 1000.0);
                        basket.add(new Line(p, 1, grams, cost));
                        System.out.println(p.name() + " " + grams + " g " + money(cost));
                    }
                    case "staff" -> {
                        if (w.length != 2) throw new IllegalArgumentException("Usage: staff <age>");
                        int age = Integer.parseInt(w[1]);
                        if (waiting.isEmpty()) throw new KioskException("Nothing needs a staff member");
                        for (Product p : waiting) {
                            if (age >= 18) {
                                basket.add(new Line(p, 1, 0, p.price()));
                                System.out.println(p.name() + " x1 " + money(p.price()) + " (age checked)");
                            } else {
                                System.out.println("Sorry, no " + p.name() + " under 18");
                            }
                        }
                        waiting.clear();
                    }
                    case "total" -> System.out.println("To pay: " + money(total()) + (waiting.isEmpty() ? "" : ", " + waiting.size() + " waiting for staff"));
                    case "pay" -> {
                        if (w.length != 3) throw new IllegalArgumentException("Usage: pay <cash|card> <amount or PIN>");
                        try {
                            pay(w[1], w[2]);
                        } finally {
                            attempts++;
                        }
                    }
                    default -> System.out.println("Unknown command: " + w[0]);
                }
            } catch (KioskException e) {
                System.out.println(e.getMessage());
            } catch (NumberFormatException e) {
                System.out.println("Not a number: " + e.getMessage().replace("For input string: ", "").replace("\"", ""));
            } catch (IllegalArgumentException e) {
                System.out.println(e.getMessage());
            }
        }
    }
}
```
