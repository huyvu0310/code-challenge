/**
 * Problem 4 — Three Ways to Sum to N
 *
 * Each function returns 1 + 2 + ... + n.
 *
 * Precondition: n must be a non-negative integer (n >= 0).
 *   - sum_to_n(0) === 0
 *   - If n < 0, behavior is undefined — callers must not pass negatives.
 *     The functions below do not guard against it (KISS); enforce at the
 *     call site if input is untrusted.
 *
 * Per spec, the result always fits within Number.MAX_SAFE_INTEGER.
 */

/**
 * Implementation A — Iterative loop.
 * Time:  O(n) — one addition per integer in [1, n].
 * Space: O(1) — single accumulator.
 * Trade-off: simplest to read, no allocation, but linear work.
 */
export function sum_to_n_a(n: number): number {
  let sum = 0;
  for (let i = 1; i <= n; i++) sum += i;
  return sum;
}

/**
 * Implementation B — Closed-form (Gauss) formula.
 * Time:  O(1) — constant arithmetic.
 * Space: O(1).
 * Trade-off: fastest possible; only works because a closed form exists.
 */
export function sum_to_n_b(n: number): number {
  return (n * (n + 1)) / 2;
}

/**
 * Implementation C — Recursion.
 * Time:  O(n) — one call per integer.
 * Space: O(n) — call-stack depth grows with n.
 * Trade-off: elegant and concise, but risks RangeError (stack overflow)
 *   for large n since V8 doesn't optimize tail calls.
 */
export function sum_to_n_c(n: number): number {
  if (n === 0) return 0;
  return n + sum_to_n_c(n - 1);
}

// --- Quick sanity checks ---------------------------------------------------
console.log("sum_to_n_a(5)   =", sum_to_n_a(5));    // 15
console.log("sum_to_n_b(5)   =", sum_to_n_b(5));    // 15
console.log("sum_to_n_c(5)   =", sum_to_n_c(5));    // 15

console.log("sum_to_n_a(100) =", sum_to_n_a(100));  // 5050
console.log("sum_to_n_b(100) =", sum_to_n_b(100));  // 5050
console.log("sum_to_n_c(100) =", sum_to_n_c(100));  // 5050

console.log("sum_to_n_a(0)   =", sum_to_n_a(0));    // 0
console.log("sum_to_n_b(0)   =", sum_to_n_b(0));    // 0
console.log("sum_to_n_c(0)   =", sum_to_n_c(0));    // 0
