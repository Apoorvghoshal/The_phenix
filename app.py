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

@app.route('/request-otp', methods=['POST'])
def request_otp():
    email = request.form.get('email')
    with open('users.json', 'r') as f:
        allowed_users = json.load(f)

    if email in allowed_users:
        otp = str(random.randint(1000, 9999))
        session['otp'] = otp
        session['email'] = email
        send_otp_email(email, otp)
        flash("OTP sent to your email!", "info")
        return render_template('verify.html')
    else:
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