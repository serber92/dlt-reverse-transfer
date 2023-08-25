## Providers

| Name | Version |
|------|---------|
| aws | n/a |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:-----:|
| aws\_region | Operating region of aws-provider. | `any` | n/a | yes |
| caas\_role\_arn | AWS IAM role ARN for caas AWS account. | `string` | n/a | yes |
| tags | Resource tags to attach to provisioned resources. | `map(string)` | n/a | yes |

## Outputs

| Name | Description |
|------|-------------|
| publishing\_repo\_url | URL of ECR repo created for use with publishing. |
