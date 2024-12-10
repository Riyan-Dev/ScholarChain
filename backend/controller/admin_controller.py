
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks

from services.application_services import ApplicationService
from services.risk_score_services import RiskScoreCalCulations
from services.user_services import UserService
from services.transaction_services import TransactionServices
from middleware.JWT_authentication import TokenData, get_current_user

from models.application import Application
from models.plan import Plan





admin_router = APIRouter()

@admin_router.get('/get-all-donations/')
async def get_all_application(current_user: TokenData = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=401, detail="Only admin access allowed")

    donars = await UserService.get_all_donars_username()
    print(donars)
    return await TransactionServices.get_all_donations_list(donars)

@admin_router.get('/get-all-applications/')
async def get_all_application(current_user: TokenData = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=401, detail="Only admin access allowed")

    return await ApplicationService.get_all_applications()

@admin_router.put('/update-plan/')
async def update_plan(updated_data:Plan, application_id:str, current_user: TokenData = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=401, detail="Only admin access allowed")
    return await ApplicationService.update_plan(application_id, updated_data.dict())


@admin_router.put('/verify/')
async def verify_application(application_id: str, current_user: TokenData = Depends(get_current_user)):

    if current_user.role != "admin":
        raise HTTPException(status_code=401, detail="Only admin access allowed")

    return await ApplicationService.verify_application(application_id)

@admin_router.get('/generate_plan/')
async def generate_plan(application_id: str, background_tasks: BackgroundTasks, current_user: TokenData = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=401, detail="Only admin access allowed")

    application_dict = await ApplicationService.get_application_by_id(application_id)

    application_dict["_id"] = str(application_dict["_id"])
    application = Application(**application_dict)
    background_tasks.add_task(ApplicationService.generate_personalised_plan, application.dict(), current_user)
    return {'message': 'Plan Under Generation, Poll to see the status'}


# Endpoint to be polled by the admin
@admin_router.get('/fetch-application-details')
async def application_details(application_id: str, current_user: TokenData = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=401, detail="Only admin access allowed")


    risk_assessment = await RiskScoreCalCulations.get_risk_assessment_score(application_id)
    if risk_assessment:

        total_score = await RiskScoreCalCulations.calculate_total_score(risk_assessment)

        if total_score > 70:

            plan = await ApplicationService.get_plan_db(application_id)
            if plan:
                return {"Status": "Completed", "risk_assessment": risk_assessment, "plan": plan, "total_score": total_score}
            else:

                return {"Status": "Processing"}
        else:

            return {"Status": "Completed", "risk_assessment": risk_assessment, "plan": "NA", "total_score": total_score}

    return {"Status": "Processing"}
