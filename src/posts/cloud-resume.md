---
title: My Cloud Resume Journey
date: 01 July 2024
description: An interesting full stack project
tags:
  - featured
draft: false
---

## Overview

This post describes the methodology I used to implement my [AWS cloud resume](https://cloudresumechallenge.dev/docs/the-challenge/aws/).

### Certified Solutions Architect

My work at Salesforce necessitated that I ramp up on my AWS skills. I completed the [AWS Certified Solutions Architect - Associate](https://aws.amazon.com/certification/certified-solutions-architect-associate/?ch=sec&sec=rmg&d=1) exam in 2023.

## Implementation

### HTML and CSS

I used [ChatGPT](https://chatgpt.com) to generate a sample resume. I then modified the content and layout to improve the look and feel. Here is my prompt:

```
Generate a resume written in html and css. 
The resume should have a title, description, 
a section for contact information, a section for education, 
a section for work history, and a section for 
other miscellaneous information. 
It should have a table of contents on the left.
```

Then, I went down a bit of a rabbit hole and implemented live-reload functionality for my resume. I wanted it to auto-refresh every time I edited a file. To do this I wrote a dev server that served my resume on port 8080. The dev server starts a Websocket server on port 8090. Every time it gets a request on port 8080, it appends a small javascript snippet that creates a Websocket connection to the server. When the server detects a connection, it starts watching for file changes in the `public` directory. If it sees a change, it sends a Websocket message to the client. The client reads the message and reloads the page.

### Static Website

1. I created an empty S3 bucket, and enabled it for static website publishing.
2. I uploaded my files to the S3 bucket and tested the site.
   1. It didn't work, because I needed to add a bucket policy allowing public access (I plan to turn this off later and only allow cloudfront).
   ```
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "Public Access",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::cloud-resume-drmaas/*"
        }
    ]
   ```
   Reference: https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteAccessPermissionsReqd.html


### HTTPS

I already had TLS enabled in my DNS registrar (domain.com) for www.drmaas.me. To enable TLS for resume.drmaas.me, I requested an SSL certificate in Amazon Cert Manager with the name `*.drmaas.me`. I had to ensure it was issued in `us-east-1` so that CloudFront could use it for the custom SSL cert for resume.drmaas.me.

After that, I added a CloudFront distribution that pointed to my custom domain, and my custom SSL cert. I also had to go into the behavior settings and toggle `redirect http to https`.

### DNS
I set up DNS validation for the certificate by adding a CNAME entry in the DNS registrar that matches the configs provided by ACM. AWS validates the DNS entry to validate domain ownership. I also added a CNAME record for resume.drmaas.me that points to my CloudFront distribution URL. Because AWS validated the cert, and it was associated with a custom domain name for my CloudFront distribution, everything worked once the DNS changes propagated.

### Javascript

I added a small script to the resume html page that displayed a visitor counter. Initially I set it to 0. Later on, once the api was built, I called the API on page load and updated the counter.

### Database, API, Python, Tests, Infrastructure As Code

I used `sam init` with the `hello world` template to generate a new API Gateway / Python Lambda project. Then I added a DynamoDB table to the template. Using the online docs, I wired together the Lambda with the DynamoDB table name using environment variables.

I had to install `boto3` to work with the AWS API in Python, and also pytest for testing.
```
    sudo apt-install python3-pip
    pip install boto3
    pip install pytest
```

I created a DDB update expression to initialize a single row with `id=counter`. It updates the `count` column with an increment of 1.

I had to update permissions to allow the lambda access to the counter table. Documentation was hard to find for how to do this in SAM, but after a while I found https://repost.aws/knowledge-center/lambda-sam-template-permissions.

To test, I first used the lambda console to validate that the function worked. Then I tested the API Gateway URL to verify the api worked end-end.

```shell
curl -XPOST https://*********.execute-api.us-west-2.amazonaws.com/Prod/increment -d '{}'
```

Then I wrote a unit test with `pytest` to assert that the lambda works.

Once that worked, I setup Cloudfront in front of the API Gateway. This was tricky, as I had to follow a few undocumented steps:
* When adding a Cloudfront Origin, I had to add `/Prod` as an origin path to account for the API Gateway stage name
* I had to update the API Gateway path to include `/api` as the root path, since I used the `/api/*` path when I added a routing behavior to Cloudfront

Testing confirmed it worked:
```shell
curl -XPOST https://d2p501d6pxawyj.cloudfront.net/api/increment
```

Then the custom domain automatically started working:
```shell
curl -XPOST https://resume.drmaas.me/api/increment
```

But then, the S3 origin stopped working. I am not sure what happened, so I just reconfigured the S3 origin to *not* use the S3 static site url, which allowed me to easily get a bucket policy that only allowed my CF distribution. After that, it worked again.

## Automation

### Source Control

1. https://github.com/drmaas/cloud-resume-api
1. https://github.com/drmaas/cloud-resume-ui

### CI/CD (Backend)

Setting this up was straightforward. I followed https://aws.amazon.com/blogs/compute/using-github-actions-to-deploy-serverless-applications/ and made modifications to add the `pytest` test step. This required adding a step to install dependencies using `pip install -r requirements.txt`. After adding environment secrets, everything worked.

### CI/CD (Frontend)

Setting this up was even easier. I followed the sample at https://medium.com/@olayinkasamuel44/how-to-deploy-a-static-website-to-s3-bucket-using-github-actions-ci-script-fa1acc932fbd and was up and running, after adding environment secrets.

## Challenges

Even as someone who had previous experience with AWS, I think the AWS portion was the most challenging. 
* Delegating SSL certs for my CNAME to ACM. Domain.com wanted to charge $400/year for a wildcard cert for *.drmaas.me. While AWS does have documentation, there was some trial and error involved during the cert validation process.
* Setting up Cloudfront to forward `/api` requests to the API Gateway for my app, while forwarding `/` to the S3 static site was a challenge. There were some nuanced path settings in Cloudfront and the API Gateway that took a few hours to work through.
* The SAM `Hello World` template works well for getting started, but when I needed to add additional configurations for CORS I found the documentation difficult to find. AWS really needs an easier-to-read reference for SAM templates, especially since they deviate from CloudFormation template syntax.

## Blog Post 

This is it! Enjoy, and happy learning.