---
title: Securing S3 Buckets With Policy Conditions
date: 01 June 2026
description: How I learned the hard way that bucket policies need conditions.
tags: [aws, security, debugging]
draft: false
---

## Why I Care About S3 Policies

I've been using AWS for years, and S3 is probably the service I use the most. It's simple on the surface — you put stuff in buckets and take stuff out. But the permissions model is suprisingly nuanced.

Last week, one of my teammates accidentally deleted a bucket that contained our production Terraform state. It was one of those moments where your stomach drops and you start thinking about how you'll explain this to the team. Fortunately we had versioning enabled, so we recovered everything in about 20 minutes. But it got me thinking: why was anyone able to delete a bucket with prod state in the first place?

## S3 Bucket Policies vs IAM

Theres two main ways to control access to S3: IAM policies and bucket policies. IAM policies are attached to users and roles. Bucket policies are attached to the bucket itself. Both can grant or deny access.

The tricky thing is that these two systems interact. If an IAM policy grants s3:GetObject on a bucket, but the bucket policy denies it from that same principal, the explicit deny wins. This is consistent with AWS's overall authorization model.

## The Problem

Our prod Terraform state bucket had an IAM policy that granted s3:ListBucket, s3:GetObject, s3:PutObject, and s3:DeleteBucket to our CI/CD role. The intention was to allow the pipeline to read and write state files, but not delete the bucket itself.

But here's the thing: s3:DeleteBucket only needs to be allowed in the first place, and we should have never given it to the CI/CD role. The bigger issue was that our bucket policy was wide open:

```
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:*",
      "Resource": "arn:aws:s3:::prod-terraform-state/*"
    }
  ]
}
```

This is basically saying anyone can do anything with objects in that bucket. It's the S3 equivalent of leaving your front door open.

## How Bucket Policies Actually Work

Here's what I learned during my post-mortem. Bucket policies support conditions that let you restrict access based on:

- Source IP address
- VPC endpoint
- Whether the request uses HTTPS (aws:SecureTransport)
- MFA being present
- And more

The key insight is that you should use the `Principal` element carefully. If you set `Principal: "*"`, your only defense is conditions or a deny statement for specific actions. A better approach is to set the Principal to your AWS account and then add conditions for specific cross-account access.

## The Fix

Here's what I ended up with:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::123456789012:root"
      },
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::prod-terraform-state",
        "arn:aws:s3:::prod-terraform-state/*"
      ],
      "Condition": {
        "Bool": {
          "aws:SecureTransport": "true"
        }
      }
    }
  ]
}
```

This restricts access to objects in the bucket to only principals in our own account, and only over HTTPS. If someone tries to access the bucket over HTTP, they'll get a 403 AccessDeniedException.

## Lesson Learned

I also enabled MFA Delete on the bucket, which requires multi-factor authentication to delete objects or change the versioning state. This would have prevented the accidental deletion entirely, since my teammate wouldn't have had MFA handy when he ran the cleanup script.

The moral of the story is that S3 is not "secure by default." You need to think carefully about your permission model and use conditions to create defense in depth. Bucket policies with conditions are a powerful tool, but only if you actually use them.

Also, IAM policy simulation is an amazing tool that more people should know about. You can test what actions a principal has access to before you deploy changes. I wish I had used it before setting up that CI/CD role.