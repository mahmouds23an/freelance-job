import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String },
    accessToken: { type: String },
    role: {
      type: String,
      enum: ["user", "seller", "admin"],
      default: "user",
    },
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
