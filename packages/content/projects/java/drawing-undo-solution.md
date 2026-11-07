```java
import java.util.*;

public class Main {
    static int width, height;
    static char[][] canvas;

    interface Command {
        void apply();
        void undo();
        String describe();
    }

    // Every command remembers what it painted over, so undo puts it back
    static abstract class Paint implements Command {
        private final Map<Integer, Character> before = new LinkedHashMap<>();

        void set(int x, int y, char c) {
            if (x < 0 || y < 0 || x >= width || y >= height) return;
            before.putIfAbsent(y * width + x, canvas[y][x]);
            canvas[y][x] = c;
        }

        public void undo() {
            for (var e : before.entrySet()) canvas[e.getKey() / width][e.getKey() % width] = e.getValue();
            before.clear();
        }
    }

    static class Rect extends Paint {
        int x, y, w, h; char c;
        Rect(int x, int y, int w, int h, char c) { this.x = x; this.y = y; this.w = w; this.h = h; this.c = c; }
        public void apply() {
            for (int i = 0; i < w; i++) { set(x + i, y, c); set(x + i, y + h - 1, c); }
            for (int j = 0; j < h; j++) { set(x, y + j, c); set(x + w - 1, y + j, c); }
        }
        public String describe() { return "rect " + x + " " + y + " " + w + " " + h + " " + c; }
    }

    static class Line extends Paint {
        int x1, y1, x2, y2; char c;
        Line(int x1, int y1, int x2, int y2, char c) { this.x1 = x1; this.y1 = y1; this.x2 = x2; this.y2 = y2; this.c = c; }
        public void apply() {
            int dx = Integer.signum(x2 - x1), dy = Integer.signum(y2 - y1);
            int x = x1, y = y1;
            while (true) {
                set(x, y, c);
                if (x == x2 && y == y2) break;
                x += dx;
                y += dy;
            }
        }
        public String describe() { return "line " + x1 + " " + y1 + " " + x2 + " " + y2 + " " + c; }
    }

    static class Text extends Paint {
        int x, y; String word;
        Text(int x, int y, String word) { this.x = x; this.y = y; this.word = word; }
        public void apply() { for (int i = 0; i < word.length(); i++) set(x + i, y, word.charAt(i)); }
        public String describe() { return "text " + x + " " + y + " " + word; }
    }

    static class Fill extends Paint {
        int x, y; char c;
        Fill(int x, int y, char c) { this.x = x; this.y = y; this.c = c; }
        public void apply() {
            if (x < 0 || y < 0 || x >= width || y >= height) return;
            char old = canvas[y][x];
            if (old == c) return;
            Deque<int[]> queue = new ArrayDeque<>();
            queue.add(new int[] {x, y});
            set(x, y, c);
            int[][] steps = {{0, -1}, {0, 1}, {-1, 0}, {1, 0}};
            while (!queue.isEmpty()) {
                int[] p = queue.poll();
                for (int[] s : steps) {
                    int nx = p[0] + s[0], ny = p[1] + s[1];
                    if (nx >= 0 && ny >= 0 && nx < width && ny < height && canvas[ny][nx] == old) {
                        set(nx, ny, c);
                        queue.add(new int[] {nx, ny});
                    }
                }
            }
        }
        public String describe() { return "fill " + x + " " + y + " " + c; }
    }

    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        String[] size = in.nextLine().trim().split("\\s+");
        width = Integer.parseInt(size[0]);
        height = Integer.parseInt(size[1]);
        canvas = new char[height][width];
        for (char[] row : canvas) Arrays.fill(row, '.');
        System.out.println("Canvas " + width + "x" + height);
        Deque<Command> done = new ArrayDeque<>();
        Deque<Command> undone = new ArrayDeque<>();
        while (in.hasNextLine()) {
            String line = in.nextLine().trim();
            if (line.isEmpty()) continue;
            String[] w = line.split("\\s+");
            try {
                Command cmd = null;
                switch (w[0]) {
                    case "quit" -> { System.out.println("Bye"); return; }
                    case "show" -> { for (char[] row : canvas) System.out.println(new String(row)); }
                    case "undo" -> {
                        if (done.isEmpty()) { System.out.println("Nothing to undo"); break; }
                        Command c = done.pop();
                        c.undo();
                        undone.push(c);
                        System.out.println("Undid " + c.describe());
                    }
                    case "redo" -> {
                        if (undone.isEmpty()) { System.out.println("Nothing to redo"); break; }
                        Command c = undone.pop();
                        c.apply();
                        done.push(c);
                        System.out.println("Redid " + c.describe());
                    }
                    case "history" -> {
                        if (done.isEmpty()) System.out.println("Nothing drawn");
                        List<Command> list = new ArrayList<>(done);
                        Collections.reverse(list);
                        for (int i = 0; i < list.size(); i++) System.out.println((i + 1) + ". " + list.get(i).describe());
                        if (!undone.isEmpty()) System.out.println("Can redo: " + undone.size());
                    }
                    case "rect" -> {
                        need(w, 6, "rect <x> <y> <width> <height> <char>");
                        cmd = new Rect(num(w[1]), num(w[2]), num(w[3]), num(w[4]), ch(w[5]));
                    }
                    case "line" -> {
                        need(w, 6, "line <x1> <y1> <x2> <y2> <char>");
                        int x1 = num(w[1]), y1 = num(w[2]), x2 = num(w[3]), y2 = num(w[4]);
                        if (x1 != x2 && y1 != y2) { System.out.println("Lines go straight across or straight down"); break; }
                        cmd = new Line(x1, y1, x2, y2, ch(w[5]));
                    }
                    case "text" -> {
                        need(w, 4, "text <x> <y> <word>");
                        cmd = new Text(num(w[1]), num(w[2]), w[3]);
                    }
                    case "fill" -> {
                        need(w, 4, "fill <x> <y> <char>");
                        cmd = new Fill(num(w[1]), num(w[2]), ch(w[3]));
                    }
                    default -> System.out.println("Unknown command: " + w[0]);
                }
                if (cmd != null) {
                    cmd.apply();
                    done.push(cmd);
                    undone.clear();
                    System.out.println("Drew " + cmd.describe());
                }
            } catch (NumberFormatException e) {
                System.out.println("Not a number: " + e.getMessage().replace("For input string: ", "").replace("\"", ""));
            } catch (IllegalArgumentException e) {
                System.out.println(e.getMessage());
            }
        }
    }

    static void need(String[] w, int n, String usage) {
        if (w.length != n) throw new IllegalArgumentException("Usage: " + usage);
    }

    static int num(String s) { return Integer.parseInt(s); }

    static char ch(String s) {
        if (s.length() != 1) throw new IllegalArgumentException("Draw with a single character, not " + s);
        return s.charAt(0);
    }
}
```
