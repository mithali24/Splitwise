import { ConflictError } from "../core/errors/conflict.error.js";
import type { Friend } from "../models/friend.model.js";
import { FriendsRepository } from "../repositories/friends.repository.js";

export class FriendsController{
    private repository = FriendsRepository.getInstance();
    checkEmailExists(email: string) {
        return this.repository.findFriendByEmail(email) !=undefined;
    }

    checkPhoneExists(phone: string) {
        return false;
    }

    addFriend(friend: Friend) {
       
        if (friend.email && this.checkEmailExists(friend.email)) {
            throw new ConflictError('Friend with this email already exists', 'email');
        }
        if (friend.phone && this.checkPhoneExists(friend.phone)) {
            throw new ConflictError('Friend with this phone number already exists', 'phone');
        }
        
        
        FriendsRepository.getInstance().addFriend(friend);
    }

     searchFriend(query: string) {
        return this.repository.searchFriends(query);
    }

    updateFriend(identifier: string, updatedFriend: Friend) {
    const existingFriend =
        this.repository.findFriendByEmail(identifier) ||
        this.repository.searchFriends(identifier).data[0];

    if (!existingFriend) {
        throw new Error("Friend not found");
    }

    if (
        updatedFriend.email !== existingFriend.email &&
        this.checkEmailExists(updatedFriend.email)
    ) {
        throw new ConflictError('Friend with this email already exists', 'email');
    }

    this.repository.updateFriend(existingFriend.email, updatedFriend);
    }

    deleteFriend(name: string, email: string) {
    const existingFriend = this.repository.findFriendByEmail(email);

    if (!existingFriend || existingFriend.name !== name) {
        throw new Error("Friend not found");
    }

    this.repository.deleteFriend(name, email);
}
}