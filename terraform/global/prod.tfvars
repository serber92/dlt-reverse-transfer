aws_region    = "us-west-2"
caas_role_arn = "arn:aws:iam::973536734043:role/Jenkins" # caas-prod aws account
tags = {
  ProductCategory   = "Customer Applications"
  ProductFamily     = "DLT"
  Product           = "Reverse Transfer"
  Lifecycle         = "prod"
  AdminContact      = "mbenham"
  TechContact       = "dholtz1"
  BillingCostCenter = "CC1203"
  BillingProgram    = "PG06102"
  Repo              = "https://github.com/ASU/dlt-reverse-transfer"
}
