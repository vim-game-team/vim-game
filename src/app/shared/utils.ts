export function addAsDigits(num1: any, num2: any): number {
    if (typeof Number(num1) != "number" || typeof Number(num2) != "number")
        throw "failed casting as numbers: " + num1 + ", " + num2;

    return Number(String(num1) + String(num2));
}

export function isType(val: any, type: string): boolean {
    return typeof (val) == type;
}

export function isNumeric(val: string) {
    return isNaN(Number(val)) ? false : true;
}

export function isAlphaNumeric(char: string) {
    return char.toUpperCase() != char.toLowerCase() || isNumeric(char);
}

export function max(num1: number, num2: number) {
    return num1 > num2
        ? num1
        : num2;
}
export function min(num1: number, num2: number) {
    return num1 < num2
        ? num1
        : num2;
}
