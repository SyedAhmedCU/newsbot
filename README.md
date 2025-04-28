# 📰 NewsBot

**NewsBot** is a streamlined application that fetches news from RSS feeds, scrapes content, summarizes it using Gemini AI, and presents it through a simple web interface.

You can access the live version of the backend API [here](http://18.116.13.146:3000/fetch-news).

Below is a screenshot of the site:
![fetch-news demo](https://github.com/user-attachments/assets/34990fe6-d8e0-4f74-8a36-7a8beb055697)

---
## 📌 Project Purpose

- Automate the collection and summarization of the latest news headlines.
- Store both raw and summarized news in AWS S3 buckets.
- Leverage **Gemini (Google Gen AI)** for content summarization.
- Practice and demonstrate full-stack development, DevOps, and cloud integration.
---

## 🚀 Tech Stack

| Layer         | Technologies |
|---------------|--------------|
| **Backend**   | Node.js, Express |
| **Frontend**  | HTML, JavaScript |
| **AI Service**| Gemini (Gen AI) |
| **Cloud**     | AWS S3, EC2, ECR, IAM, Cloudwatch Logs |
| **DevOps**    | Docker, Terraform, GitHub Actions |

---

## Key components:
- A Node.js + Express backend service that fetches the latest news headlines from external APIs every 10 minutes.
- Stores full news data as JSON files into AWS S3.
- Triggers a summarization process using Gemini AI models, then uploads summarized news to a separate S3 bucket.
- A minimal frontend to display the summarized news. (To Do)
- Containerized with Docker and deployed to an AWS EC2 instance.
- Infrastructure provisioned using Terraform.
- CI/CD pipeline created with GitHub Actions to automate Docker build, push, and deployment.
- Integrated AWS CloudWatch for capturing application logs
---

## Future Improvements
### Feature Improvements:
- User Interface Enhancement: Develop a more interactive and polished frontend to display full and summarized articles attractively.
- Multi-Source News Aggregation: Add more news sources and support for different categories (e.g., technology, business, sports).
- Personalization: Allow users to select topics of interest and receive curated summaries.
- Notification System: Add an option for users to get daily summarized news via email.
### Technical Improvements:
- Separate Terraform and Docker Deployments: Currently, GitHub Actions deploy both code and infrastructure on every push.
  - Improvement: Split workflows into separate pipelines so that code updates trigger only application redeployment without Terraform provisioning unless infra changes.
- Better Environment Management: Environment variables are passed directly via GitHub Actions.
  - Improvement: Use AWS Systems Manager Parameter Store or AWS Secrets Manager to manage and inject environment variables securely.
- Server-Side Caching: Every news request currently hits the S3 or external API.
  - Improvement: Implement server-side caching (e.g., Redis) to cache summarized news responses, significantly reducing load times and API usage.
- Load Balancing and Scalability: Deploy behind an AWS Application Load Balancer with Auto Scaling Groups for high availability.
- Monitoring and Alerts: Add AWS CloudWatch Alarms to alert on failures, high CPU usage, or failed summarizations.

---

## ✅ Current Progress

### Backend (`/backend`)

- **Fetch news from RSS Feed**
  - Collects an array of objects containing: `title`, `description`, `link`, `pubDate`.
- **Scrape full article content**
  - For each news item, uses the `link` to scrape the full article content.
- **Summarize content using Gemini AI**
  - Replaces the full content with a concise, professional, bullet-point summary.
- **Save data to AWS S3**
  - Uploads full articles and summarized content separately.
- **Deployment**
  - Dockerized backend and deployed to AWS EC2 instance.
  - CloudWatch set up for logs.
  - Infrastructure automated using Terraform.
  - CI/CD pipeline established via GitHub Actions and ECR.

---

## 📌 Next Plans

- Build a simple frontend to:
  - Fetch summarized news JSON from S3.
  - Display news articles showing:
    - **Title**
    - **Description**
    - **Publication Date**
    - **Summary**
---

## 🛠️ To Do

- [x] Set up Node.js Express backend.
- [x] Fetch and scrape news articles.
- [x] Summarize content with Gemini API.
- [x] Upload full and summarized data to AWS S3.
- [x] Dockerize backend and deploy to EC2.
- [x] Set up CloudWatch for container logging.
- [x] Automate infrastructure deployment with Terraform.
- [x] Implement CI/CD using GitHub Actions + AWS ECR.
- [ ] Build frontend to display summarized news.
- [ ] Implement AWS Lambda microservice for emailing summaries.
- [ ] Introduce server-side caching to reduce API response times.
- [ ] Separate Terraform and Docker deployments in CI/CD pipeline.
- [ ] Improve environment variable handling for better security and flexibility.
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
- Set up environment variables: Add .env file in/backend
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
Set up the GitHub Actions workflow located in ```.github/workflows/deploy.yml```.
