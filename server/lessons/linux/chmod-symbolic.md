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

A critical firmware update is ready in `deploy.sh`, but the script cannot run yet — and it also carries sensitive settings that outsiders should never read.

1. Give the owner permission to run `deploy.sh` as a program.
2. Remove read access from others on `deploy.sh` so outsiders cannot view it.
3. Confirm the changes by viewing the file's detailed permissions.
4. Create a folder called `deploy-ready` and copy `deploy.sh` into it.

**Expected result**

`deploy.sh` is executable by the owner and unreadable by others, and a copy sits in `deploy-ready`.
