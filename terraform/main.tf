terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket         = var.s3_bucket_name
    key            = var.s3key_prefix_terraform_state
    region         = var.aws_region
    encrypt        = true
  }
}

provider "aws" {
  region = var.aws_region
}

# VPC for the application
resource "aws_vpc" "newsbot_backend_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "newsbot-backend-vpc"
  }
}

# Public subnet
resource "aws_subnet" "public_subnet" {
  vpc_id                  = aws_vpc.newsbot_backend_vpc.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "${var.aws_region}a"
  map_public_ip_on_launch = true

  tags = {
    Name = "newsbot_backend-public-subnet"
  }
}

# Internet Gateway
resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.newsbot_backend_vpc.id

  tags = {
    Name = "newsbot_backend-igw"
  }
}

# Route table
resource "aws_route_table" "public_rt" {
  vpc_id = aws_vpc.newsbot_backend_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }

  tags = {
    Name = "newsbot_backend-public-rt"
  }
}

# Route table association
resource "aws_route_table_association" "public_rta" {
  subnet_id      = aws_subnet.public_subnet.id
  route_table_id = aws_route_table.public_rt.id
}

# Security group for the EC2 instance
resource "aws_security_group" "app_sg" {
  name        = "newsbot-backend-sg"
  description = "Security group for newsbot backend application"
  vpc_id      = aws_vpc.newsbot_backend_vpc.id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "SSH access"
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "HTTP access"
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "HTTPS access"
  }

  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Application port"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow all outbound traffic"
  }

  tags = {
    Name = "newsbot-backend-sg"
  }
}

# IAM role for EC2 to access S3
resource "aws_iam_role" "ec2_s3_access_role" {
  name = "newsbot_backend-ec2-s3-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })
}

# IAM policy for S3 access
resource "aws_iam_policy" "s3_access_policy" {
  name        = "newsbot_backend-s3-policy"
  description = "Policy to allow EC2 to access S3 bucket"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:ListBucket",
          "s3:DeleteObject"
        ]
        Effect = "Allow"
        Resource = [
          "arn:aws:s3:::${var.s3_bucket_name}",
          "arn:aws:s3:::${var.s3_bucket_name}/*"
        ]
      }
    ]
  })
}

# Attach policy to role
resource "aws_iam_role_policy_attachment" "s3_policy_attachment" {
  role       = aws_iam_role.ec2_s3_access_role.name
  policy_arn = aws_iam_policy.s3_access_policy.arn
}

# Instance profile
resource "aws_iam_instance_profile" "ec2_profile" {
  name = "newsbot-backend-ec2-profile"
  role = aws_iam_role.ec2_s3_access_role.name
}

# EC2 instance
resource "aws_instance" "app_server" {
  ami                    = var.ami_id
  instance_type          = var.instance_type
  key_name               = aws_key_pair.deployer.key_name
  vpc_security_group_ids = [aws_security_group.app_sg.id]
  subnet_id              = aws_subnet.public_subnet.id
  iam_instance_profile   = aws_iam_instance_profile.ec2_profile.name

  user_data = <<-EOF
              #!/bin/bash
              sudo yum update -y
              sudo amazon-linux-extras install docker -y
              sudo service docker start
              sudo systemctl enable docker
              sudo usermod -a -G docker ec2-user
              sudo curl -L "https://github.com/docker/compose/releases/download/v2.24.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
              sudo chmod +x /usr/local/bin/docker-compose
              sudo amazon-linux-extras install -y epel
              sudo yum install -y git
              EOF

  tags = {
    Name = "newsbot-backend-server"
  }

  volume_tags = {
    Name = "newsbot-backend-volume"
  }

  root_block_device {
    volume_size = 20
    volume_type = "gp3"
  }
}

resource "aws_key_pair" "deployer" {
  key_name = var.key_name
  public_key = var.public_key
}

# Reference the existing S3 bucket
data "aws_s3_bucket" "existing_bucket" {
  bucket = var.s3_bucket_name
}

# Output the public IP of the EC2 instance
output "instance_public_ip" {
  value       = aws_instance.app_server.public_ip
  sensitive = true
  description = "Public IP address of the EC2 instance"
}

# Output the S3 bucket name
output "s3_bucket" {
  value       = var.s3_bucket_name
  description = "Name of the S3 bucket"
}