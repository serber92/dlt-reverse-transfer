variable "aws_profile" { type = string }
variable "bucket" { type = string }
variable "code_version" { type = string }

resource "null_resource" "transport" {

  triggers = {
    code_version = "${var.code_version}"
  }

  provisioner "local-exec" {
    command = "yarn build"
  }

  provisioner "local-exec" {
    command = "aws s3 rm ${var.bucket} --recursive --profile ${var.aws_profile}"
  }

  # zip up the files before sending to remote machine
  provisioner "local-exec" {
    command = "aws s3 sync ./build/ ${var.bucket} --profile ${var.aws_profile}"
  }

  provisioner "local-exec" {
    command = "aws s3 ls ${var.bucket} --profile ${var.aws_profile}"
  }
}
