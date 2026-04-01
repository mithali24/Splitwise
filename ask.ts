import * as readline from 'node:readline';
//const { stdin: input, stdout: output } = require('node:process');
import { stdin as input, stdout as output } from 'node:process';

const rl = readline.createInterface({ input, output });

export type ValidatorFn = (value: string) => boolean;
//export type ValidationFuntionConstructor = (errorMessage: string) => ValidatorFn;

export interface AskOptions{
    defaultAnswer: string | undefined,
    validator: ValidatorFn | undefined;
}
const ask = async (question:string, options:AskOptions) => {
    const { defaultAnswer, validator } = options || {};
    
    return new Promise((resolve) => {
        rl.question(question + ` ${defaultAnswer ? '(' + defaultAnswer + ')' : ''}`, (answer) => {
            if (validator && !validator(answer)) {
                console.log('Invalid input. Please try again.');
                return resolve(ask(question, { defaultAnswer: defaultAnswer, validator: validator }));
            }
            resolve(answer || defaultAnswer);
        });
    });
}


