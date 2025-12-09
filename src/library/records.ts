export function mapValues<V, R>(
    obj: Record<string, V>,
    f: (key: string, value: V) => R
): Record<string, R> {
    const newEntries = Object.entries(obj)
        .map(([k, v]) => [k, f(k, v)]);
    return Object.fromEntries(newEntries);
}