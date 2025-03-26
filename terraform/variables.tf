variable "aws_region" {
  description = "AWS region to deploy the infrastructure"
  type        = string
  default     = "eu-west-1"
}

variable "ssh_public_key" {
  description = "SSH public key for EC2 instance access"
  type        = string
  # No default - must be provided by user
}
