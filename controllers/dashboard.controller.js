import mongoose from "mongoose";
import Account from "../models/accountDetail.model.js";
import Transaction from "../models/transcations.model.js";
import asyncHandler from "../utils/asyncHandler.js";

const Kpi = asyncHandler(async(req,res)=>{
    const user = req.user
    
    if(user.role === "Admin"){
        const [totalTransaction] = await Transaction.aggregate([
            {
              $lookup: {
                from: "accounts",
                localField: "user",
                foreignField: "user",
                as: "accountDetail"
              }
            },
            {
              $unwind:"$accountDetail"
            },
            
            {
                $group: {
                    _id: null,
                    totalCreditedAmount: { $sum: "$credit" },  
                    totalDebitedAmount: { $sum: "$debit" },
                    totalBalance:{$sum:"$accountDetail.totalBalance"},
                }
            },
            {
                $project: {
                    _id: 0, 
                    totalDebitedAmount: 1,
                    totalCreditedAmount: 1,
                    totalBalance:1,
                
                }
            }
              ]);
        
            const [totalBalance] = await Account.aggregate([
            
                {
                    $group: {
                        _id: null,
                        totalBalance: { $sum: "$totalBalance" }, // Correct summation for all accounts
                    }
                },
                {
                    $project: {
                        _id: 0,
                        totalDebitedAmount: 1,
                        totalCreditedAmount: 1,
                        totalBalance: 1,
                    }
                }
            ])
        return res.status(200).json({
            success:true,
            totalDebited:totalTransaction.totalDebitedAmount,
            totalCredited:totalTransaction.totalCreditedAmount,
            currentBalance:totalBalance.totalBalance,
        })
    }

    const [totalTransaction] = await Transaction.aggregate([
        {
          $lookup: {
            from: "accounts",
            localField: "user",
            foreignField: "user",
            as: "accountDetail"
          }
        },
        {
          $unwind:"$accountDetail"
        },
        {
            $match: { user: user._id } 
        },
        
        {
            $group: {
                _id: null,
                totalCreditedAmount: { $sum: "$credit" },  
                totalDebitedAmount: { $sum: "$debit" },
                totalBalance:{$first:"$accountDetail.totalBalance"},
                
            }
        },
        {
            $project: {
                _id: 0, 
                totalDebitedAmount: 1,
                totalCreditedAmount: 1,
                totalBalance:1,
                
            }
        }
          ]);
    
    
    return res.status(200).json({
        success:true,
        totalDebited:totalTransaction.totalDebitedAmount,
        totalCredited:totalTransaction.totalCreditedAmount,
        currentBalance:totalTransaction.totalBalance,
    })

    
    
})


const graph = asyncHandler(async(req,res)=>{

const year = req.query.year; 

// Use the current year if no specific year is provided
const currentYear = new Date().getFullYear();
const filterYear = year || currentYear;

let matchStage = {
    user: mongoose.Types.ObjectId.createFromHexString('665ee4b7c729dec16a04fe9d'),
    createdAt: {
        $gte: new Date(filterYear, 0, 1), 
        $lt: new Date(filterYear + 1, 0, 1)
    }   
};

const monthlyCreditedAmounts = await Transaction.aggregate([
    {
        $match: matchStage
    },
    {
        $group: {
            _id: {
                year: { $year: "$createdAt" },   
                month: { $month: "$createdAt" } 
            },
            totalCreditedAmount: { $sum: "$credit" },
            totalDebitedAmount: { $sum: "$debit" } 
        }
    },
    {
        $project: {
            _id: 0,
            year: "$_id.year",
            monthNumber: "$_id.month",
            monthName: {
                $arrayElemAt: [
                    [
                        "", "January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November", "December"
                    ],
                    "$_id.month"
                ]
            },
            totalCreditedAmount: 1,
            totalDebitedAmount:1
        }
    },
    {
        $sort: { year: 1, monthNumber: 1 }
    }
]);


return res.json({
    graph:monthlyCreditedAmounts
})

})

export {Kpi,graph}