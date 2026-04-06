import { manageFriends } from "./presentation/friend-manager.js";

const run = async () => {
  await manageFriends();
};

run();