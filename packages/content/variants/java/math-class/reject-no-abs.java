public class Main {
    public static void main(String[] args) {
        int x1 = 0, y1 = 0, x2 = 3, y2 = 4;
        int dx = x2 - x1;
        int dy = y2 - y1;
        if (dx < 0) dx = -dx;
        if (dy < 0) dy = -dy;
        System.out.println("Walk: " + (dx + dy) + " blocks");
        System.out.println("Fly: " + Math.round(Math.sqrt(dx * dx + dy * dy)));
        System.out.println("Longest leg: " + Math.max(dx, dy));
    }
}
