# Problem 4 — Three Ways to Sum to N

Three TypeScript implementations of `sum_to_n(n)` returning `1 + 2 + ... + n`.

## Implementations (in `sum-to-n.ts`)

| # | Approach | Time | Space | Notes |
|---|---|---|---|---|
| A | Iterative `for` loop | O(n) | O(1) | Simple, predictable, no allocation. |
| B | Closed-form `n*(n+1)/2` | O(1) | O(1) | Fastest. Recommended in production. |
| C | Recursion | O(n) | O(n) | Elegant but risks stack overflow for large n (V8 has no TCO). |

Assumes `n` is a non-negative integer (`sum_to_n(0) === 0`). Per spec,
results fit within `Number.MAX_SAFE_INTEGER`.

## How to run

Requires **Node.js** (any recent version, e.g. v20+). No install step needed —
`npx` fetches `tsx` (a zero-config TypeScript runner) on the fly:

```bash
cd src/problem4
npx tsx sum-to-n.ts
```

Expected output:

```
sum_to_n_a(5)   = 15
sum_to_n_b(5)   = 15
sum_to_n_c(5)   = 15
sum_to_n_a(100) = 5050
sum_to_n_b(100) = 5050
sum_to_n_c(100) = 5050
sum_to_n_a(0)   = 0
sum_to_n_b(0)   = 0
sum_to_n_c(0)   = 0
```

### Alternative: compile with `tsc`

```bash
npx tsc sum-to-n.ts --target ES2020 && node sum-to-n.js
```
