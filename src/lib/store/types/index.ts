// Action Types
export const ActionStatus = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCEEDED: 'succeeded',
  FAILED: 'failed'
} as const;

export type ActionStatus = typeof ActionStatus[keyof typeof ActionStatus];

export interface AsyncState {
  status: ActionStatus;
  error: string | null;
}

// Generic async thunk result type
export interface ThunkResult<T> {
  data: T;
  error?: string;
}