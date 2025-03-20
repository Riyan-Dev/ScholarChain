from datetime import datetime
from pathlib import Path


from jinja2 import Environment, FileSystemLoader
from aiosmtplib import SMTP

from config.config import Config

# Define a model for the email content
from models.email import EmailSchema

# Initialize Jinja2 environment
templates_dir = Path(__file__).parent / "templates"  # Create a 'templates' directory
env = Environment(loader=FileSystemLoader(templates_dir))




class EmailService: 

    @staticmethod
    async def send_disbursement_email(loan):
        """Sends an email confirming loan disbursement."""
        current_year = datetime.now().year

        email_data = EmailSchema(
            to=["i210428@nu.edu.pk"],
            subject="Loan Disbursement Confirmation - ScholarChain",
            template_name="disbursement.html",  # Create this template
            context={
                "loan": loan,
                "current_year": current_year,
            },
        )
        await send_email(email_data)


    @staticmethod
    async def send_repayment_email(username, loan, recieved, next):
        from services.user_services import UserService

        user = await UserService.get_user_doc_by_username(username)
        current_year = datetime.now().year

        email_data = EmailSchema(
            to=["i210428@nu.edu.pk"],
            subject="Repayment Confirmation - ScholarChain",
            template_name="repayment.html", # Save as this filename
            context={
                "user": user,
                "loan": loan, # Or just pass the Loan object
                "installment": recieved, # Or just pass the Installment object
                "next_installment": next if next else None, # Pass the next pending installment
                "current_year": current_year,
            },
        )
        await send_email(email_data)


    @staticmethod 
    async def send_verified_email(application_id):
        from services.application_services import ApplicationService
        from services.user_services import UserService

        plan = await ApplicationService.get_plan_db(application_id)
        application = await ApplicationService.get_application_by_id(application_id)
        user = await UserService.get_user_doc_by_username(application["username"])
        dashboard_link = "http://localhost:3000/dashboard"
        current_year = 2025
        email_data = EmailSchema(
            to=["i210428@nu.edu.pk"],
            subject="Your Loan Application Has Been Verified!",
            template_name="application_verified.html", # Rename your template file
            context={
                "user": user,
                "plan": plan, # Or just loan_plan_data if you prefer
                "dashboard_url": dashboard_link,
                "current_year": current_year,
            },
        )
        await send_email(email_data)

    @staticmethod 
    async def send_rejection_email(application_id):
        from services.application_services import ApplicationService
        from services.user_services import UserService
        
        plan = await ApplicationService.get_plan_db(application_id)
        application = await ApplicationService.get_application_by_id(application_id)
        user = await UserService.get_user_doc_by_username(application["username"])

        current_year = 2025

        email_data = EmailSchema(
            to=["i210428@nu.edu.pk"],
            subject="Update on Your ScholarChain Loan Application",
            template_name="application_rejected.html", # Save this as a new HTML file
            context={
                "user": user,
                # "reason": plan["reasoning"], # Optional: Provide the reason
                "current_year": current_year,
            },
        )
        await send_email(email_data)

async def send_email(email: EmailSchema):
    template = env.get_template(email.template_name)
    html_content = template.render(email.context)

    from email.message import EmailMessage

    message = EmailMessage()
    message["From"] = Config.smtp_from_email
    message["To"] = ", ".join(email.to)
    message["Subject"] = email.subject
    message.set_content(html_content, subtype="html")

    try:
        async with SMTP(hostname=Config.smtp_host, port=Config.smtp_port) as smtp:
           
            await smtp.login(Config.smtp_username, Config.smtp_password)
            await smtp.send_message(message)
            await smtp.quit()
    except Exception as e:
        print(f"Error sending email to {email.to}: {e}")


