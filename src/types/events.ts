export interface ISendArgs<TResponse = unknown> {
  action: string;
  mockData?: TResponse;
  autoFetch?: boolean;
}

export interface IReceiveArgs<TData = unknown> {
  action: string;
  callback: (data: TData) => void;
}

export interface IEventPayload<T = unknown> {
  action: string;
  data: T;
}
