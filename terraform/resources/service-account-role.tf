module "dlt_service_account_role" {
  source = "git::ssh://git@github.com/ASU/dco-terraform.git//modules/eks-service-account-role"

  providers = {
    aws.product = aws.reverse_transfer
    aws.eks     = aws.caas
  }

  role_name_suffix         = var.app_lifecycle
  eks_cluster_name         = "caas"
  eks_namespace            = var.eks_namespace
  eks_service_account_name = var.eks_service_account_name
  resource_tags            = var.tags
}
