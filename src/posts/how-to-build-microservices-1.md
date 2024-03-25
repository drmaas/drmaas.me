---
title: Building Services Part 1 - Intro and Modelling
date: 2023-08-10T20:15:00.000Z
description: I thought I could just wing it?
tags: [design, architecture, systems]
draft: false
---

I like to think about design (micro)services from a planning perspective. 
If you start with the result (a successful service running in production that everyone
knows and loves) and reverse the project timeline back to the beginning, what 
questions were answered along the way? What were the decisions taken? What were the steps 
taken that contributed to the successful rollout? 


## Part 0: Asking the Right Questions

The formulation of a solution starts not with answers, but with questions. Keep a [beginner's mindset](https://en.wikipedia.org/wiki/Shoshin), and remember
that there aren't any stupid questions. In no particular order, these are some of the questions that need to be answered, explicitly or implicitly:

* System/Domain Modeling    
    * What does the service do?
    * What are its responsibilities?
    * Who does the service talk to?
    * How does it talk to those services?
* Coding
    * How is the service written? What language is used? What libraries are used?
    * How are the project directories laid out?
    * What tools are used to build the code?
* Testing
    * Do you have tests?
    * Really, do you have tests? What kind of tests?
    * How is the code tested?
    * How is code coverage calculated?
    * How is the code formatted and linted?
    * How is the code scanned for security vulnerabilities?
* Infrastructure
    * How is infrastructure defined?
* CI/CD
    * How is the service built when features are committed? What is the build toolchain?
    * How is the service deployed?
* Runtime
    * Where does the application run? 
    * How is the application run?
    * Where are application configurations and secrets stored? How are they loaded into the application?
    * How are the infrastructure dependencies managed? 
* Scaling
    * Is your service going to be under a high load? If so:
    * How do you plan to scale your service to handle the anticipated load?
    * Have you written and executed performance tests?
    * Do you have ways to identify performance bottlenecks?
* Integration
    * Do you have the right number of pre-production environments defined? Does each have a purpose?
    * Does your service work with other services in each environment?
    * How do you know if something is broken in one of your environments? 
    * Do you run automated regression testing? If so, how?
* Monitoring
    * How is the service observed? How can engineers search logs and view metrics?
    * How are alerts triggered? What are the thresholds?
* Chores
    * How do you keep dependencies up to date?
* Resilience/High Availability
    * How are failures from dependent services handled? Are there retries, circuit breakers, fallbacks defined?
    * How are unknown application errors handled? How are known errors handled?   
    * What do you do if the server or network running your services goes down? Do you run replicas? 
* Documentation
    * How is your API defined? Does it have an API schema? A README? CLI help messages? A Wiki?

Ok, that's a lot to think about. And it doesn't even cover the people aspect of how this thing was delivered - 
the project team structure, meetings, ownership models, agile ceremonies, troubleshooting and triaging, etc. I have thoughts on that as well, 
but will leave that to a separate post!

You may have noticed that the order in which I posed these questions also tends to be the order in 
which they are tackled. If I had my way, certain things might be shifted around under special circumstances, for example,
scaling might be tackled up-front if you know your service is going to get rekt. But, in my view, this ordering tends to work
pretty well, as it provides a logical sequence of steps to follow, each building on one or more previous steps.

You may have also noticed that writing the application code is a small part of the overall effort to run a service. 
This is often true! Often, test code (unit, integration, performance, regression, smoke, etc).
Let's dive into each of the topics.

## Part 1: Domain Modeling

What the service does and what are its responsibilities are foundational questions. This is probably done by a Product Owner 
in conjunction with Architects or Principal/Staff Engineers. The responsibilities of each service need to be defined, 
and boundaries need to be drawn to make behaviors and capabilities explicit. 

### Whiteboarding

For large applications that consist of many services and user interaction patterns, it may be necessary to do some whiteboarding exercises.
If the system is smaller in scope, you can likely skip to the engineering docs.
Whiteboarding can be on real whiteboards with sticky notes, or if working with Hybrid teams, a tool like
[concept board](https://conceptboard.com/) helps all stakeholders visualize the application.
It helps define not only system-wide capabilities but also helps define user personas. User personas are then tied to specific
tasks to accomplish. These tasks map back to system capabilities. In my experience, this exercise helps to concretize components
that didn't need to be defined and also helps to get rid of unneeded or irrelevant components.

### Architecture

Once a board exists (or if it wasn't deemed necessary), the technical teams can start to model *how* to bring the application vision to life. 
The outputs of this phase are architectural diagrams, user interaction diagrams, sequence diagrams, 
and data flow diagrams. On the other hand, if the application started as a side project or it's a small venture, engineers 
may decide to just start building. Usually, everything will be built together as a monolith, with the intent to refactor 
into separate services later on as needed. Arguably, this is much easier than taking the time to plan out service 
definition boundaries. The trade-off is speed now vs tackling tech debt and complexity later on.

### Integrations

Regardless of how much whiteboarding and design you choose to do, you are going to have to define 
the external dependencies your services need to talk to perform their job(s). 
And you are going to make choices about the protocol over which communication happens. Http, GRPC, WebSockets, AMQP,
etc. are all valid choices in general, but pick the simplest possible protocol that fits your needs.

### Summary

Overall, my recommendation is to spend just enough time modeling to achieve the known objectives at the start of the project.
Models can always be adjusted as more information becomes apparent during development. Too little modeling can result in 
the team building the wrong product, or one that doesn't fit the functional requirements. It also risks creating 
a giant ball of mud that needs to be rewritten before it's launched. Too much modeling can risk
doing two things - overengineering the solution, and slowing down the delivery.

### Next Up

In the next part, I'll be giving a brief overview of the coding implementation tasks the team will need to perform.

