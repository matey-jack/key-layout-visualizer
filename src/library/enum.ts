export function enumValues<T extends string | number>(enumObj: Record<string, unknown>): T[] {
    return Object.values(enumObj).filter((v): v is T => typeof v === "number");
}
