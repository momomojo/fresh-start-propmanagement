export const ActionStatusEnum = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCEEDED: 'succeeded',
  FAILED: 'failed'
} as const;

export type ActionStatus = typeof ActionStatusEnum[keyof typeof ActionStatusEnum];

export interface AsyncState {
  status: ActionStatus;
  error: string | null;
}