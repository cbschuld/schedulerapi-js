import * as https from "https";

interface ScheduleRequest {
    when: string;
    protocol: 'webhook'|'sqs';
    payload: SqsPayload | WebhookPayload;
}

interface UpdateRequest extends ScheduleRequest {
    id: string;
}

export interface SchedulerOptions {
    key: string;
}

export interface SqsPayload {
    url: string;
    body: string;
}

export interface WebhookPayload {
    url: string;
    method: string;
    body: string;
}

export interface ScheduleRequestSqs {
    when: Date;
    url: string;
    body: string;
}

export interface UpdateRequestSqs extends ScheduleRequestSqs {
    id: string;
}

export interface ScheduleRequestWebhook {
    when: Date;
    url: string;
    method: string;
    body: string;
}

export interface UpdateRequestWebhook extends ScheduleRequestWebhook {
    id: string;
}

export interface StatusRequest {
    id: string;
}

export interface StatusResponse {
    id: string;
    when: string;
    created: string;
    modified: string;
    now: string;
    payload: { [key:string]: string|number|boolean }
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

    private async schedule(request:ScheduleRequest, update:boolean = false): Promise<ScheduleResponse> {
        
        const scheduleRequest = JSON.stringify(request);

        return new Promise((resolve, reject) => {
            const req = https.request({
                hostname: 'api.schedulerapi.com',
                method: 'POST',
                path: update ? '/update' : '/schedule',
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
    }

    private async update(request:ScheduleRequest): Promise<ScheduleResponse> {
        return this.schedule(request,true);
    }

    public async scheduleWebhook({ when: scheduleDate, url, method, body }: ScheduleRequestWebhook): Promise<ScheduleResponse> {

        const isoDate = scheduleDate.toISOString();
        const when = `${isoDate.substr(0, 10)} ${isoDate.substr(11, 8)}`;
        const request: ScheduleRequest ={
            when,
            protocol: 'webhook',
            payload: {
                url,
                method,
                body
            }
        };
        return this.schedule(request);
    };

    public async scheduleSqs({ when: scheduleDate, url, body }: ScheduleRequestSqs): Promise<ScheduleResponse> {

        const isoDate = scheduleDate.toISOString();
        const when = `${isoDate.substr(0, 10)} ${isoDate.substr(11, 8)}`;
        const request: ScheduleRequest ={
            when,
            protocol: 'sqs',
            payload: {
                url,
                body
            }
        };
        return this.schedule(request);
    };

    public async updateSqs({ id, when: scheduleDate, url, body }: UpdateRequestSqs): Promise<ScheduleResponse> {

        const isoDate = scheduleDate.toISOString();
        const when = `${isoDate.substr(0, 10)} ${isoDate.substr(11, 8)}`;
        const request: UpdateRequest ={
            id,
            when,
            protocol: 'sqs',
            payload: {
                url,
                body
            }
        };
        return this.update(request);        
    };

    public async updateWebhook({ id, when: scheduleDate, url, body }: UpdateRequestWebhook): Promise<ScheduleResponse> {

        const isoDate = scheduleDate.toISOString();
        const when = `${isoDate.substr(0, 10)} ${isoDate.substr(11, 8)}`;
        const request: UpdateRequest ={
            id,
            when,
            protocol: 'webhook',
            payload: {
                url,
                body
            }
        };
        return this.update(request);        
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