public class Main {
    static int[] val = new int[8], left = new int[8], right = new int[8];
    static int used = 0;

    static int insert(int at, int v) {
        if (at < 0) {
            val[used] = v;
            left[used] = -1;
            right[used] = -1;
            return used++;
        }
        if (v < val[at]) left[at] = insert(left[at], v);
        else right[at] = insert(right[at], v);
        return at;
    }

    static void inorder(int at) {
        if (at < 0) return;
        inorder(left[at]);
        System.out.print(val[at] + " ");
        inorder(right[at]);
    }

    static int height(int at) {
        return at < 0 ? -1 : 1 + Math.max(height(left[at]), height(right[at]));
    }

    static boolean search(int at, int t) {
        if (at < 0) return false;
        if (val[at] == t) return true;
        return search(t < val[at] ? left[at] : right[at], t);
    }

    public static void main(String[] args) {
        int[] values = {50, 30, 70, 20, 40, 60, 80};
        int target = 60;

        int root = -1;
        for (int v : values) root = insert(root, v);
        System.out.print("Sorted: ");
        inorder(root);
        System.out.println();
        System.out.println("Height: " + height(root));
        System.out.println("Search " + target + ": " + (search(root, target) ? "found" : "not found"));
    }
}
