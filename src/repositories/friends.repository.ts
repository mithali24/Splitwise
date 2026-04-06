import type { Friend } from "../models/friend.model.js";
import type { PageOptions } from "../core/pagination.types.js";
import { AppDBManager } from "../models/db-manager.js";

export class FriendsRepository {
    private static sharedInstance: FriendsRepository|null=null;
    private friends: Friend[] = [];
    static getInstance():FriendsRepository {
        if (!this.sharedInstance) {
           this.sharedInstance = new FriendsRepository();
        }
        return this.sharedInstance;
    }
    private constructor() {
        this.friends =AppDBManager.getInstance().getDB()?.table('friends') as Friend[];
     };

    addFriend(friend: Friend) {
        this.friends.push(friend);
        console.log('Friend added to repository:', friend)
        AppDBManager.getInstance().save();
    }

    findFriendByEmail(email: string) {
        return this.friends.find(friend => friend.email === email);
    }

    findFriendByPhone(phone: string) {
        return this.friends.find(friend => friend.phone === phone);
    }


    searchFriends(query: string, pageOption?: PageOptions) {
    const lowerQuery = query.toLowerCase();

    const filtered = this.friends.filter(friend => {
        // Use ?. to safely access properties and ?? "" to handle null/undefined
        const name = friend.name?.toLowerCase() ?? "";
        const email = friend.email?.toLowerCase() ?? "";
        const phone = friend.phone?.toLowerCase() ?? "";

        return (
            name.includes(lowerQuery) ||
            email.includes(lowerQuery) ||
            phone.includes(lowerQuery)
        );
    });

    return {
        data: filtered.slice(
            pageOption?.offset || 0,
            (pageOption?.offset || 0) + (pageOption?.limit || 5)
        ),
        matched: filtered.length,
        total: this.friends.length
    };
}
    
    updateFriend(email: string, updatedFriend: Friend) {
    const index = this.friends.findIndex(friend => friend.email === email);

    if (index === -1) {
        throw new Error("Friend not found");
    }

    this.friends[index] = updatedFriend;

    console.log("Friend updated:", updatedFriend);
    AppDBManager.getInstance().save();
}


    deleteFriend(name: string, email: string) {
    const index = this.friends.findIndex(
        friend => friend.name === name && friend.email === email
    );

    if (index === -1) {
        throw new Error("Friend not found");
    }

    this.friends.splice(index, 1);
    console.log(`Friend deleted: ${name} | ${email}`);

    AppDBManager.getInstance().save();
}

    }
