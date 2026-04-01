import { openInterractionManager } from "./src/presentation/interraction-manager.js"

const run = async () => {
  const { ask, choose, close } = openInterractionManager();

};