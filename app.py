import json
import random
import smtplib
from email.message import EmailMessage
from flask import Flask, render_template, request, session, redirect, url_for, flash

app = Flask(__name__)
app.secret_key = "secret_key_for_session"

# Credentials
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
SENDER = "apoorvghoshal03@gmail.com"
APP_PASSWORD = "dxqd ctfa gocr ydgz"

def send_otp_email(receiver_email, otp):
    msg = EmailMessage()
    msg['Subject'] = "Your Login OTP"
    msg['From'] = SENDER
    msg['To'] = receiver_email
    msg.set_content(f"Your 4-digit login OTP is: {otp}")
    with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as smtp:
        smtp.starttls()
        smtp.login(SENDER, APP_PASSWORD)
        smtp.send_message(msg)

# --- Public Routes ---

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')

# --- Directory & Auth Logic ---

@app.route('/directory')
def directory():
    # If already logged in, show the dashboard
    if session.get('logged_in'):
        return render_template('dashboard.html', email=session.get('email'))
    # If not logged in, show the login page
    return render_template('login.html')

import requests  # Ensure requests is imported

# --- CONFIGURATION (Match these with your JS) ---
API_KEY = 'AIzaSyBO9c1WNNC7U1fnbUr2QaAe-WeuQ282Yuo'
SPREADSHEET_ID = '1FJnnBG6umRmJ3O1aYs4PKyb4PdBzhLRCyLElw7SKRzA'
AUTH_RANGE = 'A1:E500'  # We fetch up to Column E


def get_authorized_emails():
    """Fetches Column E from Google Sheets dynamically"""
    url = f"https://sheets.googleapis.com/v4/spreadsheets/{SPREADSHEET_ID}/values/{AUTH_RANGE}?key={API_KEY}"
    try:
        response = requests.get(url, timeout=5)
        data = response.json()
        if 'values' in data:
            # We look at the 5th element (index 4) of every row
            # .strip().lower() handles accidental spaces or capital letters in Excel
            emails = [row[4].strip().lower() for row in data['values'] if len(row) > 4]
            return emails
        return []
    except Exception as e:
        print(f"Auth Fetch Error: {e}")
        return []


@app.route('/request-otp', methods=['POST'])
def request_otp():
    email = request.form.get('email').strip().lower()

    # Fetch live emails from Google Sheets instead of JSON file
    allowed_users = get_authorized_emails()

    if email in allowed_users:
        otp = str(random.randint(1000, 9999))
        session['otp'] = otp
        session['email'] = email
        send_otp_email(email, otp)
        flash("OTP sent to your email!", "info")
        return render_template('verify.html')
    else:
        # Debugging tip: print(f"Denied: {email}. Allowed: {allowed_users}")
        flash("Email not authorized for directory access!", "danger")
        return redirect(url_for('directory'))
@app.route('/verify', methods=['POST'])
def verify():
    user_otp = request.form.get('otp')
    if user_otp == session.get('otp'):
        session['logged_in'] = True
        session.pop('otp', None)
        return redirect(url_for('directory'))
    else:
        flash("Invalid OTP. Try again.", "danger")
        return render_template('verify.html')

@app.route('/logout')
def logout():
    session.clear()
    flash("You have been logged out.", "info")
    return redirect(url_for('home'))

if __name__ == '__main__':
    # Inside Docker, the host must be 0.0.0.0

    app.run(host='0.0.0.0', port=5000)
