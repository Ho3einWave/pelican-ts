export interface Schedule {
  id: number;
  name: string;
  cron: CronExpression;
  is_active: boolean;
  is_processing: boolean;
  only_when_online: boolean;
  last_run_at: string | null;
  next_run_at: string;
  created_at: string;
  updated_at: string;
  relationships?: {
    tasks?: {
      object: 'list';
      data: Array<{ object: string; attributes: ScheduleTask }>;
    };
  };
}

export interface CronExpression {
  minute: string;
  hour: string;
  day_of_month: string;
  month: string;
  day_of_week: string;
}

export interface ScheduleTask {
  id: number;
  sequence_id: number;
  action: ScheduleTaskAction;
  payload: string;
  time_offset: number;
  continue_on_failure: boolean;
}

export type ScheduleTaskAction = 'command' | 'power' | 'backup';

export interface CreateScheduleParams {
  name: string;
  minute: string;
  hour: string;
  day_of_month: string;
  month: string;
  day_of_week: string;
  is_active?: boolean;
  only_when_online?: boolean;
}

export interface UpdateScheduleParams {
  name?: string;
  minute?: string;
  hour?: string;
  day_of_month?: string;
  month?: string;
  day_of_week?: string;
  is_active?: boolean;
  only_when_online?: boolean;
}

export interface CreateScheduleTaskParams {
  action: ScheduleTaskAction;
  payload: string;
  time_offset: number;
  continue_on_failure?: boolean;
}

export interface UpdateScheduleTaskParams {
  action?: ScheduleTaskAction;
  payload?: string;
  time_offset?: number;
  continue_on_failure?: boolean;
}
