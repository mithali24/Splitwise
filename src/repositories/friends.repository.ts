import type { Friend } from "../models/friend.model.js";
import type { PageOptions } from "../core/pagination.types.js";

export class FriendsRepository{
    private static instance: FriendsRepository;
    private friends: Friend[] = [];
    static getInstance() {
        if (!FriendsRepository.instance) {
            FriendsRepository.instance = new FriendsRepository();
        }
        return FriendsRepository.instance;
    }
    private constructor() { };

    addFriend(friend: Friend) {
        this.friends.push(friend);
        console.log('Friend added to repository:',friend)
    }

    findFriendByEmail(email: string) {
        return this.friends.find(friend => friend.email === email);
    }

    findFriendByPhone(phone: string) {
        return this.friends.find(friend => friend.phone === phone);
    }

    searchFriends(query:string,pageOption?:PageOptions){
        const lowerQuery = query.toLowerCase();
        const filtered =  this.friends.filter(friend=>{
            friend.name.toLowerCase().includes(lowerQuery) ||
            friend.email.toLowerCase().includes(lowerQuery) ||
            friend.phone.toLowerCase().includes(lowerQuery)
        })

        return {
            data:filtered.slice((pageOption?.offset || 0), (pageOption?.offset || 0) + (pageOption?.limit || 5)),
            matched: filtered.length,
            total:this.friends.length
        }
    }

}

