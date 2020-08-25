import 'jest-extended';
import Scheduler from '../src/index';
import { SCHEDULER_KEY, QUEUE_URL as url } from './env';
import { addMinutes } from 'date-fns';

const testNumber: string = Math.floor((Math.random() * 100) + 1).toString();

test('Schedule: test number: ' + testNumber, () => {
  expect(testNumber).not.toBe(null);
  expect(testNumber).not.toBe(0);
});

test('Schedule: -1 min (should 400)', async () => {
  const options = { key: SCHEDULER_KEY };
  const when = addMinutes(new Date(), -1);
  await new Scheduler(options).scheduleSqs({ when, url, body: 'test body - ' + testNumber }).catch(e => {
    expect(e).toStartWith('cannot schedule anything before');
  });
});

test('Schedule: 0 min (should 400)', async () => {
  const options = { key: SCHEDULER_KEY };
  const when = new Date();
  await new Scheduler(options).scheduleSqs({ when, url, body: 'test body - ' + testNumber }).catch(e => {
    expect(e).toStartWith('cannot schedule anything before');
  });
});

test('Schedule: +5 min (should 200)', async () => {
  const options = { key: SCHEDULER_KEY };
  const when = addMinutes(new Date(), 5);
  await expect(
    new Scheduler(options).scheduleSqs({
      when, url, body: 'test body - ' + testNumber
    })).resolves.toContainAllKeys(['id', 'when', 'now', 'user']);
});
