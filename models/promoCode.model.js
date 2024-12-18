import mongoose from "mongoose";

const promoCodeSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discount: { type: Number, required: true },
  endDate: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const PromoCode = mongoose.model("PromoCode", promoCodeSchema);
export default PromoCode;
