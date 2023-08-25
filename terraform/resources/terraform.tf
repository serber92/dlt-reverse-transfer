### VARS ###

variable "app_lifecycle" {
  type        = string
  default     = ""
  description = "Describes what stage of the app's lifecycle the resource should be present for. For use with resource naming convention"
}


variable "cname_hosted_zone_name" {
  type        = string
  description = "The Route53 Hosted Zone Name that will host the cname record used by CaaS platform."
}

variable "cname_hostname_records" {
  type        = list(string)
  description = "The list of hostnames associated with the cname record used by CaaS platform."
}

variable "cname_ingress_hostname" {
  type        = string
  description = "DNS domain name for use creating hostname for incoming requests to CaaS platform."
}

variable "eks_namespace" {
  type        = string
  description = "Namespace that service account is deployed to."
}

variable "eks_service_account_name" {
  type        = string
  description = "EKS Service Account Name to be made assumable for aws-role"
}

variable "tags" {
  type        = map(string)
  description = "Resource tags to attach to provisioned resources"
}

### PROVIDERS ###

variable "aws_region" {
  description = "Operating region of aws-provider"
}

# AWS - reverse-transfer
variable "reverse_transfer_role_arn" {
  type        = string
  description = "The AWS IAM Role ARN for provisioning product resources in a reverse-transfer-aws-account."
}

provider "aws" {
  alias   = "reverse_transfer"
  region  = var.aws_region
  profile = "default"

  assume_role {
    role_arn = var.reverse_transfer_role_arn
  }
}

# AWS - CAAS
variable "caas_role_arn" {
  type        = string
  description = "AWS IAM role ARN for caas account."
}

provider "aws" {
  alias   = "caas"
  region  = var.aws_region
  profile = "default"
  version = "~> 2.4"

  assume_role {
    role_arn = var.caas_role_arn
  }
}

# CAAS VAULT
variable "caas_vault_addr" {
  type        = string
  description = "CaaS Vault host url"
}

variable "caas_vault_token" {
  type        = string
  description = "CaaS Vault token"
}

provider "vault" {
  address = var.caas_vault_addr
  token   = var.caas_vault_token
}

### BACKEND ###

terraform {
  backend "s3" {}
}
