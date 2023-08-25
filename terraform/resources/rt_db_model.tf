module "rt_db_model" {
  providers = {
    aws = aws.reverse_transfer
  }
  source                    = "./modules/rt_db_model"
  service_account_role_name = module.dlt_service_account_role.iam_role_name
  app_lifecycle             = var.app_lifecycle
  resource_tags             = var.tags
  vpc_id                    = "vpc-0719ec62bcd428ac6"
}