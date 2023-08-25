data "aws_vpc" "selected" {
  id = var.vpc_id
}

data "aws_subnet" "us-west-2a" {
  id = "subnet-010de8747a53419a6"
}


data "aws_subnet" "us-west-2b" {
  id = "subnet-0eacc5fe4039fadb6"
}

data "aws_subnet" "us-west-2a-pub" {
  id = "subnet-0076692d10ee426d8"
}

resource "aws_db_subnet_group" "example" {
  name = "database-subnet-group"

  subnet_ids = [
    data.aws_subnet.us-west-2a.id,
    data.aws_subnet.us-west-2b.id,
    data.aws_subnet.us-west-2a-pub.id
  ]

  tags = {
    Name = "My DB subnet group"
  }
}

data "vault_generic_secret" "database_values" {
  path = "secret/services/dco/jenkins/dlt/reverse-transfer/dev/rttln/db/userpassword"
}

resource "aws_db_instance" "example" {
  allocated_storage         = 22
  storage_type              = "gp2"
  engine                    = "postgres"
  engine_version            = "9.6.20"
  instance_class            = "db.t2.micro"
  name                      = "mydb"
  username                  = data.vault_generic_secret.database_values.data["user"]
  password                  = data.vault_generic_secret.database_values.data["password"]
  final_snapshot_identifier = "foo"
  skip_final_snapshot       = true
  publicly_accessible       = false
  db_subnet_group_name      = aws_db_subnet_group.example.name
}
