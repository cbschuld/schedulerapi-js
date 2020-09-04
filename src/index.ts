import * as https from "https";

export interface SchedulerOptions {
    key: string;
}
export interface ScheduleSqsRequest {
    when: Date;
    url: string;
    body: string;
}

export interface StatusResponse {
    id: string;
    when: string;
    created: string;
    modified: string;
    now: string;
    payload: { [key:string]: string|number|boolean }
}

export interface StatusRequest {
    id: string;
}

export interface UpdateSqsRequest extends ScheduleSqsRequest {
    id: string;
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

    public async scheduleSqs({ when: scheduleDate, url, body }: ScheduleSqsRequest): Promise<ScheduleResponse> {

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
                let responseBody = '';
                response.on('data', chunk => responseBody += chunk);
                response.on('end', () => {
                    const result = JSON.parse(responseBody);
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

    public async updateSqs({ id, when: scheduleDate, url, body }: UpdateSqsRequest): Promise<ScheduleResponse> {

        const isoDate = scheduleDate.toISOString();
        const when = `${isoDate.substr(0, 10)} ${isoDate.substr(11, 8)}`;
        const scheduleRequest = JSON.stringify({
            id,
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
                path: '/update',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Content-Length': scheduleRequest.length,
                    'x-api-key': this._key
                },
            }, response => {
                let responseBody = '';
                response.on('data', chunk => responseBody += chunk);
                response.on('end', () => {
                    const result = JSON.parse(responseBody);
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

    public async status({ id }: StatusRequest): Promise<StatusResponse> {
        return new Promise((resolve, reject) => {
            const req = https.request({
                hostname: 'api.schedulerapi.com',
                method: 'GET',
                path: '/status/' + id,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-api-key': this._key
                },
            }, response => {
                let responseBody = '';
                response.on('data', chunk => responseBody += chunk);
                response.on('end', () => {
                    const result = JSON.parse(responseBody);
                    if(400 === response.statusCode) {
                        reject(result.message);
                    }
                    resolve(result)
                });
            });
            req.on('error', error => {
                reject(error);
            });
        });
    };
}
export default Scheduler;