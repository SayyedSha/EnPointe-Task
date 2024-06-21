import mongoose, { Schema} from "mongoose";

const accountSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    accountNo: {
      type: Number,
    },
    accountType: {
      type: String,
      enum: ["Saving", "Salary", "Current"],
    },
    totalBalance: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const Account = mongoose.model("account", accountSchema);

export default Account;
