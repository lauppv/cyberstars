```java
import java.util.*;

public class Main {
    enum Status {
        REGISTERED("registered"), IN_TRANSIT("in transit"), AT_DEPOT("at the depot"),
        OUT_FOR_DELIVERY("out for delivery"), DELIVERED("delivered"), RETURNED("returned to sender");
        final String text;
        Status(String text) { this.text = text; }
    }

    static class Parcel {
        String id, from, to; double kg; double price; int day; Status status = Status.REGISTERED;
        String place; int failed; int deliveredDay;
        List<String> history = new ArrayList<>();
        Parcel(String id, String from, String to, double kg, int day) {
            this.id = id; this.from = from; this.to = to; this.kg = kg; this.day = day; this.place = from;
            price = kg <= 1 ? 12 : kg <= 5 ? 18 : kg <= 10 ? 25 : 25 + Math.ceil(kg - 10) * 2;
        }
        void log(int day, String text) { history.add("Day " + day + ": " + text); }
    }

    static Map<String, Parcel> parcels = new LinkedHashMap<>();
    static final Map<String, String> ACTION = Map.of("leave", "leave", "arrive", "arrive",
            "out", "go out for delivery", "deliver", "be delivered", "fail", "miss a delivery");

    static Parcel parcel(String id) {
        Parcel p = parcels.get(id);
        if (p == null) throw new IllegalArgumentException("No parcel " + id);
        return p;
    }

    static String money(double v) { return String.format("%.2f", v); }

    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        System.out.println("Tracking ready");
        while (in.hasNextLine()) {
            String line = in.nextLine().trim();
            if (line.isEmpty()) continue;
            String[] w = line.split("\\s+");
            try {
                switch (w[0]) {
                    case "quit" -> { System.out.println("Bye"); return; }
                    case "send" -> {
                        if (w.length != 6) throw new IllegalArgumentException("Usage: send <id> <from> <to> <kg> <day>");
                        if (parcels.containsKey(w[1])) { System.out.println(w[1] + " already exists"); break; }
                        double kg = Double.parseDouble(w[4]);
                        int day = Integer.parseInt(w[5]);
                        if (kg <= 0 || kg > 30) { System.out.println("Parcels weigh more than 0 and at most 30 kg"); break; }
                        if (w[2].equals(w[3])) { System.out.println("A parcel goes to another town"); break; }
                        Parcel p = new Parcel(w[1], w[2], w[3], kg, day);
                        parcels.put(p.id, p);
                        p.log(day, "registered in " + p.from);
                        System.out.println(p.id + ": " + p.from + " to " + p.to + ", " + w[4] + " kg, " + money(p.price));
                    }
                    case "scan" -> {
                        if (w.length < 4) throw new IllegalArgumentException("Usage: scan <id> <event> <day> [place]");
                        Parcel p = parcel(w[1]);
                        String event = w[2];
                        int day = Integer.parseInt(w[3]);
                        String place = w.length > 4 ? w[4] : null;
                        Status next = switch (event) {
                            case "leave" -> p.status == Status.REGISTERED || p.status == Status.AT_DEPOT ? Status.IN_TRANSIT : null;
                            case "arrive" -> p.status == Status.IN_TRANSIT ? Status.AT_DEPOT : null;
                            case "out" -> p.status == Status.AT_DEPOT && p.place.equals(p.to) ? Status.OUT_FOR_DELIVERY : null;
                            case "deliver", "fail" -> p.status == Status.OUT_FOR_DELIVERY ? Status.DELIVERED : null;
                            default -> throw new IllegalArgumentException("Events are leave, arrive, out, deliver and fail");
                        };
                        if (event.equals("arrive") && place == null) throw new IllegalArgumentException("Usage: scan <id> arrive <day> <place>");
                        if (next == null) { System.out.println(p.id + " is " + p.status.text + (p.status == Status.AT_DEPOT ? " in " + p.place : "") + ", it can't " + ACTION.get(event)); break; }
                        switch (event) {
                            case "leave" -> { p.status = next; p.log(day, "left " + p.place); System.out.println(p.id + " left " + p.place); }
                            case "arrive" -> { p.status = next; p.place = place; p.log(day, "arrived in " + place); System.out.println(p.id + " arrived in " + place); }
                            case "out" -> { p.status = next; p.log(day, "out for delivery"); System.out.println(p.id + " is out for delivery"); }
                            case "deliver" -> { p.status = Status.DELIVERED; p.deliveredDay = day; p.log(day, "delivered"); System.out.println(p.id + " delivered on day " + day); }
                            case "fail" -> {
                                p.failed++;
                                if (p.failed == 3) {
                                    p.status = Status.RETURNED;
                                    p.log(day, "third failed delivery, returned to sender");
                                    System.out.println(p.id + ": third failed delivery, back to " + p.from);
                                } else {
                                    p.status = Status.AT_DEPOT;
                                    p.log(day, "nobody home");
                                    System.out.println(p.id + ": nobody home, attempt " + p.failed + " of 3");
                                }
                            }
                        }
                    }
                    case "track" -> {
                        if (w.length != 2) throw new IllegalArgumentException("Usage: track <id>");
                        Parcel p = parcel(w[1]);
                        System.out.println(p.id + " is " + p.status.text);
                        for (String h : p.history) System.out.println("  " + h);
                    }
                    case "depot" -> {
                        if (w.length != 2) throw new IllegalArgumentException("Usage: depot <town>");
                        List<String> here = new ArrayList<>();
                        for (Parcel p : parcels.values())
                            if ((p.status == Status.AT_DEPOT || p.status == Status.REGISTERED) && p.place.equals(w[1])) here.add(p.id);
                        Collections.sort(here);
                        System.out.println(here.isEmpty() ? "Nothing in " + w[1] : w[1] + ": " + String.join(", ", here));
                    }
                    case "late" -> {
                        if (w.length != 2) throw new IllegalArgumentException("Usage: late <day>");
                        int day = Integer.parseInt(w[1]);
                        boolean any = false;
                        for (Parcel p : parcels.values())
                            if (p.status != Status.DELIVERED && p.status != Status.RETURNED && day - p.day > 3) {
                                System.out.println(p.id + " sent on day " + p.day + ", " + p.status.text);
                                any = true;
                            }
                        if (!any) System.out.println("Nothing late on day " + day);
                    }
                    case "report" -> {
                        Map<Status, Integer> count = new EnumMap<>(Status.class);
                        double money = 0; int delivered = 0, days = 0;
                        for (Parcel p : parcels.values()) {
                            count.merge(p.status, 1, Integer::sum);
                            money += p.price;
                            if (p.status == Status.DELIVERED) { delivered++; days += p.deliveredDay - p.day; }
                        }
                        for (Status s : Status.values()) if (count.containsKey(s)) System.out.println(s.text + ": " + count.get(s));
                        System.out.println("Postage: " + money(money));
                        System.out.println(delivered == 0 ? "Average delivery: none" : String.format("Average delivery: %.1f days", (double) days / delivered));
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
