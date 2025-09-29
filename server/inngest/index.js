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
   const{ id, first_name, last_name, email_address, image_url} =event.data
   console.log("email_address", email_address)
   const userData = {
    _id : id,
    email : email_address,
    name: first_name +' '+ last_name,
    image:image_url
   }
   await User.create(userData)
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
  const{ id, first_name, last_name, email_address, image_url} =event.data
   const userData = {
    _id : id,
    email : email_address[0].email_address,
    name: first_name +' '+ last_name,
    image:image_url
   }
   await User.findByIdAndUpdate(id,userData)
  },
);


export const functions = [syncUserCreation,syncUserDeletion,syncUserUpdation];
