Chapter 7 was about who may do what with a file: reading its permissions, changing them by name or by number, and knowing who you are on the system.

Look at a file's permissions before you change them, and again after.

---

## Mission: Lockdown Protocol

A security breach was detected on deck 3, and the captain has ordered a lockdown of every file in your home directory. The protocol sorts files into four kinds:

- **Secret**: only the owner reads and writes it; nobody else gets anything.
- **Script**: the owner can do everything, the group can read and run it, others get nothing.
- **Internal**: the owner reads and writes it, the group can read it, others get nothing.
- **Public**: everyone can read it, only the owner can write it.

Look at each file, decide which kind it is, and give it that access.

**Expected result**

Every file in your home directory has exactly the access of its kind.
