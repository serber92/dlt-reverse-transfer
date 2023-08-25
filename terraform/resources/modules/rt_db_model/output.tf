output "db_instance_endpoint" {
  value       = aws_db_instance.example.endpoint
  description = "Endpoint for database"
}