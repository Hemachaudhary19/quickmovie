import User from "../configs/models/User.js";
import { Inngest } from "inngest";

// create inngest client
// export const inngest = new Inngest({ name: "Quick Movie Show" });
export const inngest = new Inngest({ id: "my-app" });

//Inngest Function to save user data to a database
const syncUserCreation = inngest.createFunction(
  { id: 'sync-user-from-clerk' },
  { event: 'clerk/user.created' },
  async ({ event }) => {
const { id, first_name, last_name, email_addresses, image_url } = event.data;

// Clerk sends email_addresses as an array of objects
const email = Array.isArray(email_addresses) && email_addresses.length > 0
  ? email_addresses[0].email_address
  : null;

if (!email) {
  throw new Error("User email not found in event data");
}

const userData = {
  _id: id,
  email: email,
  name: `${first_name} ${last_name}`.trim(),
  image: image_url
};

await User.create(userData);

  },
);
//inngest function to delete user from database

const syncUserDeletion = inngest.createFunction(
  { id: 'delete-user-with-clerk' },
  { event: 'clerk/user.deleted' },
  async ({ event }) => {
    try {
      const { id } = event.data;
      const deletedUser = await User.findByIdAndDelete(id);
      if (!deletedUser) {
        console.log(`User with id ${id} not found`);
      }
      return { success: true };
    } catch (error) {
      console.error("Error deleting user:", error);
      return { success: false, error: error.message };
    }
  },
);

// inngest function to update use data
const syncUserUpdation = inngest.createFunction(
  { id: 'update-user-from-clerk' },
  { event: 'clerk/user.updated' },
  async ({ event }) => {
    try {
     const { id, first_name, last_name, email_addresses, image_url } = event.data;

const email = Array.isArray(email_addresses) && email_addresses.length > 0
  ? email_addresses[0].email_address
  : null;

const userData = {
  email,
  name: `${first_name} ${last_name}`.trim(),
  image: image_url
};

await User.findByIdAndUpdate(id, userData, { new: true });

      if (!updatedUser) {
        console.log(`User with id ${id} not found`);
      }
      return { success: true };
    } catch (error) {
      console.error("Error updating user:", error);
      return { success: false, error: error.message };
    }
  }
);


export const functions = [syncUserCreation,syncUserDeletion,syncUserUpdation];
