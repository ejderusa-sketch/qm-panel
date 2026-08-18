# COLLABORATION — Working on qm-panel with more than one person

Repo: `https://github.com/ejderusa-sketch/qm-panel`
Live site: `https://ejderusa-sketch.github.io/qm-panel/`
Live branch: **`main`** (GitHub → Settings → Pages must point here). Everyone pushes to `main` (or opens a PR into `main`).

The whole app is a **single file: `index.html`** (React + Babel from CDN, no build step). Because it's one big file with a **manual version number in 5 places**, uncoordinated parallel edits cause merge conflicts and can break the live site. Follow the rules below.

---

## 1. One-time setup

### Owner (EJDER) — on GitHub.com
1. **Settings → Collaborators → Add people** → invite the other person's GitHub username.
2. **Settings → Pages** → confirm the published branch is `main`.

### New person — Windows laptop
1. Install **Git for Windows** (https://git-scm.com) and optionally **VS Code**.
2. Set identity:
   ```
   git config --global user.name "Your Name"
   git config --global user.email "you@example.com"
   ```
3. Clone:
   ```
   git clone https://github.com/ejderusa-sketch/qm-panel.git
   cd qm-panel
   ```
   (First push signs in to GitHub with your own account — you have collaborator access.)

---

## 2. Golden rules (EVERYONE, every change)

1. **`git pull` BEFORE editing.** Always start from the latest.
2. **One person edits at a time.** Message the other "working now / done" — never both at once.
3. **Bump the version in all 5 places** (see below), **verify Babel compiles**, **commit**, then **`git push` immediately.** Don't hold changes for hours.
4. **Coordinate the version number** — whoever pulled last sees the current number, uses the next. Never two people on the same number.
5. **0-rule / data safety:** never change save/load logic in a way that lets empty data overwrite full data. Read `github-panel` skill + `QM-NOTLAR.md` first.

---

## 3. Version bump — the 5 places (do ALL, every change)

In `index.html`:
1. Top comment changelog (very top `<!-- ... -->`) — add a `GITHUBxxxx` line.
2. Footer badge `GITHUBxxxx`.
3. Hero/top-corner badge `(GITHUBxxxx)` — easy to forget; this is the number the user sees.
4. `var CURRENT=xxxx;`

And:
5. `version.txt` = the new number.

Also add a line to the top of `QM-NOTLAR.md` describing what changed.

---

## 4. Verify before commit (never push broken JSX)

The app uses in-browser Babel; a syntax error makes the whole panel show "yükleniyor…" forever. Always compile-check first. On any machine with Node:
```
cd /tmp   (or any temp dir)
npm install @babel/core @babel/preset-react
```
Then a small script that extracts the `<script type="text/babel">…</script>` block and runs `@babel/core`.transformSync with `@babel/preset-react`. If it prints an error, DO NOT push.

Rule: **never put `/* */` block comments inside JSX** (they render as visible text).

---

## 5. Recommended workflow for the new developer — Branch + Pull Request

Instead of pushing straight to `main`, work on a branch and let the owner review/merge. This keeps the live site safe.

```
git checkout main
git pull
git checkout -b my-change          # a short descriptive name
# ...edit index.html, bump version, babel-check...
git add -A
git commit -m "GITHUBxxxx: what changed"
git push -u origin my-change
```
Then on GitHub: **Compare & pull request** → owner reviews → **Merge**. Live updates after merge to `main`.

---

## 6. Publishing (going live)

GitHub Pages auto-publishes on push/merge to `main`. It may take 1–2 minutes and the CDN can cache — open with a fresh `?v=<something>` in the URL, or hard-refresh (Ctrl+F5 on Windows), to see the new version. Confirm the top-corner badge shows the new `GITHUBxxxx`.

(On the owner's Mac there is a `YAYINLA.command` that does add/commit/push. On Windows just use `git add -A && git commit -m "..." && git push`.)

---

## 7. If you get a merge conflict

Because it's one big file, conflicts touch `index.html`. To resolve:
```
git pull                     # conflict reported
# open index.html, find <<<<<<< ======= >>>>>>> markers, keep the correct code
git add index.html
git commit
git push
```
If unsure, ask the other person before force-anything. **Never `git push --force`** to `main`.

---

## 8. Read first, every session
- `github-panel` skill (core rules) and `github-panel-100` (full list) — Cowork skills.
- `QM-NOTLAR.md` (version history), `EJDER-100-ISTEK.md` (EJDER's 100 requests), `CLAUDE.md` (session start instructions).
