import mongoose, { Schema } from "mongoose";

const transactionSchema = new Schema(
  {
    transactionId: {
      type: String,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    debit: {
      type: Number,
      default:0
    },
    credit: {
      type: Number,
      default:0
    },
  },
  {
    timestamps: true,
  }
);

const Transaction = mongoose.model("transaction", transactionSchema);
export default Transaction;
