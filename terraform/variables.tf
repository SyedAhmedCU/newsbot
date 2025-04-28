variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "us-east-2"
}

variable "ami_id" {
  description = "AMI ID for the EC2 instance (Amazon Linux 2)"
  type        = string
  default     = "ami-060a84cbcb5c14844"
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.micro"
}

variable "key_name" {
  description = "Name of the SSH key pair to use for the EC2 instance"
  type        = string
}

variable "private_key" {
  description = "Private key for the SSH key pair"
  type        = string
}

variable "public_key" {
  description = "Public key for the SSH key pair"
  type        = string
}

variable "s3_bucket_name" {
  description = "Name of the S3 bucket to store terraform state" 
  type        = string
  default = "syed-project-bucket"
}

variable "s3key_terraform_state" {
  description = "S3key for terraform state" 
  type        = string
  default = "terraform/newsbot/terraform.tfstate"
}