public class Main {
    static int[] val = new int[7];
    static int[] left = {1, 3, -1, -1, 6, -1, -1};
    static int[] right = {2, 4, 5, -1, -1, -1, -1};

    static void walk(int i, int order) {
        if (i < 0) return;
        if (order == 0) System.out.print(val[i] + " ");
        walk(left[i], order);
        if (order == 1) System.out.print(val[i] + " ");
        walk(right[i], order);
        if (order == 2) System.out.print(val[i] + " ");
    }

    public static void main(String[] args) {
        int a = 1;
        int b = 2;
        int c = 3;
        int d = 4;
        int e = 5;
        int f = 6;
        int g = 7;
        val[0] = a; val[1] = b; val[2] = c; val[3] = d; val[4] = e; val[5] = f; val[6] = g;
        String[] names = {"Preorder: ", "Inorder: ", "Postorder: "};
        for (int k = 0; k < 3; k++) {
            System.out.print(names[k]);
            walk(0, k);
            System.out.println();
        }
    }
}
