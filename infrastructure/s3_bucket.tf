# Configure the AWS provider
provider "aws" {
  region = "us-east-1"  # Replace with your preferred region
}

# Create an S3 bucket for website hosting
resource "aws_s3_bucket" "website_bucket" {
  bucket = "blockChain_taxicity_app"
  acl    = "public-read"  # Set bucket to be publicly readable

  # Enable website hosting
  website {
    index_document = "index.html"  # Set the main entry point file
    error_document = "error.html"  # Set the error page file
  }
}

# Configure the bucket policy to allow public access to all objects
resource "aws_s3_bucket_policy" "website_bucket_policy" {
  bucket = aws_s3_bucket.website_bucket.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect    = "Allow",
        Principal = "*",
        Action    = "s3:GetObject",
        Resource  = "${aws_s3_bucket.website_bucket.arn}/*"
      }
    ]
  })
}

# Optional: Output the website URL
output "s3_website_url" {
  value = aws_s3_bucket.website_bucket.website_endpoint
  description = "URL of the hosted website"
}