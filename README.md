# 📰 NewsBot

**NewsBot** is a streamlined application that fetches news from RSS feeds, scrapes content, summarizes it using Gemini AI, and presents it through a simple web interface.

You can access the live version of the site [here](http://18.116.13.146:3000/fetch-news).

Below is a screenshot of the site:
![fetch-news demo](https://github.com/user-attachments/assets/34990fe6-d8e0-4f74-8a36-7a8beb055697)

---

## 📌 Project Purpose

- Automate the collection and summarization of the latest news headlines.
- Store both raw and summarized news in AWS S3 buckets.
- Leverage **Gemini (Google Gen AI)** for content summarization.
- Practice and demonstrate full-stack development, DevOps, and cloud integration.

---

## ✅ Current Progress

### Backend (`/backend`)

- **Fetch news from RSS Feed**
  - Collects an array of objects containing: `title`, `description`, `link`, `pubDate`.
- **Scrape full article content**
  - For each news item, uses the `link` to scrape the full article content.
- **Summarize content using Gemini AI**
  - Replaces the full content with a concise, professional, bullet-point summary.
- **API Endpoint**
  - `GET /fetch-news` — fetches and returns the summarized news.

---

## 📌 Next Plans

- Create a simple frontend that:
  - Fetches the summarized news JSON from S3.
  - Displays the latest news articles with:
    - **Title**
    - **Description**
    - **Publication Date**
    - **Summary**

---

## 🛠️ To Do

- [x] Set up Node.js Express backend.
- [x] Integrate S3 for raw and summarized files.
- [x] Integrate AI summarizer (Gemini API) into backend.
- [x] Use Terraform for infrastructure setup.
- [x] Set up CI/CD with GitHub Actions.
- [x] Dockerize and deploy backend to EC2.
- [ ] Build simple frontend to display news.
- [ ] Implement AWS Lambda for emailing news summaries.

---

## 🧱 Project Overview

```
Workflows
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  RSS Feeds  │───▶│  Fetch News │───▶│  Scrape     │
└─────────────┘    │  Endpoint   │    │  Content    │
                   └─────────────┘    └─────────────┘
                                             │
                                             ▼
                   ┌─────────────┐    ┌─────────────┐
                   │  Gemini AI  │◀───│  Raw News   │
                   │  Summary    │    │  (S3 JSON)  │
                   └─────────────┘    └─────────────┘
                          │
                          ▼
                   ┌─────────────┐    ┌─────────────┐
                   │ Summarized  │───▶│  Frontend   │
                   │ News (S3)   │    │  Display    │
                   └─────────────┘    └─────────────┘
                          │
                          ▼
                   ┌─────────────┐
                   │  Email      │
                   │  Alerts     │
                   └─────────────┘
```

### 🚀 Tech Stack

| Layer         | Technologies |
|---------------|--------------|
| **Backend**   | Node.js, Express |
| **Frontend**  | HTML, JavaScript |
| **AI Service**| Gemini (Gen AI) |
| **Cloud**     | AWS S3, EC2 |
| **DevOps**    | Docker, Terraform, GitHub Actions |

### Backend (Node.js + Express)

- Fetch the **latest news articles** from an **RSS feed**.
- Scrape the **full article content** from each article's link.
- Summarize the content using **Gemini AI** in a **professional, bullet-point style**.
- Save the **summarized news** as a JSON file in an **S3 bucket**.
- Expose an API endpoint (`/fetch-news`) to trigger the full news fetching and summarizing flow.

### Frontend (Static HTML/CSS/JS)

- Fetch the **latest summarized news JSON** from the **S3 bucket**.
- Display each news item with:
  - **Title**
  - **Description**
  - **Publication Date**
  - **Summarized Content** (AI-generated)
  - **Link** to the original article.


### 🔄 CI/CD Pipeline (GitHub Actions) (Not Started)

The CI/CD pipeline automates:

- Cloning and setting up the backend
- Running tests
- Building and packaging Docker image
- Deploying to AWS EC2 via SSH
- Deploying infrastructure changes using Terraform
- Updates the application

---

## 📦 Setup Instructions for Local Development

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
- Set up environment variables
  - `AWS_REGION` - AWS Region Name (i.e. us-east-2)
  - `AWS_ACCESS_KEY_ID` - AWS access key
  - `AWS_SECRET_ACCESS_KEY` - AWS secret key
  - `S3_BUCKET` - S3 bucket for storing news data
  - `FULL_NEWS_DATA_PREFIX` - s3key prefix for folder path to store scraped full news data in json format
  - `SUMMARIZED_NEWS_DATA_PREFIX` - s3key prefix for folder path to store summarized news data in json format
  - `GEMINI_API_KEY` - Google Gemini AI API key
  - `GEMINI_MODEL` - Google Gemini model name
  - `PORT` - port for backend 
  - `NEWS_RSS_FEED_URL` - Comma-separated list of RSS feed URLs

- Run locally
```npm run dev```

### 3. Docker Setup (optional)
Build and run the Docker container:
```bash
docker build -t newsbot-backend .
docker run -p 3000:3000 newsbot-backend
```
### 5. Terraform Setup (optional)
Deploy the infrastructure using Terraform:
```bash
cd terraform
terraform init
terraform plan
terraform apply
```
### 6. CI/CD Setup
Set up the GitHub Actions workflow located in ```.github/workflows/ci-cd.yml```.
