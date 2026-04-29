import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
    },
    leetcodeUsername: {
      type: String,
    },
    gfgUsername: {
      type: String,
    },
    codechefUsername: {
      type: String,
    },
    leetcodeUrl: {
      type: String,
      default: "",
    },
    gfgUrl: {
      type: String,
      default: "",
    },
    codechefUrl: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;
