public class Main {
    public static void main(String[] args) {
        int x1 = 0, y1 = 0, x2 = 3, y2 = 4;
        int dx = Math.abs(x2 - x1);
        int dy = Math.abs(y2 - y1);
        double straight = Math.sqrt(dx * dx + dy * dy);
        System.out.println("Walk: " + (dx + dy) + " blocks");
        System.out.println("Fly: " + Math.round(Math.floor(straight)));
        System.out.println("Longest leg: " + Math.max(dx, dy));
    }
}
