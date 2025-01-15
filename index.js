/**
 * Collection of combinatorial generator functions.
 */

'use strict';

/**
 * Produce arbitrarily deeply nested iterations over arrays of items, known as Cartesian product.
 * Optionally bounds can be specified to iterate over certain ranges of the arrays.
 * @param {Array} arrays Array of arrays of items.
 * @param {Array} bounds Optional array of pairs of lower and upper integer bounds (upper bound exclusive).
 * @return Generator object.
 */
function* products(arrays, bounds) {
    if (bounds === undefined) {
        bounds = arrays.map((array) => [ 0, array.length]);
    }
    // Resulting array for each iteration, passed to the function action
    const r = [];
    // Recursive iteration function over the number of arrays
    function* iterate(i) {
        if (i < bounds.length) {
            for (r[i] = bounds[i][0]; r[i] < bounds[i][1]; r[i]++) {
                yield* iterate(i + 1);
            }
        } else { 
            yield r.map((j, i) => arrays[i][j]);
        }
    }
    // Start iteration loop
    yield* iterate(0);
};

/**
 * Produce all permutations of an array of items.
 * @param {Array} items Array of items.
 * @return Generator object.
 */
function* permutations(items) {
    // Use a clone of items as work array containing the current
    // permutation ot items
    const a = [...items];
    // Recursive iteration function over the number of items
    function* iterate(k) {
        if (k < a.length) {
            for (let i = k; i < a.length; i++) {
                rotateRight(a, k, i);
                yield* iterate(k + 1);
                rotateLeft(a, k, i);
            }
        } else {
            // Remark: yielding the work array directly may cause
            // unexpected anomalies on the consumer side.
            // Hence a clone of the work array is yielded.
            yield [...a];
        }
    }
    // Start iteration loop
    yield* iterate(0);
};

/**
 * Produce all arrangements of p items from an array of items.
 * With arrangements order matters.
 * @param {Array} items Array of items.
 * @param {Number} p Arrangement size (0 <= p <= n).
 * @return Generator object.
 */
function* arrangements(items, p) {
    // Clone items
    const a = [...items];
    // Work array containing the current arrangement of items
    const r = [];
    // Recursive iteration function for index from 0 to p
    function* iterate(k) {
        if (k < p) {
            for (let i = k; i < a.length; i++) {
                r[k] = rotateRight(a, k, i);
                yield* iterate(k + 1);
                rotateLeft(a, k, i);
            }
        } else {
            // Remark: yielding the work array directly may cause
            // unexpected anomalies on the consumer side.
            // Hence a clone of the work array is yielded.
            yield [...r];
        }
    }
    // Start iteration loop
    yield* iterate(0);
}

/**
 * Produce all combinations of p items from an array of items.
 * With combinations order does not matter.
 * @param {Array} items Array of items.
 * @param {Number} p Combination size (0 <= p <= n).
 * @return Generator object.
 */
function* combinations(items, p) {
    // Work array containing the current combination of items
    const r = [];
    // Recursive iteration function for index from 0 to p
    function* iterate(k) {
        if (k < p) {
            for (let i = (k == 0 ? 0 : r[k - 1] + 1); i < items.length; i++) {
                r[k] = i;
                yield* iterate(k + 1);
            }
        } else {
            yield r.map(i => items[i]);
        }
    }
    // Start iteration loop
    yield* iterate(0);
};

/**
 * Rotate the elements of an array in a given range by one position to the right.
 * The last element at index k becomes the first element at the index j.
 * @param {Array} a Array
 * @param {Number} j First range index
 * @param {Number} k last range index
 * @returns The element value at index j after the rotation.
 */
function rotateRight(a, j, k) {
    let x = a[k];
    for (let i = k; i > j; i--) a[i] = a[i-1];
    a[j] = x;
    return x;
}

/**
 * Rotate the elements of an array in a given range by one position to the left.
 * The first element at index j becomes the last element at the index k.
 * @param {Array} a Array
 * @param {Number} j First range index
 * @param {Number} k last range index
 * @returns The element value at index k after the rotation.
 */
function rotateLeft(a, j, k) {
    let x = a[j];
    for (let i = j; i < k; i++) a[i] = a[i+1];
    a[k] = x;
    return x;
}

module.exports = {
    products, permutations, arrangements, combinations,
};
