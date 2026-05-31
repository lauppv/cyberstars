A **terminal** is a text window where you talk to your computer by **typing
commands** instead of clicking buttons.

You type a command, press **Enter**, and the computer runs it and shows you the
result. The small symbol at the start of the line (often `$`) is called the
**prompt** — it means the computer is ready and waiting for you.

The first command we will learn is **echo**. It simply prints back whatever text you
give it.

```bash
echo Hello
```

This displays:

```text
Hello
```

You can print any text you like:

```bash
echo Welcome to Linux
```

```text
Welcome to Linux
```

If your text needs to stay exactly as written (with spaces), you can wrap it in
quotes:

```bash
echo "Linux is fun"
```

```text
Linux is fun
```

Don't worry about memorising everything — the terminal is a place to **experiment**.
Try a command, see what happens, try another.

---

## Mission: First Transmission

The station's communication array just came online and needs a signal test. Your job is to send the first message from this terminal.

Use the `echo` command to transmit the exact message: `Mission control online`

**Expected result**

The terminal prints back `Mission control online`, confirming your transmission was received.
