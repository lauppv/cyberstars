public class Main {
    public static void calculator(int numar1, int numar2, String operator) {
        if (operator.equals("+")) {
            int rezultat = numar1 + numar2;
            System.out.println(numar1 + " " + operator + " " + numar2 + " = " + rezultat);
        } else {
        System.out.println("Operator invalid");
    }
}

public static void main(String[] args) {
    calculator(14, 12, "+");
    calculator(10, 3, "-");
    calculator(5, 4, "*");
    calculator(10, 2, "/");
    calculator(1, 1, "x");
}

}
