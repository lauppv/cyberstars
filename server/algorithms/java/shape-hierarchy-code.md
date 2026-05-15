import java.util.Scanner;
import java.util.ArrayList;

abstract class Shape {
    // TODO: abstract method getArea()
}

class Circle extends Shape {
    // TODO: radius field, constructor, getArea()
}

class Rectangle extends Shape {
    // TODO: width/height fields, constructor, getArea()
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        ArrayList<Shape> shapes = new ArrayList<>();
        // TODO: read number of shapes
        // TODO: for each line, create Circle or Rectangle and add to list
        // TODO: sum all areas and print "Total: X" with 2 decimal places
    }
}
