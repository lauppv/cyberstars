import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;
import java.util.StringTokenizer;

public class Main {
    public static void main(String[] args) throws Exception {
        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer first = new StringTokenizer(in.readLine());
        int count = Integer.parseInt(first.nextToken());
        int edgeCount = Integer.parseInt(first.nextToken());
        boolean[][] joined = new boolean[count][count];
        List<List<Integer>> neighbours = new ArrayList<>();
        for (int a = 0; a < count; a++) neighbours.add(new ArrayList<>());
        for (int k = 0; k < edgeCount; k++) {
            StringTokenizer line = new StringTokenizer(in.readLine());
            int x = Integer.parseInt(line.nextToken());
            int y = Integer.parseInt(line.nextToken());
            joined[x][y] = true;
            joined[y][x] = true;
            neighbours.get(x).add(y);
            neighbours.get(y).add(x);
        }
        StringBuilder out = new StringBuilder("Matrix:\n");
        for (int a = 0; a < count; a++) {
            for (int b = 0; b < count; b++) {
                if (b > 0) out.append(' ');
                out.append(joined[a][b] ? 1 : 0);
            }
            out.append('\n');
        }
        out.append("List:\n");
        for (int a = 0; a < count; a++) {
            out.append(a).append(':');
            for (int b : neighbours.get(a)) out.append(' ').append(b);
            out.append('\n');
        }
        System.out.print(out);
    }
}
