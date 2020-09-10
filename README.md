# Javascript / Node SDK written in Typescript for the SchedulerAPI Service

A lightweight library and rapid way to add the [www.schedulerapi.com](https://www.schedulerapi.com) service into your Javascript / Typescript / Node projects.

## Installation

The recommended way to install the SchedulerAPI SDK is through `npm` or `Yarn`.

npm:
```shell script
npm install schedulerapi-js
```

yarn:
```shell
yarn add schedulerapi-js
```

## Prerequisites

You will need an API key from the [www.schedulerapi.com](https://www.schedulerapi.com) service.  

## Additional things to think about (if using SQS)

If you want to schedule SQS events you will want to create a user in your AWS account and provide that user ONLY access to publish messages into the SQS queue.  Make sure you ONLY provide that access for that user.  An example policy might be this:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": "sqs:SendMessage",
            "Resource": "arn:aws:sqs:region:accountID:queueName"
        }
    ]
}
```

## Usage

### Scheduling an SQS Event

To schedule an event you need to call the `scheduleSqs` function with the information you want to schedule.

```javascript
const s = new Scheduler({ key: SCHEDULER_API_KEY });
const results = await s.scheduleSqs({
    when: new Date('2020-08-24 20:13:00'),
    url: YOUR_SQS_QUEUE_URL,
    body: 'THE_BODY_OF_YOUR_SQS_MESSAGE'
});
console.log(results);
```

output:
```json
{
    "id": "cLzxqmLKAEc2Tf2YzKRZW",
    "when": "2020-08-24 20:13:00",
    "now": "2020-08-24 20:11:35",
    "user": "CkM2xwzjvxjGhWeiMFWy9s"
}
```

### Scheduling a Webhook Event

To schedule an event you need to call the `scheduleWebhook` function with the information you want to schedule.

```javascript
const s = new Scheduler({ key: SCHEDULER_API_KEY });
const results = await s.scheduleWebhook({
    when: new Date('2020-08-24 20:13:00'),
    url: YOUR_URL,
    method: 'get', // or 'post' or 'GET' or 'POST'
    body: 'REQUEST_BODY' // typically used for POST
});
console.log(results);
```

output:
```json
{
    "id": "FiGGCz8BMieyuRXPVtKLFT",
    "when": "2020-08-24 20:13:00",
    "now": "2020-08-24 20:11:35",
    "user": "CkM2xwzjvxjGhWeiMFWy9s"
}
```


### Updating an SQS Event

To update a previously scheduled event you need to call the `updateSqs` function with the `id` of the event you want to change.  When you update an event you need to re-send all of the information along with the event.  If you do not have it you can obtain it from a call to `getStatus`.

```javascript
const s = new Scheduler({ key: SCHEDULER_API_KEY });
const results = await s.updateSqs({
    id: 'cLzxqmLKAEc2Tf2YzKRZW',
    when: new Date('2020-08-24 20:13:00'),
    url: YOUR_SQS_QUEUE_URL,
    body: 'THE_BODY_OF_YOUR_SQS_MESSAGE'
});
console.log(results);
```

output:
```json
{
    "id": "cLzxqmLKAEc2Tf2YzKRZW",
    "when": "2020-08-24 22:13:00",
    "now": "2020-08-24 20:11:35",
    "user": "CkM2xwzjvxjGhWeiMFWy9s"
}
```


### Updating an Webhook Event

To update a previously scheduled event you need to call the `updateWebhook` function with the `id` of the event you want to change.  When you update an event you need to re-send all of the information along with the event.  If you do not have it you can obtain it from a call to `getStatus`.

```javascript
const s = new Scheduler({ key: SCHEDULER_API_KEY });
const results = await s.updateWebhook({
    id: 'FiGGCz8BMieyuRXPVtKLFT',
    when: new Date('2020-08-24 20:13:00'),
    url: YOUR_URL,
    method: 'get', // or 'post' or 'GET' or 'POST'
    body: 'REQUEST_BODY' // typically used for POST
});
console.log(results);
```

output:
```json
{
    "id": "FiGGCz8BMieyuRXPVtKLFT",
    "when": "2020-08-24 22:13:00",
    "now": "2020-08-24 20:11:35",
    "user": "CkM2xwzjvxjGhWeiMFWy9s"
}
```


## Tests

Tests are executed via Jest.

```shell script
npm run test
```
