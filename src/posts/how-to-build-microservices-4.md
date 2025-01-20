---
title: Building Services Part 4 - Infrastructure
date: 12 December 2024
description: Have your code and deploy it too!
tags: [Featured, Engineering, Intrastucture as Code, Coding, Devops, Fullstack]
draft: false
---


## Part 4: Infrastructure

Provisioning infrastructure for your code can be approached in various ways. But what exactly is *infrastructure*? I define it as:

> The code and resources required for the proper functioning of your application, operating as a physically separate process.

Your application interacts with infrastructure through I/O calls—most commonly over a network—but it could also involve shared memory, inter-process communication (IPC), or other mechanisms. Importantly, data itself is not infrastructure; rather, infrastructure is responsible for storing and transferring data to and from your application code.

Infrastructure must be provisioned, configured, scaled, monitored, and periodically replaced. All of this happens independently of your application code. However, since your code relies on this infrastructure, how can you ensure that every single code commit works seamlessly with it? In this post, I’ll explore two distinct approaches to solving this challenge, highlighting their advantages and drawbacks.

### Managed Services

This is the traditional approach to handling infrastructure. Here, dedicated teams or external providers manage the infrastructure on behalf of the application. For instance, if your application requires a database, the managed service provider sets up a PostgreSQL database for you. If messaging is needed, they provision a Kafka cluster. For compute resources, they might spin up a Kubernetes cluster and grant you access to deploy containers.

In this model, application developers typically have varying levels of access to manage the underlying infrastructure. From my experience, the most effective setups are those where developers have significant control. This includes managing database migrations, creating Kafka topics, or deploying new Kubernetes pods without unnecessary gatekeeping. This approach works particularly well for simpler applications with less complex infrastructure needs.

However, there are notable downsides. The team managing the service becomes responsible for uptime but lacks control over how developers may inadvertently disrupt the infrastructure. Developers often feel little accountability for the health of the services their applications depend on—after all, someone else is tasked with maintaining them. Conversely, service providers may perform upgrades or changes without ensuring compatibility with the running application code. This disconnect can lead to failed deployments and downtime. To mitigate these risks, both developers and infrastructure teams must implement additional tests and procedures to ensure compatibility between code and infrastructure.

### Infrastructure as Code (IaC)

IaC represents a more modern approach that has gained traction in recent years. It is particularly well-suited for applications running on public cloud platforms like AWS, Azure, or Google Cloud Platform (GCP). While some companies have developed APIs to manage on-premises infrastructure in a similar way, these solutions often fall short of matching the capabilities offered by public cloud providers.

With IaC, infrastructure provisioning becomes an integral part of the application deployment process. Although the application code and infrastructure still operate as separate processes, they are developed and tested together as a unified deployment artifact. Tools like Terraform, Pulumi, AWS SAM (Serverless Application Model), AWS CloudFormation, and others enable developers to treat both code and infrastructure as a single atomic unit. This approach simplifies and standardizes provisioning when working in cloud environments.

That said, adopting IaC comes with its own challenges—primarily a steep learning curve. Developers must acquire operational expertise in addition to their coding skills. However, this shift toward DevOps-oriented teams offers significant benefits. Uptime improves because developers are directly responsible for ensuring their code functions correctly with the underlying infrastructure. Teams write better-quality code as they gain deeper insights into provisioning and configuring the services their applications rely on.

This enhanced skill set not only boosts efficiency but also reduces costs by empowering teams to make informed design decisions that align with business goals. Companies can reduce their reliance on large operations teams; instead of handling routine tasks manually, these teams can focus on platform engineering, automation, security enhancements, and scalability challenges. Development teams—being closest to the code—are also better equipped to monitor their applications and act as first responders during incidents. Ultimately, this approach allows teams to dedicate more time to solving business problems rather than grappling with technical hurdles.

### Summary

It’s important to acknowledge that both approaches described above represent idealized scenarios—there’s no one-size-fits-all solution or silver bullet here. However, adopting thoughtful policies can lead to incremental improvements over time. I encourage readers to explore the benefits of Infrastructure as Code further and determine what works best for their specific use case.

