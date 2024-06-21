import asyncHandler from "../utils/asyncHandler.js";
import Account from "../models/accountDetail.model.js"
import { User } from "../models/user.model.js";
import ShortUniqueId from "short-unique-id";


const createBankAccount = asyncHandler(async(req,res)=>{
    try{
        const {user,registerPhoneNumber,accountType,depositeAmount}=req.body
        let {firstName,
            lastName,
            email,
            password,
            gender,
            
            } = user

            firstName =
            firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
          lastName =
            lastName.charAt(0).toUpperCase() + lastName.slice(1).toLowerCase();
      
          const emailUser = await User.findOne({ email });
          const existedUser = await User.findOne({ phone:registerPhoneNumber });
          if (existedUser ) {
            return res.json({
              status: 409,
              error: `User with same ${phone} already exist`,
            });
          }
          if (emailUser ) {
            return res.json({
              status: 409,
              error: `User with same ${email} already exist`,
            });
          }
      
        const fullName = firstName + " " + lastName;
        
        const userDetail = await User.create({
            fullName,
            firstName,
            lastName,
            email,
            password,
            gender,
            phone:registerPhoneNumber,
            role:"User",
        })

        const uid = new ShortUniqueId({
          dictionary: 'number',
          length:10
        });

        const accountNo = uid.rnd()
        await Account.create({
          user:userDetail._id,
          accountNo,
          accountType,
          totalBalance:depositeAmount
        })

        return res.status(200).json({
          success:true,
          message:"Account created"
        })

    }catch(error){
      console.log(error)
      return res.status(500).json({
        success:false,
        message:"Internal server error"
      })
    }
})

const accountDetail = asyncHandler(async(req,res)=>{
  const user = req.user;
  const userAccountDetail = await Account.findOne({user:user._id},{accountNo:1, accountType:1, totalBalance:1 })
  return res.json({
    status:200,
    userAccountDetail

  })
})

export {createBankAccount, accountDetail}