import asyncHandler from "../utils/asyncHandler.js";
import Account from "../models/accountDetail.model.js"
import Transaction from "../models/transcations.model.js";
import ShortUniqueId from "short-unique-id";
import mongoose from "mongoose";

const withdraw = asyncHandler(async(req,res)=>{
    try{
        const withdrawAmount = req.body.amount;
        console.log(withdrawAmount);
        const user = req.user;

        const accountDetails = await Account.findOne({
            user:user._id
        })

        // console.log(accountDetails)

        if(!accountDetails){
            return res.status(400).json({
                success:false,
                message:"Account details not found"
            })
        }

        if(accountDetails.totalBalance < parseInt(withdrawAmount)){
            return res.status(200).json({
                success:false,
                message:'Insufficient Balance'
            })
        }

        if(parseInt(withdrawAmount) <= 0 ){
            return res.status(200).json({
                success:false,
                message:'Withdrawal amount should be greate then 0'
                
            })
        }

        const uid = new ShortUniqueId({
            dictionary: 'number',
            length:10
          });

        const transactionId = uid.rnd()
        console.log(transactionId)
        const transactionDetail = await Transaction.create({
            transactionId,
            user:user._id,
            debit:parseInt(withdrawAmount),
        })

        const afterwithdraw = accountDetails.totalBalance - parseInt(withdrawAmount);
        console.log(afterwithdraw)
        let updatedBalance = await Account.updateOne(
                
            { _id: accountDetails._id },  
            {$set:{ totalBalance: afterwithdraw } }
            
        );  
        // console.log(updatedBalance)
        // updatedBalance = updatedBalance.toJson()

        return res.status(200).json({
            success:true,
            message:"Transaction completed",
            transactionDetail,
            // updatedBalance
        })
    }
    catch(error){
        console.log(error)
        return res.status(500).json({
            success:false,
            message: error
        })
    }
});

const credit = asyncHandler(async(req,res)=>{
    try{
        const creditAmount = req.body.amount;
        const user = req.user;

        const accountDetails = await Account.findOne({
            user:user
        })

        if(!accountDetails){
            return res.status(400).json({
                success:false,
                message:"Account details not found"
            })
        }


        if(parseInt(creditAmount) <= 0 ){
            return res.status(200).json({
                success:false,
                message:'Withdrawal amount should be greate then 0'
                
            })
        }

        const uid = new ShortUniqueId({
            dictionary: 'number',
            length:10
          });

        const transactionId = uid.rnd()

        const transactionDetail = await Transaction.create({
            transactionId,
            user:user._id,
            credit:parseInt(creditAmount),
        })

        const afterwithdraw = accountDetails.totalBalance + parseInt(creditAmount);
        
        let updatedBalance = await Account.updateOne({
            _id:accountDetails._id
        },{$set:{totalBalance:afterwithdraw}})

        // updatedBalance = updatedBalance.toJson()

        return res.status(200).json({
            success:true,
            message:"Transaction completed",
            transactionDetail,
            // updatedBalance
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message: error
        })
    }
});

const getUserTransaction = asyncHandler(async(req,res)=>{
    
    const user= req.user;
    let customerId = req.query.customerId
    customerId = customerId? {user:mongoose.Types.ObjectId.createFromHexString(customerId)} : {}

    if (user.role==="User"){
        const userTransaction = await Transaction.find({user:user._id}).sort({"createdat":-1}).select(" -updatedAt -__v")
        if(userTransaction.length === 0){
            return res.status(200).json({
                success:false,
                message:"No transactions found",
                userTransaction
            })
        }
        return res.status(200).json({
            success:true,
            userTransaction
        })
    }
    const userTransaction = await Transaction.find().sort({"createdat":-1}).select(" -updatedAt -__v")

    if(userTransaction.length === 0){
        return res.status(200).json({
            success:false,
            message:"No transactions found",
            userTransaction
        })
    }
        return res.status(200).json({
            success:true,
            userTransaction
        })
})


export {withdraw,credit,getUserTransaction}