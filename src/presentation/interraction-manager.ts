import * as readline from 'node:readline';
//const { stdin: input, stdout: output } = require('node:process');
import { stdin as input, stdout as output } from 'node:process';

// const rl = readline.createInterface({ input, output });

//export type ValidatorFn = (value: string) => boolean;
//export type ValidationFuntionConstructor = (errorMessage: string) => ValidatorFn;

export interface AskOptions{
    defaultAnswer?: string | undefined,
    validator?:  ((s: string) => boolean) | undefined;
}

export interface Choice{
    label: string,
    value:string
}


// const genders: Choice[] = [
//     { label: 'Male', value: 'M' },
//     { label: 'Female', value: 'F' },
//     {label:'Others',value:'O'}
// ]

// const expenseTypes: Choice[] = [
//     { label: 'Food', value: 'FOOD' },
//     { label: 'Transport', value: 'FOOD' },
//     { label: 'Food', value: 'FOOD' },
//     { label: 'Food', value: 'FOOD' },
    
// ]



export const openInterractionManager = () => {
    const rl = readline.createInterface({ input, output });

    const ask = async (question:string, options?:AskOptions) => {
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
    const choose: (question: string, choices: Choice[], optional?: boolean) => Promise<Choice | undefined> = async (question, choices, optional) => {
        console.log(question);
        choices.forEach((choice) => {
            console.log(`${choice.label}. ${choice.value}`);
        })
        const choice = await ask('Please enter your choice: ', {
            validator: (input) => {
                if(!optional && input.trim() === "") {
                    return true;
                }
                return choices.some(choice => choice.value === input);
            }
        })
        return choices.find(c => c.value === choice)
    }
    
    const close = () => {
        rl.close();
    }

    return {
        ask,
        choose,
        close,
    }
}