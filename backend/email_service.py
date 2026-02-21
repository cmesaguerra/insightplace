import os
import asyncio
import logging
import resend
from dotenv import load_dotenv
from typing import List, Optional

load_dotenv()

logger = logging.getLogger(__name__)

# Initialize Resend
resend.api_key = os.environ.get("RESEND_API_KEY", "")
SENDER_EMAIL = os.environ.get("SENDER_EMAIL", "contacto@insight-place.com")

async def send_email(
    recipient_email: str,
    subject: str,
    html_content: str
) -> dict:
    """Send a single email"""
    if not resend.api_key:
        logger.warning("RESEND_API_KEY not configured, skipping email")
        return {"status": "skipped", "message": "Email service not configured"}
    
    params = {
        "from": SENDER_EMAIL,
        "to": [recipient_email],
        "subject": subject,
        "html": html_content
    }
    
    try:
        email = await asyncio.to_thread(resend.Emails.send, params)
        logger.info(f"Email sent to {recipient_email}")
        return {
            "status": "success",
            "message": f"Email enviado a {recipient_email}",
            "email_id": email.get("id")
        }
    except Exception as e:
        logger.error(f"Failed to send email to {recipient_email}: {str(e)}")
        return {"status": "error", "message": str(e)}

async def send_email_bulk(
    recipient_emails: List[str],
    subject: str,
    html_content: str
) -> List[dict]:
    """Send emails to multiple recipients"""
    results = []
    for email in recipient_emails:
        result = await send_email(email, subject, html_content)
        results.append({"email": email, **result})
    return results

def get_welcome_email_html(user_name: str, user_email: str, password: str, portal_url: str) -> str:
    """Generate welcome email HTML for new users"""
    return f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #dc2626; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0;">InsightPlace</h1>
            <p style="color: white; margin: 5px 0 0 0;">Portal de Clientes</p>
        </div>
        
        <div style="background-color: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
            <h2 style="color: #1f2937; margin-top: 0;">¡Bienvenido/a, {user_name}!</h2>
            
            <p>Se ha creado tu cuenta en el Portal de Clientes de InsightPlace. A continuación encontrarás tus credenciales de acceso:</p>
            
            <div style="background-color: white; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb; margin: 20px 0;">
                <p style="margin: 5px 0;"><strong>Correo electrónico:</strong> {user_email}</p>
                <p style="margin: 5px 0;"><strong>Contraseña:</strong> {password}</p>
            </div>
            
            <p style="color: #dc2626;"><strong>Importante:</strong> Te recomendamos cambiar tu contraseña después de iniciar sesión por primera vez.</p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="{portal_url}/login" style="background-color: #dc2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">Acceder al Portal</a>
            </div>
            
            <p style="color: #6b7280; font-size: 14px;">Si tienes alguna pregunta, no dudes en contactarnos.</p>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
            <p>© 2024 InsightPlace. Todos los derechos reservados.</p>
            <p>Este correo fue enviado desde contacto@insight-place.com</p>
        </div>
    </body>
    </html>
    """

def get_new_report_email_html(user_name: str, report_title: str, company_name: str, portal_url: str) -> str:
    """Generate new report notification email HTML"""
    return f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #dc2626; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0;">InsightPlace</h1>
            <p style="color: white; margin: 5px 0 0 0;">Portal de Clientes</p>
        </div>
        
        <div style="background-color: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
            <h2 style="color: #1f2937; margin-top: 0;">Hola, {user_name}</h2>
            
            <p>Se ha publicado un nuevo reporte para <strong>{company_name}</strong>:</p>
            
            <div style="background-color: white; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb; margin: 20px 0; border-left: 4px solid #dc2626;">
                <h3 style="color: #1f2937; margin: 0 0 10px 0;">{report_title}</h3>
                <p style="color: #6b7280; margin: 0;">Disponible en tu portal</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="{portal_url}/login" style="background-color: #dc2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">Ver Reporte</a>
            </div>
            
            <p style="color: #6b7280; font-size: 14px;">Accede al portal para consultar el reporte completo.</p>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
            <p>© 2024 InsightPlace. Todos los derechos reservados.</p>
            <p>Este correo fue enviado desde contacto@insight-place.com</p>
        </div>
    </body>
    </html>
    """
