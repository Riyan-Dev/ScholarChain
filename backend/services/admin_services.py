from db import wallet_collection
from db import application_collection

class AdminService:
    @staticmethod
    async def get_total_donations():
        pipeline = [
            {"$unwind": "$transactions"},
                {"$match": {"transactions.description": "Donated to Scholarchain"}},
                {
                    "$group": {
                        "_id": None,
                        "totalAmount": {"$sum": "$transactions.amount"},
                    }
                },
                {"$project": {"_id": 0, "totalAmount": 1}},
        ]
        
        total_donations = await wallet_collection.aggregate(pipeline).to_list(length=1)
        return total_donations
    
    @staticmethod
    async def get_available_funds():
        pipeline = [
                {"$unwind": "$transactions"},
                {
                    "$group": {
                        "_id": None,
                        "donatedToScholarchainCount": {
                            "$sum": {
                                "$cond": {
                                    "if": {"$eq": ["$transactions.description", "Donated to Scholarchain"]},
                                    "then": "$transactions.amount", #sum amount instead of count
                                    "else": 0,
                                }
                            }
                        },
                        "loanDisbursementCount": {
                            "$sum": {
                                "$cond": {
                                    "if": {"$eq": ["$transactions.description", "Loan Repayment"]},
                                    "then": "$transactions.amount", 
                                    "else": 0,
                                }
                            }
                        },
                    }
                },
                {
                    "$project": {
                        "_id": 0,
                        "availableFunds": {"$subtract": ["$donatedToScholarchainCount", "$loanDisbursementCount"]},
                    }
                },
            ]
        
        available_funds = await wallet_collection.aggregate(pipeline).to_list(length=1)
        return available_funds
    
    @staticmethod
    async def get_application_counts():
        pipeline = [
            {
                "$group": {
                    "_id": "$status",
                    "count": {"$sum": 1}
                }
            },
            {
                "$project": {
                    "_id": 0,
                    "status": "$_id",
                    "count": 1
                }
            }
        ]
        
        application_counts = await application_collection.aggregate(pipeline).to_list(length=None)
        return application_counts
    
    @staticmethod
    async def get_monthly_transactions():
        pipeline = [
            {
                "$unwind": "$transactions"
            },
            {
                "$project": {
                "month": { "$month": { "$dateFromString": { "dateString": "$transactions.timestamp", "format": "%Y-%m-%d %H:%M:%S" } } },
                "transactionType": {
                    "$switch": {
                    "branches": [
                        { "case": { "$eq": ["$transactions.description", "Donated to Scholarchain"] }, "then": "donations" },
                        { "case": { "$eq": ["$transactions.description", "Loan Repayment"] }, "then": "repayments" },
                        { "case": { "$eq": ["$transactions.description", "Loan Disbursement"] }, "then": "loans" }
                    ],
                    "default": "other"
                    }
                },
                "amount": "$transactions.amount"
                }
            },
            {
                "$match": {
                "transactionType": { "$in": ["donations", "repayments", "loans"] }
                }
            },
            {
                "$group": {
                "_id": { "month": "$month", "transactionType": "$transactionType" },
                "totalAmount": { "$sum": "$amount" }
                }
            },
            {
                "$project": {
                "_id": 0,
                "month": "$_id.month",
                "transactionType": "$_id.transactionType",
                "totalAmount": 1
                }
            },
            {
                "$sort": {
                "month": 1,
                "transactionType": 1
                }
            }
        ]

        monthly_transactions = await wallet_collection.aggregate(pipeline).to_list()
        print(monthly_transactions)
        return monthly_transactions