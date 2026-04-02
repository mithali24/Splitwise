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
        if (this.repository.getFriendById(friend.id)) {
            throw new ConflictError('Friend with this ID already exists', 'id');
        }
        if (friend.email && this.checkEmailExists(friend.email)) {
            throw new ConflictError('Friend with this email already exists', 'id');
        }
        if (friend.phone && this.checkPhoneExists(friend.phone)) {
            throw new ConflictError('Friend with this phone number already exists', 'id');
        }
        
        
        FriendsRepository.getInstance().addFriend(friend);
    }

}
