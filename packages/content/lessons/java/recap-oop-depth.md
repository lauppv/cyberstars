Put records, composition, equals and anonymous classes to work together in one program

---

## Mission: Car Showroom

Tommy opens Sunshine Autos, a car showroom. Build it:

* a record `Car` with a `String model` and an `int price`
* an interface `Pricing` with one method, `int finalPrice(int price)`
* a class `Showroom` that holds its cars in an `ArrayList<Car>`. Give it a method `add(Car car)` and a method `sell(String model)` that takes out the first car with that model and gives it back, or gives back `null` when there is none

In `main`, store the models in a `String` array named `models` and their prices in an `int` array named `prices`, in the same order, and add every car to the showroom. Store the models people want to buy, in order, in a `String` array named `orders`, and the discount of tonight's sale, in percent, in an `int` named `discount`.

Make a `Pricing` with an anonymous class that takes the discount off a price: `price * (100 - discount) / 100`, with no decimals. Then, for every order:

* if the showroom has that model, sell it and print `Sold <model> for <final price>`
* if not, print `<model>: not in stock`

At the end, print `Left: ` followed by the list of cars still in the showroom, as the ArrayList prints it, and `Stock value: N`, the sum of their full prices.

**Example** for `models = { "Infernus", "Cheetah", "Infernus" }`, `prices = { 1000, 800, 900 }`, `orders = { "Infernus", "Banshee" }` and `discount = 10`

```text
Sold Infernus for 900
Banshee: not in stock
Left: [Car[model=Cheetah, price=800], Car[model=Infernus, price=900]]
Stock value: 1700
```

**Example** for `models = { "Stinger" }`, `prices = { 500 }`, `orders = { "Stinger", "Stinger" }` and `discount = 0`

```text
Sold Stinger for 500
Stinger: not in stock
Left: []
Stock value: 0
```
