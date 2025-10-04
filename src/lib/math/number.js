export function mix(a, b, t) {
    return a + (b - a) * t;
}

export function mod(n, m) {
    return ((n % m) + m) % m;
}