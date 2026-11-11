```java
import java.util.*;

public class Main {
    interface Switchable { void setOn(boolean on); boolean isOn(); }
    interface Dimmable { void dim(int percent); }

    static abstract class Device implements Switchable {
        String name, room; int watts; boolean on; double wh;
        Device(String name, String room, int watts) { this.name = name; this.room = room; this.watts = watts; }
        public void setOn(boolean on) { this.on = on; }
        public boolean isOn() { return on; }
        double power() { return on ? watts : 0; }
        abstract String kind();
        String state() { return on ? "on" : "off"; }
    }
    static class Light extends Device implements Dimmable {
        int level = 100;
        Light(String n, String r, int w) { super(n, r, w); }
        String kind() { return "light"; }
        public void dim(int p) { level = p; }
        double power() { return on ? watts * level / 100.0 : 0; }
        String state() { return on ? "on at " + level + "%" : "off"; }
    }
    static class Heater extends Device {
        int target = 21;
        Heater(String n, String r, int w) { super(n, r, w); }
        String kind() { return "heater"; }
        String state() { return on ? "on, set to " + target + " C" : "off"; }
    }
    static class Plug extends Device {
        Plug(String n, String r, int w) { super(n, r, w); }
        String kind() { return "plug"; }
    }

    static Map<String, Device> devices = new LinkedHashMap<>();
    static List<String> rooms = new ArrayList<>();
    static int minutes = 0;

    static Device device(String name) {
        Device d = devices.get(name);
        if (d == null) throw new IllegalArgumentException("No device " + name);
        return d;
    }

    static void usage(String[] w, int n, String text) {
        if (w.length != n) throw new IllegalArgumentException("Usage: " + text);
    }

    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int n = Integer.parseInt(in.nextLine().trim());
        for (int i = 0; i < n; i++) {
            String[] p = in.nextLine().trim().split("\\s+");
            int watts = Integer.parseInt(p[3]);
            Device d = switch (p[0]) {
                case "light" -> new Light(p[1], p[2], watts);
                case "heater" -> new Heater(p[1], p[2], watts);
                default -> new Plug(p[1], p[2], watts);
            };
            devices.put(d.name, d);
            if (!rooms.contains(d.room)) rooms.add(d.room);
        }
        System.out.println(n + " devices in " + rooms.size() + " rooms");
        while (in.hasNextLine()) {
            String line = in.nextLine().trim();
            if (line.isEmpty()) continue;
            String[] w = line.split("\\s+");
            try {
                switch (w[0]) {
                    case "quit" -> { System.out.println("Hub off"); return; }
                    case "status" -> {
                        for (String r : rooms) {
                            System.out.println(r + ":");
                            for (Device d : devices.values())
                                if (d.room.equals(r)) System.out.println("  " + d.name + " (" + d.kind() + "): " + d.state());
                        }
                    }
                    case "on", "off" -> {
                        usage(w, 2, w[0] + " <device>");
                        Device d = device(w[1]);
                        boolean on = w[0].equals("on");
                        if (d.isOn() == on) System.out.println(d.name + " is already " + w[0]);
                        else { d.setOn(on); System.out.println(d.name + " " + w[0]); }
                    }
                    case "dim" -> {
                        usage(w, 3, "dim <device> <percent>");
                        Device d = device(w[1]);
                        int p = Integer.parseInt(w[2]);
                        if (!(d instanceof Dimmable dd)) { System.out.println(d.name + " can't be dimmed"); break; }
                        if (p < 10 || p > 100) { System.out.println("Lights dim from 10 to 100%"); break; }
                        dd.dim(p);
                        d.setOn(true);
                        System.out.println(d.name + " at " + p + "%");
                    }
                    case "set" -> {
                        usage(w, 3, "set <heater> <temperature>");
                        Device d = device(w[1]);
                        int t = Integer.parseInt(w[2]);
                        if (!(d instanceof Heater h)) { System.out.println(d.name + " has no thermostat"); break; }
                        if (t < 5 || t > 30) { System.out.println("Heaters go from 5 to 30 C"); break; }
                        h.target = t;
                        System.out.println(d.name + " set to " + t + " C");
                    }
                    case "room" -> {
                        usage(w, 3, "room <room> <on|off>");
                        if (!rooms.contains(w[1])) { System.out.println("No room " + w[1]); break; }
                        if (!w[2].equals("on") && !w[2].equals("off")) throw new IllegalArgumentException("Usage: room <room> <on|off>");
                        int changed = 0;
                        for (Device d : devices.values())
                            if (d.room.equals(w[1]) && !(d instanceof Plug) && d.isOn() != w[2].equals("on")) {
                                d.setOn(w[2].equals("on"));
                                changed++;
                            }
                        System.out.println(w[1] + ": " + changed + (changed == 1 ? " device " : " devices ") + "switched " + w[2]);
                    }
                    case "wait" -> {
                        usage(w, 2, "wait <minutes>");
                        int m = Integer.parseInt(w[1]);
                        if (m < 1) throw new IllegalArgumentException("Usage: wait <minutes>");
                        double total = 0;
                        for (Device d : devices.values()) {
                            d.wh += d.power() * m / 60.0;
                            total += d.power();
                        }
                        minutes += m;
                        System.out.println(String.format("%d min later, drawing %.0f W", m, total));
                    }
                    case "energy" -> {
                        double kwh = 0;
                        Device top = null;
                        for (String r : rooms) {
                            double room = 0;
                            for (Device d : devices.values()) if (d.room.equals(r)) room += d.wh / 1000;
                            kwh += room;
                            System.out.println(String.format("%s: %.2f kWh", r, room));
                        }
                        for (Device d : devices.values()) if (d.wh > 0 && (top == null || d.wh > top.wh)) top = d;
                        System.out.println(String.format("Total: %.2f kWh, %.2f euros", kwh, kwh * 1.2));
                        System.out.println("Biggest user: " + (top == null ? "none" : top.name));
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
