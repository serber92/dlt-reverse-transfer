### VARIABLES ###
variable "aws_region" {
  description = "Operating region of aws-provider."
}

variable "tags" {
  type        = map(string)
  description = "Resource tags to attach to provisioned resources."
}


### PROVIDERS ###
# AWS - CAAS
variable "caas_role_arn" {
  type        = string
  description = "AWS IAM role ARN for caas AWS account."
}

provider "aws" {
  region  = var.aws_region
  profile = "default"

  assume_role {
    role_arn = var.caas_role_arn
  }
}

### BACKEND ###
terraform {
  backend "s3" {}
}
