# 📰 NewsBot

**NewsBot** is a cloud-native full-stack application that fetches top news headlines, summarizes them using generative AI (Gemini), and displays them in a simple web UI. The project demonstrates modern DevOps practices including CI/CD, containerization, and cloud infrastructure using AWS.

---

## 📌 Project Purpose

- Automate the collection and summarization of the latest news headlines.
- Store both raw and summarized news in AWS S3 buckets.
- Leverage **Gemini (Google Gen AI)** for content summarization.
- Practice and demonstrate full-stack development, DevOps, and cloud integration.

---

## ⚙️ System Overview

### 1. 🧠 **Backend (Node.js + Express)**
- Fetches **top 10 headlines** from a third-party news API every 10 minutes.
- Detects if new news is available by comparing the current headlines with the last batch.
- Uploads new headlines to an **S3 bucket (raw data)** in JSON format.
- Uses **Gemini API** (Generative AI) to summarize the headlines.
- Uploads the **summarized news** to a **separate S3 bucket (summary data)**.

### 2. 🌐 **Frontend (Static HTML/JS)**
- Fetches the summarized news from the **summary S3 bucket**.
- Displays each article's **summary** along with a **link to the original article**.

---

## 🧱 Project Architecture

### 1. **Backend (Node.js + Express)**
- **Responsibilities**:
  - Fetch the **top 10 news headlines** from a third-party API every 10 minutes.
  - Detect if new news is available by comparing the current headlines with the last batch.
  - Upload new headlines to an **S3 bucket (raw data)** in JSON format.
  - Use **Gemini API** (Generative AI) to summarize news articles.
  - Upload the **summarized news** to a **separate S3 bucket (summary data)**.

### 2. **Frontend (Static HTML/JS)**
- **Responsibilities**:
  - Fetch the summarized news from the **summary S3 bucket**.
  - Display each article's **summary** along with a **link to the original article**.

---

### Project Directory Structure
```
newsbot/
├── backend/                # Node.js + Express server
│   ├── app.js              # Express server entry point
│   ├── services/           # Core services like news fetching, summarization, and S3 uploading
│   │   ├── newsFetcher.js  # Fetches top 10 news
│   │   ├── summarizer.js   # Summarizes news using Gemini API
│   │   ├── s3Uploader.js   # Uploads new data to S3
│   │   └── scheduler.js    # Cron job setup (every 10 minutes)
│   └── utils/              # Utility functions
│       └── compareNews.js  # Compares new headlines with last fetched headlines
├── frontend/               # Simple static UI for displaying summarized news
│   └── index.html          # Frontend UI to display summaries with links
├── terraform/              # Infrastructure as Code (Terraform configuration)
│   ├── main.tf             # EC2, IAM, S3 setup
│   ├── s3.tf               # S3 buckets configuration
│   └── variables.tf        # Variables for Terraform
├── docker/                 # Docker configuration
│   └── Dockerfile          # Dockerfile to containerize the backend
├── .github/                # GitHub Actions workflow directory
│   └── workflows/
│       └── ci-cd.yml       # CI/CD pipeline setup for GitHub Actions
├── .gitignore              # Ignored files for Git
└── README.md               # Project documentation (this file)
```


---

## 🚀 Tech Stack

| Layer         | Technologies |
|---------------|--------------|
| **Backend**   | Node.js, Express |
| **Frontend**  | HTML, JavaScript |
| **AI Service**| Gemini (Gen AI) |
| **Cloud**     | AWS S3, EC2 |
| **DevOps**    | Docker, Terraform, GitHub Actions |

---

## 🔄 CI/CD Pipeline (GitHub Actions)

The CI/CD pipeline automates:

- Cloning and setting up the backend
- Running tests (optional)
- Building and packaging Docker image
- Deploying to AWS EC2 via SSH
- Future support: Terraform apply

---

## 🖥️ Frontend Output

- Lists summarized news items.
- Each item includes:
  - ✅ AI-generated summary.
  - 🔗 Clickable link to the original article.

---

## 🛠️ To Do

- [ ] Set up Node.js backend.
- [ ] S3 integration for raw and summarized files.
- [ ] Summarizer integration in backend (Gen AI API).
- [ ] Simple frontend.
- [ ] Terraform for infrastructure.
- [ ] Dockerize and deploy on EC2.
- [ ] Complete CI/CD with GitHub Actions.

---

## 📦 Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/your-username/newsbot.git
cd newsbot
```
### 2. Backend Setup
- Install backend dependencies:
```bash
cd backend
npm install
```
Configure the Gen AI API in ```backend/services/summarizer.js.```
Set up environment variables for AWS and Gen AI API.

3. Frontend Setup
Open ```frontend/index.html``` in a browser.

4. Docker Setup (optional)
Build and run the Docker container:
```bash
docker build -t newsbot-backend .
docker run -p 3000:3000 newsbot-backend
```
5. Terraform Setup
Deploy the infrastructure using Terraform:
```bash
cd terraform
terraform init
terraform apply
```
6. CI/CD Setup
Set up the GitHub Actions workflow located in ```.github/workflows/ci-cd.yml```.
