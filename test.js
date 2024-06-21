

const year = 2024;  // Replace with the desired year or leave undefined to use the current year
const month = 6;   // Replace with the desired month (1 for January, 2 for February, ..., 12 for December) or leave undefined

// Use the current year if no specific year is provided
const currentYear = new Date().getFullYear();
const filterYear = year || currentYear;

let matchStage = {
    user: mongoose.Types.ObjectId.createFromHexString('665ee4b7c729dec16a04fe9d'),
    createdAt: {
        $gte: new Date(filterYear, 0, 1), // Start of the year
        $lt: new Date(filterYear + 1, 0, 1) // Start of the next year
    }
};

if (year && month) {
    matchStage.createdAt = {
        $gte: new Date(year, month - 1, 1), // Start of the specified month
        $lt: new Date(year, month, 1) // Start of the next month
    };
}

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
            totalCreditedAmount: { $sum: "$credit" }
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
            totalCreditedAmount: 1
        }
    },
    {
        $sort: { year: 1, monthNumber: 1 }  // Sort by year and month number in ascending order
    }
]);

console.log(monthlyCreditedAmounts);
