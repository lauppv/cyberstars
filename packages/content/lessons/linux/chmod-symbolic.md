The **chmod** command changes file permissions. In **symbolic mode**, you specify:

1. **Who**: `u` (user/owner), `g` (group), `o` (others), `a` (all)
2. **Action**: `+` (add), `-` (remove), `=` (set exactly)
3. **Permission**: `r`, `w`, `x`

### Adding execute permission for the owner

```bash
chmod u+x script.sh
```

Now the owner can run `script.sh` as a program.

### Removing write permission from group and others

```bash
chmod go-w secret.txt
```

Group and others can no longer modify this file.

### Setting exact permissions

```bash
chmod u=rwx,g=rx,o=r file.txt
```

This sets owner to full access, group to read+execute, others to read only.

### Multiple changes at once

```bash
chmod u+x,g-w file.txt
```

Add execute for user AND remove write for group in one command.

After each `chmod`, verify with `ls -l` to confirm the change took effect.

---

## Mission: Activate the Firmware Deployer

A firmware update is ready in `deploy.sh`, but it can't run yet, and it carries settings outsiders must never read. Change only what has to change: the owner gets to run it, and everyone outside the owner and the group loses the right to read it. Every other permission stays as it is. Then put a copy in a new `deploy-ready` folder.

**Expected result**

`deploy.sh` can be run by its owner and can't be read by others, its other permissions are untouched, and a copy sits in `deploy-ready`.
