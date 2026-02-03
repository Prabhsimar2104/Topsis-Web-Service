require("dotenv").config();

const express = require("express");
const { exec } = require("child_process");
const path = require("path");
const multer = require("multer");
const nodemailer = require("nodemailer");

const upload = multer({ dest: "uploads/" });

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const app = express();

// Serve static files from public directory
app.use(express.static(path.join(__dirname, "public")));

function sendEmail(toEmail, attachmentPath) {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: toEmail,
        subject: "TOPSIS Result File",
        text: "Please find attached the TOPSIS result file.",
        attachments: [
            {
                filename: "topsis_result.csv",
                path: attachmentPath
            }
        ]
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("Email error:", error);
        } else {
            console.log("Email sent:", info.response);
        }
    });
}


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/test", (req, res) => {
    const inputFile = "Topsis-Dataset.csv";
    const outputFile = "results/output.csv";

    const command = `python3 topsis.py ${inputPath} "${weights}" "${impacts}" ${outputPath}`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error("ERROR:", error);
            console.error("STDERR:", stderr);
            return res.send("Python execution failed. Check terminal.");
        }

        console.log("STDOUT:", stdout);
        res.send("Python TOPSIS executed successfully!");
    });
});

function sendSuccessPage(res, email) {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Success - TOPSIS Analysis</title>
            <style>
                * {
                    box-sizing: border-box;
                    margin: 0;
                    padding: 0;
                }
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    padding: 20px;
                }
                .result-container {
                    background: white;
                    padding: 50px 40px;
                    max-width: 500px;
                    width: 100%;
                    border-radius: 20px;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                    text-align: center;
                    animation: slideUp 0.6s ease-out;
                }
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .success-icon {
                    width: 80px;
                    height: 80px;
                    margin: 0 auto 25px;
                    background: linear-gradient(135deg, #10b981, #059669);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    animation: scaleIn 0.5s ease-out 0.3s backwards;
                }
                @keyframes scaleIn {
                    from {
                        transform: scale(0);
                    }
                    to {
                        transform: scale(1);
                    }
                }
                .success-icon svg {
                    width: 45px;
                    height: 45px;
                    color: white;
                }
                h1 {
                    color: #2d3748;
                    font-size: 28px;
                    margin-bottom: 15px;
                    animation: fadeIn 0.6s ease-out 0.4s backwards;
                }
                .message {
                    color: #718096;
                    font-size: 16px;
                    line-height: 1.6;
                    margin-bottom: 30px;
                    animation: fadeIn 0.6s ease-out 0.5s backwards;
                }
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }
                .email-box {
                    background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
                    padding: 20px;
                    border-radius: 12px;
                    margin-bottom: 30px;
                    animation: fadeIn 0.6s ease-out 0.6s backwards;
                }
                .email-label {
                    font-size: 13px;
                    color: #718096;
                    margin-bottom: 8px;
                }
                .email-value {
                    font-size: 16px;
                    color: #667eea;
                    font-weight: 600;
                }
                .buttons {
                    display: flex;
                    gap: 15px;
                    animation: fadeIn 0.6s ease-out 0.7s backwards;
                }
                .btn {
                    flex: 1;
                    padding: 14px 24px;
                    border: none;
                    border-radius: 10px;
                    font-size: 15px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    text-decoration: none;
                    display: inline-block;
                }
                .btn-primary {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
                }
                .btn-primary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 12px 28px rgba(102, 126, 234, 0.4);
                }
                .btn-secondary {
                    background: white;
                    color: #667eea;
                    border: 2px solid #667eea;
                }
                .btn-secondary:hover {
                    background: #f7fafc;
                }
                .info-text {
                    margin-top: 25px;
                    font-size: 13px;
                    color: #a0aec0;
                    animation: fadeIn 0.6s ease-out 0.8s backwards;
                }
            </style>
        </head>
        <body>
            <div class="result-container">
                <div class="success-icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <h1>Analysis Complete!</h1>
                <p class="message">Your TOPSIS analysis has been successfully processed. The results have been sent to your email address.</p>
                
                <div class="email-box">
                    <div class="email-label">Results sent to:</div>
                    <div class="email-value">${email}</div>
                </div>
                
                <div class="buttons">
                    <a href="/" class="btn btn-primary">New Analysis</a>
                    <button onclick="window.close()" class="btn btn-secondary">Close</button>
                </div>
                
                <p class="info-text">Check your inbox and spam folder for the results</p>
            </div>
        </body>
        </html>
    `);
}

function sendErrorPage(res, errorMessage) {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Error - TOPSIS Analysis</title>
            <style>
                * {
                    box-sizing: border-box;
                    margin: 0;
                    padding: 0;
                }
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    padding: 20px;
                }
                .result-container {
                    background: white;
                    padding: 50px 40px;
                    max-width: 500px;
                    width: 100%;
                    border-radius: 20px;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                    text-align: center;
                    animation: slideUp 0.6s ease-out;
                }
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .error-icon {
                    width: 80px;
                    height: 80px;
                    margin: 0 auto 25px;
                    background: linear-gradient(135deg, #ef4444, #dc2626);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    animation: scaleIn 0.5s ease-out 0.3s backwards;
                }
                @keyframes scaleIn {
                    from {
                        transform: scale(0);
                    }
                    to {
                        transform: scale(1);
                    }
                }
                .error-icon svg {
                    width: 45px;
                    height: 45px;
                    color: white;
                }
                h1 {
                    color: #2d3748;
                    font-size: 28px;
                    margin-bottom: 15px;
                    animation: fadeIn 0.6s ease-out 0.4s backwards;
                }
                .message {
                    color: #718096;
                    font-size: 16px;
                    line-height: 1.6;
                    margin-bottom: 30px;
                    animation: fadeIn 0.6s ease-out 0.5s backwards;
                }
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }
                .error-box {
                    background: #fef2f2;
                    padding: 20px;
                    border-radius: 12px;
                    border-left: 4px solid #ef4444;
                    margin-bottom: 30px;
                    animation: fadeIn 0.6s ease-out 0.6s backwards;
                }
                .error-text {
                    font-size: 15px;
                    color: #dc2626;
                    font-weight: 500;
                }
                .buttons {
                    display: flex;
                    gap: 15px;
                    animation: fadeIn 0.6s ease-out 0.7s backwards;
                }
                .btn {
                    flex: 1;
                    padding: 14px 24px;
                    border: none;
                    border-radius: 10px;
                    font-size: 15px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    text-decoration: none;
                    display: inline-block;
                }
                .btn-primary {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
                }
                .btn-primary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 12px 28px rgba(102, 126, 234, 0.4);
                }
                .info-text {
                    margin-top: 25px;
                    font-size: 13px;
                    color: #a0aec0;
                    animation: fadeIn 0.6s ease-out 0.8s backwards;
                }
            </style>
        </head>
        <body>
            <div class="result-container">
                <div class="error-icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <h1>Oops! Something went wrong</h1>
                <p class="message">We encountered an issue while processing your TOPSIS analysis.</p>
                
                <div class="error-box">
                    <div class="error-text">${errorMessage}</div>
                </div>
                
                <div class="buttons">
                    <a href="/" class="btn btn-primary">Try Again</a>
                </div>
                
                <p class="info-text">Please check your inputs and try again</p>
            </div>
        </body>
        </html>
    `);
}

