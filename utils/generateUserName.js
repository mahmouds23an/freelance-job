import User from "../models/user.model.js";

const generateUsername = async (firstName, lastName) => {
  let isUnique = false;
  let username = "";
  while (!isUnique) {
    const randomNumber = Math.floor(Math.random() * 1000000);
    username = `${firstName}-${lastName}.${randomNumber}`.toLowerCase();
    const existingUser = await User.findOne({ username });
    if (!existingUser) {
      isUnique = true; 
    }
  }
  return username;
};

export default generateUsername;