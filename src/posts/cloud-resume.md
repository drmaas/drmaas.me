---
title: Building the AWS Cloud Resume - A Full-Stack Demonstration Project
date: 01 July 2024
description: End-to-end AWS architecture combining frontend, backend, and infrastructure
tags:
  - Featured
  - Python
  - JavaScript
  - AWS
  - Html
  - CSS
draft: false
---

## Overview

This post documents my implementation of the [AWS Cloud Resume Challenge](https://cloudresumechallenge.dev/docs/the-challenge/aws/), a comprehensive full-stack project that demonstrates practical cloud engineering skills across multiple AWS services and technology domains.

## Context: Why This Project Matters

At Salesforce, my work required substantial AWS knowledge. To formalize this expertise, I pursued and completed the [AWS Certified Solutions Architect - Associate](https://aws.amazon.com/certification/certified-solutions-architect-associate/?ch=sec&sec=rmg&d=1) certification in 2023. The Cloud Resume Challenge provided an ideal vehicle to apply and validate this knowledge across a complete architecture, combining frontend deployment, serverless compute, databases, CDN, and infrastructure-as-code principles.

## Implementation

## Frontend Implementation

### Static HTML and CSS

I began by researching well-designed resume templates built with HTML and CSS, then adapted them to match my personal aesthetic and information architecture. This process naturally led me down a rabbit hole: implementing live-reload functionality for development.

To achieve live-reload, I built a custom dev server running on port 8080 with a companion WebSocket server on port 8090. When the server receives an HTTP request, it injects a small JavaScript snippet that establishes a WebSocket connection. The server continuously watches the `public` directory for changes. On detection, it sends a WebSocket message to connected clients, triggering automatic page reload. This reduced development iteration time significantly.

## Backend Architecture

### Static Website Hosting with S3

I deployed the frontend to S3 by creating an empty bucket, enabling static website publishing, and uploading my files. Initial testing failed because the bucket required an explicit public access policy. [AWS documentation clarifies the required bucket policy configuration](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteAccessPermissionsReqd.html). Later, I disabled public S3 access entirely, routing all traffic through CloudFront instead.


### HTTPS and CDN Distribution

I already had TLS enabled via my domain registrar (domain.com) for www.drmaas.me. To extend HTTPS support to resume.drmaas.me, I requested a wildcard SSL certificate (`*.drmaas.me`) from AWS Certificate Manager. Importantly, certificates used by CloudFront must be provisioned in `us-east-1`, a requirement I initially overlooked.

I created a CloudFront distribution with the custom domain and SSL certificate, then configured HTTP-to-HTTPS redirection in the distribution behavior settings.

### DNS Configuration and Certificate Validation

For certificate validation, I created a CNAME record in my DNS registrar that matched ACM's validation requirements. AWS validates domain ownership through this DNS entry. Once validated, I added another CNAME record pointing resume.drmaas.me to the CloudFront distribution URL. Upon DNS propagation, the complete HTTPS chain functioned seamlessly.

### Javascript

I added a small script to the resume html page that displayed a visitor counter. Initially I set it to 0. Later on, once the api was built, I called the API on page load and updated the counter.

## Serverless Backend

### Backend Infrastructure with SAM and CloudFormation

Using AWS Serverless Application Model (SAM), I scaffolded a new project with the `hello world` template, which provided API Gateway and Lambda boilerplate. I then added a DynamoDB table for persistent storage. Environment variables connected the Lambda function to the DynamoDB table name.

The Lambda needed to increment a visitor counter, so I implemented a DynamoDB update expression that creates a row with `id=counter` if it doesn't exist and increments the `count` attribute by 1. I installed `boto3` for AWS SDK access and `pytest` for testing.

### Lambda Permissions and Testing

A critical step was granting the Lambda function proper IAM permissions to access the DynamoDB table. AWS documentation on SAM template permissions wasn't immediately obvious; I found the solution at [AWS Repost Knowledge Center](https://repost.aws/knowledge-center/lambda-sam-template-permissions).

I validated functionality through multiple testing approaches:
1. Lambda console testing confirmed the function executed correctly
2. Direct API Gateway URL testing verified end-to-end functionality
```bash
curl -XPOST https://[api-id].execute-api.us-west-2.amazonaws.com/Prod/increment
```
3. PyTest unit tests provided automated verification

All tests passed, confirming the backend worked correctly in isolation.

### CloudFront for API Distribution

To add caching and reduce API latency, I deployed CloudFront in front of the API Gateway. This required careful configuration:

- **Origin path**: Set to `/Prod` to account for API Gateway's stage naming
- **API Gateway routing**: Updated to use `/api` as the root path, matching CloudFront routing behaviors

Testing confirmed the full stack worked:
```bash
curl -XPOST https://d2p501d6pxawyj.cloudfront.net/api/increment
curl -XPOST https://resume.drmaas.me/api/increment
```

However, this introduced an unexpected problem: the S3 origin stopped serving static content. I resolved this by reconfiguring the S3 origin to use the regular S3 bucket URL (instead of the static website URL), which allowed me to apply a restrictive bucket policy that only permitted my CloudFront distribution.

## CI/CD Pipeline

### Source Control and Backend Automation

I implemented GitHub Actions for both backend and frontend deployments, following AWS best practices. For the backend, I adapted [AWS's guide on deploying serverless applications with GitHub Actions](https://aws.amazon.com/blogs/compute/using-github-actions-to-deploy-serverless-applications/), adding a pytest test step that installs dependencies via `pip install -r requirements.txt`. Environment-specific secrets were stored securely in GitHub.

### Frontend Automation

Frontend automation was more straightforward. Following [established patterns for S3 deployment via GitHub Actions](https://medium.com/@olayinkasamuel44/how-to-deploy-a-static-website-to-s3-bucket-using-github-actions-ci-script-fa1acc932fbd), I created a simple workflow that uploads files to S3 on each commit. GitHub Secrets handled AWS credentials securely.

## Key Challenges and Lessons

Despite AWS certification, several challenges emerged that required problem-solving:

### SSL Certificate Management
Domain.com charged $400/year for a wildcard certificate, while AWS Certificate Manager provided them for free. However, deploying ACM certificates with CloudFront required understanding DNS validation workflows and regional requirements (us-east-1 for CloudFront). Trial and error was necessary here.

### CloudFront Path Complexities
Configuring CloudFront to route `/api` requests to API Gateway while serving `/` from S3 required careful attention to origin paths, routing behaviors, and root paths. The interaction between CloudFront and API Gateway staging isn't intuitive from documentation alone.

### AWS SAM Documentation Gaps
While the SAM hello-world template provides a good starting point, adding CORS configuration required hunting through multiple documentation sources. AWS would benefit from more comprehensive SAM template examples, particularly since SAM's YAML differs subtly from CloudFormation templates.

## Conclusion

The Cloud Resume Challenge provided practical, end-to-end experience across core AWS services: compute (Lambda), storage (S3, DynamoDB), networking (CloudFront, API Gateway), certificates (ACM), and infrastructure automation (SAM, CloudFormation). The project reinforces that cloud architecture, while powerful, rewards careful attention to configuration details and the often-undocumented interactions between services. This hands-on experience proved invaluable for my subsequent AWS work at Salesforce.