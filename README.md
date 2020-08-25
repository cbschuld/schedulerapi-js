# Javascript / Node SDK written in Typescript for the SchedulerAPI Service

A fast way to add the [www.schedulerapi.com](https://www.schedulerapi.com) service into your Javascript / Typescript / Node projects.

## Installation

The recommended way to install the SchedulerAPI SDK is through `npm` or `Yarn`.

npm:
```shell script
npm install cbschuld/schedulerapi-js
```

yarn:
```shell
yarn add cbschuld/chedulerapi-js
```

## Usage

```javascript
const s = new SchedulerAPI({ key: SCHEDULER_API_KEY });
const results = await s.schedule(
{
	when: '2020-08-01 15:00',
        protocol: 'sqs',
        payload: {
          url: 'https://amazon.aws.com/sqs/queueNumberX',
          body: 'the body of the SQS message to schedule'
        }
}
);
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

## Tests

Tests are executed via Jest.

```shell script
npm run test
```
