locals {
  # role_name = "apps-myasuplat-ads"
  role_name = "apps-reverse-transfer-dlt"
}

resource "vault_kubernetes_auth_backend_role" "service_account_role" {
  role_name                        = "${local.role_name}-${var.app_lifecycle}"
  bound_service_account_names      = [var.eks_service_account_name]
  bound_service_account_namespaces = [var.eks_namespace]
  token_policies                   = [vault_policy.role_policy.name]
  token_ttl                        = 3600
}

resource "vault_policy" "role_policy" {
  name = "${local.role_name}-${var.app_lifecycle}-policy"
  # policy = templatefile("vault-policy-read-all.hcl", { read_path = "secret/apps/reverse-transfer/dlt/${var.app_lifecycle}" })
  # policy = templatefile("vault-policy-read-all.hcl", { read_path = "secret/apps/dlt/reverse-transfer/dev" })
  policy = templatefile("vault-policy-read-all.hcl", { read_path = "secret/services/dco/jenkins/dlt/reverse-transfer" })
}