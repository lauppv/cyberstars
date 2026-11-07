```java
import java.util.*;

public class Main {
    static class Order {
        final int id; final String trader; final boolean buy; int qty; final int price;
        Order(int id, String trader, boolean buy, int qty, int price) {
            this.id = id; this.trader = trader; this.buy = buy; this.qty = qty; this.price = price;
        }
    }

    // Buyers paying more go first, sellers asking less go first; at the same price, the older order
    static PriorityQueue<Order> bids = new PriorityQueue<>(Comparator.comparingInt((Order o) -> -o.price).thenComparingInt(o -> o.id));
    static PriorityQueue<Order> asks = new PriorityQueue<>(Comparator.comparingInt((Order o) -> o.price).thenComparingInt(o -> o.id));
    static Map<String, int[]> traders = new TreeMap<>(); // shares, cash
    static int nextId = 1, volume = 0, lastPrice = 0;
    static long turnover = 0;

    static void trade(Order incoming, Order resting, int qty) {
        int price = resting.price;
        String buyer = incoming.buy ? incoming.trader : resting.trader;
        String seller = incoming.buy ? resting.trader : incoming.trader;
        traders.computeIfAbsent(buyer, k -> new int[2]);
        traders.computeIfAbsent(seller, k -> new int[2]);
        traders.get(buyer)[0] += qty;
        traders.get(buyer)[1] -= qty * price;
        traders.get(seller)[0] -= qty;
        traders.get(seller)[1] += qty * price;
        volume += qty;
        turnover += (long) qty * price;
        lastPrice = price;
        System.out.println("  Trade: " + qty + " at " + price + ", " + buyer + " buys from " + seller);
    }

    // Matches an order against the other side; a limit order stops at its price, a market order at nothing
    static void match(Order o, boolean market) {
        PriorityQueue<Order> other = o.buy ? asks : bids;
        while (o.qty > 0 && !other.isEmpty()) {
            Order best = other.peek();
            if (!market && (o.buy ? best.price > o.price : best.price < o.price)) break;
            if (best.trader.equals(o.trader)) {
                other.poll(); // a trader can't trade with themselves: their old order goes
                System.out.println("  Order " + best.id + " cancelled, " + o.trader + " can't trade with themselves");
                continue;
            }
            int qty = Math.min(o.qty, best.qty);
            trade(o, best, qty);
            o.qty -= qty;
            best.qty -= qty;
            if (best.qty == 0) other.poll();
        }
    }

    static int num(String s) {
        int n = Integer.parseInt(s);
        if (n < 1) throw new IllegalArgumentException("Quantities and prices are whole numbers above 0");
        return n;
    }

    static List<Order> sorted(PriorityQueue<Order> q) {
        List<Order> list = new ArrayList<>(q);
        list.sort(q.comparator());
        return list;
    }

    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        System.out.println("Market open");
        while (in.hasNextLine()) {
            String line = in.nextLine().trim();
            if (line.isEmpty()) continue;
            String[] w = line.split("\\s+");
            try {
                switch (w[0]) {
                    case "close" -> { System.out.println("Market closed"); return; }
                    case "buy", "sell" -> {
                        if (w.length != 4) throw new IllegalArgumentException("Usage: " + w[0] + " <trader> <quantity> <price>");
                        Order o = new Order(nextId++, w[1], w[0].equals("buy"), num(w[2]), num(w[3]));
                        traders.computeIfAbsent(o.trader, k -> new int[2]);
                        System.out.println("Order " + o.id + ": " + o.trader + " " + w[0] + "s " + o.qty + " at " + o.price);
                        match(o, false);
                        if (o.qty > 0) {
                            (o.buy ? bids : asks).add(o);
                            if (o.qty != num(w[2])) System.out.println("  " + o.qty + " left in the book");
                        }
                    }
                    case "market" -> {
                        if (w.length != 4 || !(w[2].equals("buy") || w[2].equals("sell")))
                            throw new IllegalArgumentException("Usage: market <trader> <buy|sell> <quantity>");
                        Order o = new Order(nextId++, w[1], w[2].equals("buy"), num(w[3]), 0);
                        traders.computeIfAbsent(o.trader, k -> new int[2]);
                        System.out.println("Order " + o.id + ": " + o.trader + " " + w[2] + "s " + o.qty + " at any price");
                        match(o, true);
                        if (o.qty > 0) System.out.println("  " + o.qty + " not filled, nobody left to trade with");
                    }
                    case "cancel" -> {
                        if (w.length != 2) throw new IllegalArgumentException("Usage: cancel <order>");
                        int id = Integer.parseInt(w[1]);
                        if (bids.removeIf(o -> o.id == id) || asks.removeIf(o -> o.id == id)) System.out.println("Order " + id + " cancelled");
                        else System.out.println("No order " + id + " in the book");
                    }
                    case "book" -> {
                        System.out.println("Sell:");
                        for (Order o : sorted(asks)) System.out.println("  " + o.price + " x " + o.qty + "  (" + o.trader + ", order " + o.id + ")");
                        System.out.println("Buy:");
                        for (Order o : sorted(bids)) System.out.println("  " + o.price + " x " + o.qty + "  (" + o.trader + ", order " + o.id + ")");
                    }
                    case "traders" -> {
                        for (var e : traders.entrySet())
                            System.out.println(e.getKey() + ": " + e.getValue()[0] + (Math.abs(e.getValue()[0]) == 1 ? " share" : " shares") + ", cash " + e.getValue()[1]);
                    }
                    case "stats" -> {
                        if (volume == 0) { System.out.println("No trades yet"); break; }
                        System.out.println("Last price: " + lastPrice);
                        System.out.println("Shares traded: " + volume);
                        System.out.println(String.format("Average price: %.2f", (double) turnover / volume));
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
}
```
