variable "resource_tags" {
  type        = map(string)
  description = "Tags specified at the root module level."
}

variable "dynamo_billing_mode" {
  type        = string
  default     = "PAY_PER_REQUEST"
  description = "Adjusts read/write throughput; can have the values PROVISIONED | PAY_PER_REQUEST."
}

variable "app_lifecycle" {
  type        = string
  description = "Stage of app lifecycle for use with naming resources."
}

variable "service_account_role_name" {
  type        = string
  description = "Name of IAM role assumable by a service account."
}

variable "vpc_id" {
  type        = string
  description = "Name of VPC id that has VPC peering with CaaS"
}

