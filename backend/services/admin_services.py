from db import wallet_collection

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