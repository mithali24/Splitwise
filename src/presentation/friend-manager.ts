import { openInterractionManager, type Choice } from "./interraction-manager.js";
import { numberValidator } from "../core/validators/number.validator.js";
import { FriendsController } from "../controllers/friend-controller.js";
import { ConflictError } from "../core/errors/conflict.error.js";

const options: Choice[] = [
    { label: 'Add friend', value: '1' },
    { label: 'Search friend', value: '2' },
    { label: 'Update friend', value: '3' },
    { label: 'Remove friend', value: '4' },
    { label: 'Exit', value: '5' }
];

const friendsController = new FriendsController();

const { ask, choose, close } = openInterractionManager();

const addFriend = async () => {
    const name = (await ask("Enter friend's name: ")) as string;
    const email = (await ask("Enter friend's email: ")) as string;
    const phone = (await ask("Enter friend's phone number: ")) as string;

    const openingBalance = await ask(
        "Enter opening balance (positive means they owe you, negative means you owe them): ",
        {
            validator: numberValidator,
            defaultAnswer: "0"
        }
    );

    const friend = {
        id: Date.now().toString(),
        name: name,
        email: email,
        phone: phone,
        balance: Number(openingBalance)
    };

    try {
        await friendsController.addFriend(friend);
        console.log("Friend added successfully!");
    } catch (error) {
        if (error instanceof ConflictError) {
            // handle conflict if needed
        }
        if (error instanceof Error) {
            // handle generic error if needed
        }
    }
};

export const manageFriends = async () => {
    while (true) {
        const choice = await choose('What do you want to do?', options, false);
        switch (choice!.value) {
            case '1':
                console.log('Adding friend...');
                break;
            case '2':
                console.log('Searching friend...');
                break;
            case '3':
                console.log('Updating friend...');
                break;
            case '4':
                console.log('Removing friend...');
                break;
            case '5':
                console.log('Exiting...');
                close();
                return;
        }
    }
};