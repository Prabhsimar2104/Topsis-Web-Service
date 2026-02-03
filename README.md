# TOPSIS Web Service

This project implements a **web-based TOPSIS (Technique for Order Preference by Similarity to Ideal Solution)** service.

Users can upload a CSV file, provide weights and impacts, and receive the TOPSIS result file directly via email.

---

## 🔧 Features

- Upload CSV input file
- Validate weights and impacts
- Validate email format
- Apply TOPSIS algorithm
- Generate result CSV
- Send result file via email
- Clean and responsive UI

---

## 🖥️ Tech Stack

- Backend: Node.js, Express
- File Upload: Multer
- Email Service: Nodemailer
- Algorithm: Python (TOPSIS)
- Frontend: HTML + CSS

---

## 📁 Project Structure

```
topsis-node-service/
├── server.js
├── topsis.py
├── public/
│   ├── index.html
│   └── style.css
├── uploads/
├── results/
└── README.md
```

---

## 🚀 How It Works

1. User uploads CSV file and inputs weights, impacts, and email
2. File is stored temporarily on the server
3. Node.js calls Python TOPSIS script
4. Output CSV is generated
5. Result is emailed to the user
6. Files are stored temporarily (ephemeral storage)

---

## 📌 Input Rules

- Number of weights = number of impacts
- Impacts must be `+` or `-`
- Weights and impacts must be comma-separated
- Email format must be valid

---

## 📬 Output

- User receives an email with attached CSV file
- Output includes:
  - Topsis Score
  - Rank

---

## ⚠️ Notes

- Uploaded and result files are stored temporarily
- On cloud deployment, storage is ephemeral
- Files are used only for processing and emailing

---

## 🎓 Academic Note

This project was developed as part of  
**UCS654 – Prescriptive Analytics**

---

## 👤 Author

**Prabhsimar Singh**  
Roll Number: 102483078