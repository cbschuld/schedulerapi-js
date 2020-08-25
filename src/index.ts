import * as https from "https";

export interface SchedulerOptions {
    key: string;
}
export interface ScheduleRequest {
    when: Date;
    url: string;
    body: string;
}
export interface ScheduleResponse {
    id: string;
    when: string;
    now: string;
}

class Scheduler {
    private _key = "";
    constructor(options: SchedulerOptions) {
        this._key = options.key;
    }

    public async scheduleSqs({ when: scheduleDate, url, body }: ScheduleRequest): Promise<ScheduleResponse> {

        const isoDate = scheduleDate.toISOString();
        const when = `${isoDate.substr(0, 10)} ${isoDate.substr(11, 8)}`;
        const scheduleRequest = JSON.stringify({
            when,
            protocol: 'sqs',
            payload: {
                url,
                body
            }
        });

        return new Promise((resolve, reject) => {
            const req = https.request({
                hostname: 'api.schedulerapi.com',
                method: 'POST',
                path: '/schedule',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Content-Length': scheduleRequest.length,
                    'x-api-key': this._key
                },
            }, response => {
                let body = '';
                response.on('data', chunk => body += chunk);
                response.on('end', () => {
                    const result = JSON.parse(body);
                    if(400 === response.statusCode) {
                        reject(result.message);
                    }
                    resolve(result)
                });
            });
            req.on('error', error => {
                reject(error);
            });
            req.write(scheduleRequest);
        });
    };
}
export default Scheduler;