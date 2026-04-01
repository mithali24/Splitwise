import type { ValidatorFn } from "./validator.type.js"

export const numberValidator: ValidatorFn = (input: string )=> {
    return isNaN(+input);
}