app.post("/submit", upload.single("file"), (req, res) => {
    const file = req.file;
    const weights = req.body.weights;
    const impacts = req.body.impacts;
    const email = req.body.email;

    // -------- BASIC CHECKS --------
    if (!file) {
        return sendErrorPage(res, "No file uploaded. Please select a CSV file.");
    }

    if (!emailRegex.test(email)) {
        return sendErrorPage(res, "Invalid email format. Please enter a valid email address.");
    }

    const weightArr = weights.split(",");
    const impactArr = impacts.split(",");

    if (weightArr.length !== impactArr.length) {
        return sendErrorPage(res, "Number of weights must be equal to number of impacts.");
    }

    for (let w of weightArr) {
        if (isNaN(w)) {
            return sendErrorPage(res, "Weights must be numeric and comma-separated (e.g., 1,2,3).");
        }
    }

    for (let i of impactArr) {
        if (i !== "+" && i !== "-") {
            return sendErrorPage(res, "Impacts must be either '+' or '-' (e.g., +,+,-,+).");
        }
    }

    // -------- RUN PYTHON TOPSIS --------
    const inputPath = file.path;
    const outputPath = `results/result_${Date.now()}.csv`;

    const command = `py topsis.py ${inputPath} "${weights}" "${impacts}" ${outputPath}`;

    exec(command, (error) => {
        if (error) {
            console.log("TOPSIS error:", error);
            return sendErrorPage(res, "Error while executing TOPSIS analysis. Please check your CSV file format.");
        }

        // -------- SEND EMAIL --------
        sendEmail(email, outputPath);

        sendSuccessPage(res, email);
    });
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server running at http://localhost:3000");
});