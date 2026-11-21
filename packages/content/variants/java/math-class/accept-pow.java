public class Main {
    public static void main(String[] args) {
        int x1 = 0, y1 = 0, x2 = 3, y2 = 4;
        int dx = Math.abs(x1 - x2);
        int dy = Math.abs(y1 - y2);
        long fly = Math.round(Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)));
        System.out.println("Walk: " + (dx + dy) + " blocks");
        System.out.println("Fly: " + fly);
        System.out.println("Longest leg: " + (dx > dy ? dx : dy));
    }
}
