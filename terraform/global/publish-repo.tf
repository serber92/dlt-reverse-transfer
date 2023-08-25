locals {
  image_repo_name = "dlt-reverse-transfer/server"
}

resource "aws_ecr_repository" "environment_repo" {
  name = local.image_repo_name
  tags = var.tags
}

resource "aws_ecr_lifecycle_policy" "repository_image_policy" {
  repository = aws_ecr_repository.environment_repo.name
  policy     = <<EOF
{
    "rules": [
        {
            "rulePriority": 1,
            "description": "Expiry rules on images tagged for use in prod",
            "selection": {
                "tagStatus": "tagged",
                "tagPrefixList": ["prod-"],
                "countType": "imageCountMoreThan",
                "countNumber": 5
            },
            "action": {
                "type": "expire"
            }
        },
        {
            "rulePriority": 2,
            "description": "Expiry rules on images tagged for use in nonprod",
            "selection": {
                "tagStatus": "tagged",
                "tagPrefixList": ["nonprod-"],
                "countType": "imageCountMoreThan",
                "countNumber": 5
            },
            "action": {
                "type": "expire"
            }
        },
        {
            "rulePriority": 3,
            "description": "Expiry rules on images tagged outside of prod and nonprod",
            "selection": {
                "tagStatus": "tagged",
                "tagPrefixList": ["ci-"],
                "countType": "imageCountMoreThan",
                "countNumber": 5
            },
            "action": {
                "type": "expire"
            }
        }
    ]
}
EOF
}

output "publishing_repo_url" {
  value       = aws_ecr_repository.environment_repo.repository_url
  description = "URL of ECR repo created for use with publishing."
}
