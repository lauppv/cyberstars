```java
import java.util.*;

public class Main {
    static abstract class Vehicle {
        String plate, model; double rate; int km; int sinceService;
        String renter; int fromDay; int rentals; double earned; boolean needsService;
        Vehicle(String plate, String model, double rate) { this.plate = plate; this.model = model; this.rate = rate; }
        abstract String kind();
        abstract double price(int days, int km);
        String status() {
            if (needsService) return "in service";
            return renter == null ? "available" : "rented by " + renter;
        }
    }
    static class Car extends Vehicle {
        Car(String p, String m, double r) { super(p, m, r); }
        String kind() { return "car"; }
        double price(int days, int km) { return days * rate + Math.max(0, km - 150 * days) * 0.25; }
    }
    static class Van extends Vehicle {
        Van(String p, String m, double r) { super(p, m, r); }
        String kind() { return "van"; }
        double price(int days, int km) { return days * rate + km * 0.40; }
    }
    static class Scooter extends Vehicle {
        Scooter(String p, String m, double r) { super(p, m, r); }
        String kind() { return "scooter"; }
        double price(int days, int km) { return days * rate + Math.max(0, days - 3) * 20; }
    }

    static Map<String, Vehicle> fleet = new LinkedHashMap<>();
    static Map<String, List<String>> history = new HashMap<>();
    static Map<String, Double> spent = new HashMap<>();

    static String count(int n, String word) { return n + " " + word + (n == 1 ? "" : "s"); }

    static String money(double v) { return String.format("%.2f", v); }

    static Vehicle find(String plate) {
        Vehicle v = fleet.get(plate);
        if (v == null) throw new IllegalArgumentException("No vehicle " + plate);
        return v;
    }

    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int n = Integer.parseInt(in.nextLine().trim());
        int cars = 0, vans = 0, scooters = 0;
        for (int i = 0; i < n; i++) {
            String[] p = in.nextLine().trim().split("\\s+");
            double rate = Double.parseDouble(p[3]);
            Vehicle v = switch (p[0]) {
                case "car" -> { cars++; yield new Car(p[1], p[2], rate); }
                case "van" -> { vans++; yield new Van(p[1], p[2], rate); }
                default -> { scooters++; yield new Scooter(p[1], p[2], rate); }
            };
            fleet.put(v.plate, v);
        }
        System.out.println("Fleet: " + count(cars, "car") + ", " + count(vans, "van") + ", " + count(scooters, "scooter"));
        while (in.hasNextLine()) {
            String line = in.nextLine().trim();
            if (line.isEmpty()) continue;
            String[] w = line.split("\\s+");
            try {
                switch (w[0]) {
                    case "close" -> { System.out.println("Office closed"); return; }
                    case "list" -> {
                        for (Vehicle v : fleet.values())
                            System.out.println(v.plate + " " + v.kind() + " " + v.model + " " + money(v.rate) + "/day, " + v.status());
                    }
                    case "rent" -> {
                        if (w.length != 4) throw new IllegalArgumentException("Usage: rent <plate> <customer> <day>");
                        Vehicle v = find(w[1]);
                        int day = Integer.parseInt(w[3]);
                        if (v.needsService) System.out.println(v.plate + " is in service");
                        else if (v.renter != null) System.out.println(v.plate + " is rented by " + v.renter);
                        else {
                            v.renter = w[2];
                            v.fromDay = day;
                            System.out.println(w[2] + " rents " + v.model + " (" + v.plate + ") from day " + day);
                        }
                    }
                    case "return" -> {
                        if (w.length != 4) throw new IllegalArgumentException("Usage: return <plate> <day> <km>");
                        Vehicle v = find(w[1]);
                        int day = Integer.parseInt(w[2]);
                        int km = Integer.parseInt(w[3]);
                        if (v.renter == null) { System.out.println(v.plate + " is not rented"); break; }
                        if (day < v.fromDay || km < 0) { System.out.println("Check the day and the kilometres"); break; }
                        int days = Math.max(1, day - v.fromDay);
                        double price = v.price(days, km);
                        System.out.println(v.renter + " returns " + v.plate + " after " + days + (days == 1 ? " day" : " days") + " and " + km + " km, pays " + money(price));
                        history.computeIfAbsent(v.renter, k -> new ArrayList<>()).add(v.model + " (" + v.plate + "), " + days + (days == 1 ? " day" : " days") + ", " + money(price));
                        spent.merge(v.renter, price, Double::sum);
                        v.renter = null;
                        v.rentals++;
                        v.earned += price;
                        v.km += km;
                        v.sinceService += km;
                        if (v.sinceService >= 1000) {
                            v.needsService = true;
                            System.out.println(v.plate + " has done " + v.sinceService + " km since its service, off to the garage");
                        }
                    }
                    case "serviced" -> {
                        if (w.length != 2) throw new IllegalArgumentException("Usage: serviced <plate>");
                        Vehicle v = find(w[1]);
                        if (!v.needsService) { System.out.println(v.plate + " is not in service"); break; }
                        v.needsService = false;
                        v.sinceService = 0;
                        System.out.println(v.plate + " is back");
                    }
                    case "available" -> {
                        if (w.length != 2) throw new IllegalArgumentException("Usage: available <car|van|scooter>");
                        List<Vehicle> free = new ArrayList<>();
                        for (Vehicle v : fleet.values())
                            if (v.kind().equals(w[1]) && v.renter == null && !v.needsService) free.add(v);
                        free.sort(Comparator.comparingDouble((Vehicle v) -> v.rate).thenComparing(v -> v.plate));
                        if (free.isEmpty()) System.out.println("No " + w[1] + " available");
                        for (Vehicle v : free) System.out.println(v.plate + " " + v.model + " " + money(v.rate) + "/day");
                    }
                    case "customer" -> {
                        if (w.length != 2) throw new IllegalArgumentException("Usage: customer <name>");
                        List<String> h = history.get(w[1]);
                        if (h == null) { System.out.println("No rentals for " + w[1]); break; }
                        for (String s : h) System.out.println(s);
                        System.out.println("Total: " + money(spent.get(w[1])));
                    }
                    case "report" -> {
                        double total = 0;
                        Map<String, Double> byKind = new LinkedHashMap<>();
                        byKind.put("car", 0.0); byKind.put("van", 0.0); byKind.put("scooter", 0.0);
                        Vehicle top = null;
                        for (Vehicle v : fleet.values()) {
                            byKind.merge(v.kind(), v.earned, Double::sum);
                            total += v.earned;
                            if (v.rentals > 0 && (top == null || v.rentals > top.rentals)) top = v;
                        }
                        for (var e : byKind.entrySet()) System.out.println(e.getKey() + "s: " + money(e.getValue()));
                        System.out.println("Total: " + money(total));
                        System.out.println("Most rented: " + (top == null ? "none" : top.plate + " (" + top.rentals + ")"));
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
