# application
app_lifecycle = "sandbox-dev"

# providers
aws_region                = "us-west-2"
reverse_transfer_role_arn = "arn:aws:iam::637157772794:role/Jenkins" # asu-uto-bcdl-sandbx
caas_role_arn             = "arn:aws:iam::241368890525:role/Jenkins" # caas-sandbox

# cname tfvars
cname_hosted_zone_name = "caas-sandbox.asu.edu."
cname_hostname_records = ["lb-non-prod-nginx.caas-sandbox.asu.edu"]
cname_ingress_hostname = "dlt-reverse-transfer-dev.caas-sandbox.asu.edu"

# eks tfvars
eks_namespace            = "dlt-reverse-transfer"
eks_service_account_name = "server"

# standard tags
tags = {
  ProductCategory   = "Customer Applications"
  ProductFamily     = "DLT"
  Product           = "Reverse Transfer"
  Lifecycle         = "sandbox"
  DeployStage       = "dev"
  AdminContact      = "mbenham"
  TechContact       = "dholtz1"
  BillingCostCenter = "CC1203"
  BillingProgram    = "PG06102"
  Repo              = "https://github.com/ASU/dlt-reverse-transfer"
}
