import type { HttpClient } from '../../core/http-client.js';
import type {
  CreateScheduleParams,
  CreateScheduleTaskParams,
  Schedule,
  ScheduleTask,
  UpdateScheduleParams,
  UpdateScheduleTaskParams,
} from '../../types/client/schedule.js';

export class ScheduleManager {
  private readonly base: string;

  constructor(
    private readonly http: HttpClient,
    serverId: string,
  ) {
    this.base = `/api/client/servers/${serverId}/schedules`;
  }

  async list(): Promise<Schedule[]> {
    const result = await this.http.getList<Schedule>(this.base);
    return result.data;
  }

  async get(scheduleId: number): Promise<Schedule> {
    return this.http.get<Schedule>(`${this.base}/${scheduleId}`);
  }

  async create(params: CreateScheduleParams): Promise<Schedule> {
    return this.http.post<Schedule>(this.base, params);
  }

  async update(scheduleId: number, params: UpdateScheduleParams): Promise<void> {
    await this.http.post<void>(`${this.base}/${scheduleId}`, params);
  }

  async delete(scheduleId: number): Promise<void> {
    await this.http.delete(`${this.base}/${scheduleId}`);
  }

  async execute(scheduleId: number): Promise<void> {
    await this.http.post<void>(`${this.base}/${scheduleId}/execute`);
  }

  async createTask(scheduleId: number, params: CreateScheduleTaskParams): Promise<ScheduleTask> {
    return this.http.post<ScheduleTask>(`${this.base}/${scheduleId}/tasks`, params);
  }

  async updateTask(
    scheduleId: number,
    taskId: number,
    params: UpdateScheduleTaskParams,
  ): Promise<ScheduleTask> {
    return this.http.post<ScheduleTask>(`${this.base}/${scheduleId}/tasks/${taskId}`, params);
  }

  async deleteTask(scheduleId: number, taskId: number): Promise<void> {
    await this.http.delete(`${this.base}/${scheduleId}/tasks/${taskId}`);
  }
}
