```java
import java.util.*;

public class Main {
    enum Size {
        SMALL(0.8), MEDIUM(1.0), LARGE(1.3);
        final double factor;
        Size(double factor) { this.factor = factor; }
        String label() { return name().charAt(0) + name().substring(1).toLowerCase(); }
    }

    static final List<String> EXTRAS = List.of("cheese", "olives", "chili", "ham");

    static class Item {
        String pizza; Size size; List<String> extras; double price;
        Item(String pizza, Size size, List<String> extras, double base) {
            this.pizza = pizza; this.size = size; this.extras = extras;
            this.price = base * size.factor + 3.0 * extras.size();
        }
        public String toString() {
            StringBuilder s = new StringBuilder(size.label() + " " + pizza);
            for (String e : extras) s.append(" +").append(e);
            return s.toString();
        }
    }

    static class Order {
        int id; String customer; List<Item> items = new ArrayList<>(); boolean sent; double delivery;
        Order(int id, String customer) { this.id = id; this.customer = customer; }
        double subtotal() { double t = 0; for (Item i : items) t += i.price; return t; }
        double deal() {
            if (items.size() < 3) return 0;
            double min = Double.MAX_VALUE;
            for (Item i : items) min = Math.min(min, i.price);
            return min;
        }
        double total() { return subtotal() - deal() + delivery; }
    }

    static String money(double v) { return String.format("%.2f", v); }

    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int n = Integer.parseInt(in.nextLine().trim());
        Map<String, Double> menu = new LinkedHashMap<>();
        for (int i = 0; i < n; i++) {
            String[] p = in.nextLine().trim().split(" ");
            menu.put(p[0], Double.parseDouble(p[1]));
        }
        System.out.println("Menu: " + n + " pizzas");
        Map<Integer, Order> orders = new LinkedHashMap<>();
        Map<String, Integer> sold = new HashMap<>();
        while (in.hasNextLine()) {
            String line = in.nextLine().trim();
            if (line.isEmpty()) continue;
            String[] w = line.split("\\s+");
            try {
                switch (w[0]) {
                    case "close" -> { System.out.println("Closed for today"); return; }
                    case "menu" -> {
                        for (var e : menu.entrySet()) {
                            System.out.print(e.getKey());
                            for (Size s : Size.values()) System.out.print(" " + s.label() + " " + money(e.getValue() * s.factor));
                            System.out.println();
                        }
                    }
                    case "new" -> {
                        if (w.length != 2) throw new IllegalArgumentException("Usage: new <customer>");
                        Order o = new Order(orders.size() + 1, w[1]);
                        orders.put(o.id, o);
                        System.out.println("Order " + o.id + " for " + o.customer);
                    }
                    case "add" -> {
                        if (w.length < 4) throw new IllegalArgumentException("Usage: add <order> <pizza> <size> [extras]");
                        Order o = find(orders, w[1]);
                        if (o.sent) { System.out.println("Order " + o.id + " is already on its way"); break; }
                        if (!menu.containsKey(w[2])) { System.out.println("No " + w[2] + " on the menu"); break; }
                        Size size;
                        try { size = Size.valueOf(w[3].toUpperCase()); }
                        catch (IllegalArgumentException e) { System.out.println("Sizes are small, medium and large"); break; }
                        List<String> extras = new ArrayList<>();
                        boolean ok = true;
                        for (int i = 4; i < w.length; i++) {
                            if (!EXTRAS.contains(w[i])) { System.out.println("No extra called " + w[i]); ok = false; break; }
                            extras.add(w[i]);
                        }
                        if (!ok) break;
                        Item it = new Item(w[2], size, extras, menu.get(w[2]));
                        o.items.add(it);
                        System.out.println("Added " + it + " to order " + o.id + ", " + money(it.price));
                    }
                    case "show" -> {
                        if (w.length != 2) throw new IllegalArgumentException("Usage: show <order>");
                        Order o = find(orders, w[1]);
                        System.out.println("Order " + o.id + " for " + o.customer);
                        for (Item i : o.items) System.out.println("  " + i + " " + money(i.price));
                        if (o.deal() > 0) System.out.println("  Deal: cheapest pizza free -" + money(o.deal()));
                        if (o.sent) System.out.println("  Delivery " + money(o.delivery));
                        System.out.println("Total: " + money(o.total()));
                    }
                    case "send" -> {
                        if (w.length != 3) throw new IllegalArgumentException("Usage: send <order> <km>");
                        Order o = find(orders, w[1]);
                        double km = Double.parseDouble(w[2]);
                        if (km < 0) throw new IllegalArgumentException("Usage: send <order> <km>");
                        if (o.items.isEmpty()) { System.out.println("Order " + o.id + " is empty"); break; }
                        if (o.sent) { System.out.println("Order " + o.id + " is already on its way"); break; }
                        double fee = o.subtotal() - o.deal() >= 100 ? 0 : 5 + Math.max(0, Math.ceil(km - 3));
                        o.delivery = fee;
                        o.sent = true;
                        for (Item i : o.items) sold.merge(i.pizza, 1, Integer::sum);
                        System.out.println("Order " + o.id + " sent to " + o.customer + ", delivery " + money(fee) + ", total " + money(o.total()));
                    }
                    case "report" -> {
                        int count = 0; double revenue = 0;
                        for (Order o : orders.values()) if (o.sent) { count++; revenue += o.total(); }
                        System.out.println("Orders sent: " + count);
                        System.out.println("Revenue: " + money(revenue));
                        List<String> names = new ArrayList<>(sold.keySet());
                        names.sort((a, b) -> sold.get(b) - sold.get(a) != 0 ? sold.get(b) - sold.get(a) : a.compareTo(b));
                        for (String p : names) System.out.println(p + ": " + sold.get(p));
                    }
                    default -> System.out.println("Unknown command: " + w[0]);
                }
            } catch (NumberFormatException e) {
                System.out.println("Not a number: " + e.getMessage().replace("For input string: ", "").replace("\"", ""));
            } catch (IllegalArgumentException e) {
                System.out.println(e.getMessage());
            }
        }
    }

    static Order find(Map<Integer, Order> orders, String id) {
        int n = Integer.parseInt(id);
        Order o = orders.get(n);
        if (o == null) throw new IllegalArgumentException("No order " + n);
        return o;
    }
}
```
