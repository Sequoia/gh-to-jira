# gh-to-jira

## Background

Request a review, go to Jira to move a ticket. Request changes to a PR, go to Jira to move a ticket. Approve a PR, go to Jira to move a ticket.

> *Did you remember to move the ticket??*

Argh!! Why do I have to update this status in two places? Github PRs already have our "source of truth" on PR status, the Jira board should merely *reflect* that status.


## Solution

**This repo is a proof-of-concept for moving tickets (changing ticket status) in Jira based on changes in a github pull request review status.**

### Transitions Targeted

1. Request a review on Github :point_right: Jira transition ticket to "Review requested"
1. Request revisions on Github :point_right: Jira transition ticket to "Todo"
1. Approve PR on Github :point_right: Jira transition ticket to "Approved"
1. Merge PR on Github :point_right: Jira transition ticket to "Done"

## Architecture

This project was designed to be a deployed as a microservice to Now.sh. From a high level, it works as follows:

1. User changes PR status on Github (or does any number of other actions that trigger webhooks)
2. Github sends a "webhook" request to the microservice on Now.sh (this application)
3. This application...
    1. Checks if the webhook event is one of the supported event types
    2. If yes, picks the appropriate new Jira status
    3. Sends a request to Jira to transition the ticket (identified by branch name) to the new status
4. Jira recieves the request & transitions the ticket

## Limitations

I made this proof of concept in one day so I cut some corners.

1. **Jira statuses are not universal**, which means a deployment of this service is tied to a particular Jira workflow. Because Jira you to define your own workflow with your own status, *your* "Done" status might have "id=72" wheras *my* "Done" status might have "id=13"
2. Did not set up any fancy auth for this, just created a Jira user & used normal password based auth
3. Tickets are identified by **branch name**, not by searching commit messages for ticket numbers or other more robust techniques.

## FAQ

### Didn't existing integrations already allow you to transition Jira tickets based on a PR being opened or closed?

Yes, but not based on review status changes *within* an open PR (review requested, changes requested, etc).
