public class Main {
    public static void calculator(int number1, int number2, String operator) {
        if (operator.equals("+")) {
            int result = number1 + number2;
            System.out.println(number1 + " " + operator + " " + number2 + " = " + result);
        } else {
        System.out.println("Invalid operator");
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
