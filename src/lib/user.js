import GUN from "gun";
import "gun/sea";
import "gun/axe";
import { writable } from "svelte/store";

// Init DB
export const db = GUN({
  peers: import.meta.env.VITE_GUN_URL.split(","),
});
console.log({
  url: import.meta.env.VITE_GUN_URL.split(","),
});

export const user = db.user().recall({ sessionStorage: true });

// Init User
export const username = writable("");

user.get("alias").on((v) => username.set(v));

db.on("auth", async (_) => {
  const alias = await user.get("alias");
  username.set(alias);

  console.log(`signed in as ${alias}`);
});
