output "service_account_role_name" {
  value       = module.dlt_service_account_role.iam_role_name
  description = "Name of IAM-role created for assumption by a service-account."
}

output "service_account_role_arn" {
  value       = module.dlt_service_account_role.iam_role_arn
  description = "Arn of IAM-role created for assumption by a service-account."
}

output "vault_role_name" {
  value       = vault_kubernetes_auth_backend_role.service_account_role.role_name
  description = "Name of vault role that binds to the kubernetes service account and namespace."
}

output "vault_policy_name" {
  value       = vault_policy.role_policy.name
  description = "Name of vault policy created for use by vault role."
}

output "eks_namespace" {
  value       = var.eks_namespace
  description = "Pass-through variable value for use with deployment."
}

output "db_instance_endpoint" {
  value       = module.rt_db_model.db_instance_endpoint
  description = "Endpoint for database from rt_db_model module"
}