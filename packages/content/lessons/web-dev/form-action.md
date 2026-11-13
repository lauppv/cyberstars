A letter without an address on the envelope goes nowhere, however nice the letter is. A form is the same: it needs to know where to go, and how to get there.

## `action`: where it goes

A form is read by a server, a computer somewhere that does something with it: it saves an order, or it looks for games. The `action` attribute holds the address of the server's page that reads the form:

```html preview
<form action="https://games.example/search">
  <label for="q">Search games</label><br />
  <input id="q" name="q" />
  <button>Search</button>
</form>
```

Type `chess` and click **Search**. Here, as in your editor, the page stays where it is, and the line under it says what the form would send. On a real website, the browser would open this address:

```text
https://games.example/search?q=chess
```

The form's address, a `?`, then the same `name=value` pairs, joined by `&`. A form without an `action` goes to the address of its own page.

## `method`: how it goes

The `method` attribute says how the pairs travel. There are two ways.

`get` puts them in the address, as above. It's what a form does when it has no method. It's good for a search: you can save the address, send it to a friend, and open the same results again.

`post` puts them inside the message to the server, not in the address. The address bar shows only the action. Use it when the form changes something, like an order, a sign-up or a booking, and when it holds personal details:

```html
<form action="https://pizza.example/order" method="post">
```

On a real website, the browser opens `https://pizza.example/order`, and nothing after it. In the editor and here, the page still stays where it is: you see the difference only on a real server.

## Break it on purpose

Forget the method on the pizza order. Ida orders a pizza, and the browser opens:

```text
https://pizza.example/order?name=Ida+Moreau&address=12+Lake+Street
```

A `+` is a space in an address. Now Ida's home address is in the address bar for anyone behind her to read. It's in the history of the browser, and in the link she copies to a friend. Personal details don't belong in an address bar.

---

## Mission: Where does it go?

Your booking form has no `action`, so it would go back to `boarding.html`, where nobody reads it. The station's server reads bookings at `https://station.example/book`.

**Example**: the page looks the same, and the console still shows the line of what is sent. The difference is in where it would go.

- The form goes to `https://station.example/book`.
- A booking holds personal details, so they never show in the address bar.
- The form still sends every box as before.

Psst, both attributes go on the `<form>` tag, not on the button :)
