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
     let name = "";
    let email = "";
    let phone = "";

    // TODO: validate name (only alphabets)
   while (true) {
    name = String(await ask("Enter friend's name: ") ?? "");

        if (name.trim() === "" || !/^[a-zA-Z ]+$/.test(name)) {
            console.log(" Name must be valid");
            continue;
        }
        break;
}

    // TODO: validate email format
    while (true) {
          email = String(await ask("Enter friend's email: ") ?? "");

        if (email.trim() === "" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            console.log(" Invalid email format");
            continue;
        }
        break;
    }

    // TODO: validate phone (10 digits)
    while (true) {
         phone = String(await ask("Enter friend's phone number: ") ?? "");

        if (phone.trim() === "" || !/^\d{10}$/.test(phone)) {
            console.log(" Phone must be exactly 10 digits");
            continue;
        }
        break;
    }

    let openingBalance = 0;

while (true) {
    const input = (await ask(
        "Enter opening balance (positive means they owe you, negative means you owe them): "
    )) as string;

    const value = input.trim() === "" ? "0" : input;

    if (!/^-?\d+$/.test(value)) {
        console.log(" Invalid number. Enter only digits like 1000 or -500");
        continue;
    }

    openingBalance = Number(value);
    break;
}

    const friend = {
        id: Date.now().toString(),
        name,
        email,
        phone,
        balance: Number(openingBalance)
    };

    try {
        if (friendsController.searchFriend(email).matched > 0) {
            throw new ConflictError('email', 'Email already exists');
        }

        if (friendsController.searchFriend(phone).matched > 0) {
            throw new ConflictError('phone', 'Phone already exists');
        }

        await friendsController.addFriend(friend);
        console.log("Friend added successfully!");

    } catch (error) {
        if (error instanceof ConflictError) {
            console.log(` ${error.message}`);
        } else {
            console.log(" Error adding friend",error);
        }
    }
};


const searchFriend = async () => {
    const query = (await ask("Enter name/email/phone to search: ")) as string;

    const result = friendsController.searchFriend(query);

    console.log("\n--- SEARCH RESULTS ---");
    console.log(`Total matches: ${result.matched}`);

    result.data.forEach(friend => {
        console.log(`- ${friend.name} | ${friend.email ?? "N/A"} | ${friend.phone ?? "N/A"}`);
    });
};


const updateFriend = async () => {
    const identifier = (await ask("Enter name OR email of friend to update: ")) as string;

    const result = friendsController.searchFriend(identifier);

    if (result.matched === 0) {
        console.log(" Friend not found!");
        return;
    }

    const friend = result.data[0];
    if (!friend) return;

    const updateName = (await ask("Update Name? (y/n): ")) as string;
    const updateEmail = (await ask("Update Email? (y/n): ")) as string;
    const updatePhone = (await ask("Update Phone? (y/n): ")) as string;

    let newName = friend.name;
    let newEmail = friend.email;
    let newPhone = friend.phone;

    if (updateName.toLowerCase() === 'y') {
        newName = (await ask("Enter new name: ")) as string;

        if (!/^[a-zA-Z ]+$/.test(newName)) {
            console.log("Invalid name");
            return;
        }
    }

    if (updateEmail.toLowerCase() === 'y') {
        newEmail = (await ask("Enter new email: ")) as string;

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
            console.log("Invalid email");
            return;
        }
    }

    if (updatePhone.toLowerCase() === 'y') {
        newPhone = (await ask("Enter new phone: ")) as string;

        if (!/^\d{10}$/.test(newPhone)) {
            console.log("Phone must be 10 digits");
            return;
        }
    }

    const updatedFriend = {
        name: newName,
        email: newEmail,
        phone: newPhone,
        balance: friend.balance
    };

    try {
        await friendsController.updateFriend(identifier, updatedFriend);
        console.log("Friend updated!");
    } catch {
        console.log(" Error updating friend");
    }
};


const removeFriend = async () => {
    const nameToFind = (await ask("Enter name of friend to remove: ")) as string;

    const result = friendsController.searchFriend(nameToFind);

    if (result.matched === 0) {
        console.log(" Friend not found!");
        return;
    }

    const friend = result.data[0];
    if (!friend) return;

    try {
        await friendsController.deleteFriend(friend.name, friend.email);
        console.log("Friend removed!");
    } catch {
        console.log(" Error removing friend");
    }
};


export const manageFriends = async () => {
    while (true) {
        const choice = await choose('What do you want to do?', options, false);

        switch (choice!.value) {
            case '1':
                await addFriend();
                break;

            case '2':
                await searchFriend();
                break;

            case '3':
                await updateFriend();
                break;

            case '4':
                await removeFriend();
                break;

            case '5':
                console.log('Exiting...');
                close();
                return;

            default:
                console.log(" Invalid choice");
        }
    }
};