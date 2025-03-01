---
title: Building Services Part 2 - Coding
date: 30 September 2023
description: You can haz code!
tags: [coding, design, systems]
draft: false
---

Ok, you have a model and architectural diagrams showing what your application needs to do. Now you need to build it!
Here, I will focus on the structure of the code itself, and the tooling needed to enable rapid development. I won't touch
on things like containers vs binaries vs lambdas and other runtime concerns - I will talk about those later. 

## Part 2: Coding

Recall some of the fundamental questions that you need to answer (you can make up others as well):

* How is the service written? What language is used? What libraries are used?
* How are the project directories laid out?
* What tools are used to build the code?

### Language

Pick a language. If you want to learn something new, choose one that you don't already know and
learn on the go. However, I usually recommend against that. You will be far more effective using something
you already know, and that your team is already comfortable with. Learn new languages in side projects or POCs.

Pick the right language for the problem you're solving. For example, if it won't get much traffic, you wil be fine using
any dynamic language. If performance (throughput or latency) is the top concern, pick something that will scale and efficiently
uses CPU. If memory and footprint is a concern, pick something that allows fine-grained control of memory.

The point is to use the right tool for the job, and to do it in collaboration with your team and broader organization. You want to
be viewed as a team player, not the type of engineer that goes after shiny objects and pulls others along for the ride. I've chased my share
of shiny objects, and it usually ended up in major refactors or rewrites.

### Dependencies

I generally think it's a good thing to leverage code that others have written, tested, and put through the fire already. It makes your job
easier. I know engineers who loath dependencies, and will reinvent as much code as they can, si that it can be known, understood, and version controlled by their team.
There are probably situations where this is useful, for example, available dependent libraries are poorly tested, or haven't been updated recently. Usually, however,
it's safer to leverage reusable components. Is it more likely that a defect is introduced in code that you write, or in battle-tested code
that is used by hundreds or thousands of other teams in production?

### Project Setup

1. Use a template, and create your project based on the template. There are few reasons to constantly shift the
layer of source code, tests, and scripts from project to project.
1. Your project should be multi-module. That means it should be capable of building N modules as part of the same build. 
The modules can depend on each other (but not in a circular manner). Even if you only have one module,
it's nice to know that you could add more later on, or split you one module up as use cases change.

### Tooling

1. Pick a build tool. I won't go into the specifics on which language offers which tool, but it should be something well documented
and well supported by your team and organization. You don't want to spend more than 5% (arguable even less) of your time writing build code.
1. Use linters and formatters. Leverage existing tools to detect ant-patterns and formatting issues. This will keep the code style constistent
and readable for all team members. Nothing speaks of laziness more than code that isn't formatted properly!
1. Write unit tests, and measure their coverage. This should be a no-brainer, but knowing that your code works as expected, and that
the most important scenarios have been covered, will bring peace of mind. I know it takes more time to deliver, but this is something you simply
can't compromise on. Let's say you are spinning up a quick app to trial to users, and you are considering dropping the tests. If some
defect is introduced, you won't know if the product was reviewed poorly because of defects, or because it was a lousy product. Users won't care either
way - they expect things to JustWork.
1. Use code analysis tools. These can be tools that check for cyclomatic complexity, check for programming patterns than are known to cause bugs, or that
measure the performance profile of the application. Make sure it's automated. With more data points, you have more information about
how you can improve.

### Closing Thoughts

I know that these are very high level notions. I know that each of these topics
can probably encompass it's own chapter in a book, or even it's own book. The point here
is to spend at least a little time being intentional about the work you are setting out to do.
A little bit of planning can go a long ways towards scaling your teams time and energy, and also your
application.



