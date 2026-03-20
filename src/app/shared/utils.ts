export function addAsDigits(num1: any, num2: any): number {
    if (typeof Number(num1) != "number" || typeof Number(num2) != "number")
        throw "failed casting as numbers: " + num1 + ", " + num2;

    return Number(String(num1) + String(num2));
}

export function isType(val: any, type: string): boolean {
    return typeof (val) == type;

}