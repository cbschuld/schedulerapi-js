import Scheduler from '../src/index';
import { SCHEDULER_KEY } from "./env";
test('Initialize the Scheduler API', () => {
    const options = { key: SCHEDULER_KEY };
    const np = new Scheduler(options);
    expect(np).not.toBe(null);
});