locals {
  s3_origin_id = "dlt-reverse-transfer-webapp-origin"
  bucket_name  = "dlt-reverse-transfer-webapp-bucket"
}

resource "aws_s3_bucket" "b" {
  bucket = local.bucket_name
  acl    = "private"

  tags = {
    Name = local.bucket_name
  }
}

resource "aws_cloudfront_origin_access_identity" "origin_access_identity" {
  comment = local.bucket_name
}

data "aws_iam_policy_document" "s3_policy" {
  statement {
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.b.arn}/*"]

    principals {
      type        = "AWS"
      identifiers = [aws_cloudfront_origin_access_identity.origin_access_identity.iam_arn]
    }
  }
}

resource "aws_s3_bucket_policy" "example" {
  bucket = aws_s3_bucket.b.id
  policy = data.aws_iam_policy_document.s3_policy.json
}


resource "aws_cloudfront_distribution" "s3_distribution" {
  origin {
    domain_name = aws_s3_bucket.b.bucket_regional_domain_name
    origin_id   = local.s3_origin_id

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.origin_access_identity.cloudfront_access_identity_path
    }
  }

  aliases = ["www.trustedlearner.org"]

  enabled             = true
  is_ipv6_enabled     = true
  comment             = local.bucket_name
  default_root_object = "index.html"

  default_cache_behavior {
    allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = local.s3_origin_id

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 0 //3600
    max_ttl                = 0 //86400
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    ssl_support_method  = "sni-only"
    acm_certificate_arn = "arn:aws:acm:us-east-1:637157772794:certificate/e6f5061a-2be7-484a-b039-e0892ba1afa2"
  }
}