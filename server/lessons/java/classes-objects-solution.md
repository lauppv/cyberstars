```java
class Dog {
    String name;
    int age;
}

public class Main {
    public static void main(String[] args) {
        Dog d1 = new Dog();
        d1.name = "Rex";
        d1.age = 5;

        Dog d2 = new Dog();
        d2.name = "Buddy";
        d2.age = 3;

        System.out.println(d1.name + " is " + d1.age + " years old");
        System.out.println(d2.name + " is " + d2.age + " years old");
    }
}
```
