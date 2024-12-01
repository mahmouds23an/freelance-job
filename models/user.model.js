import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: {
      type: String,
      default:
        "https://w7.pngwing.com/pngs/463/441/png-transparent-avatar-human-people-profile-user-web-user-interface-icon.png",
    },
    accessToken: { type: String },
    isVerified: { type: Boolean, default: false },
    otp: { type: String },
    role: {
      type: String,
      enum: ["user", "seller", "admin"],
      default: "user",
    },
    purchasedProducts: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    ],
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    wallet: {
      balance: { type: Number, default: 0 },
      transactions: [
        {
          type: { type: String, enum: ["credit", "debit"], required: true },
          amount: { type: Number, required: true },
          date: { type: Date, default: Date.now },
          description: { type: String },
        },
      ],
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
