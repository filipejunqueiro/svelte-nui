export interface ISendArgs<T = unknown> {
  action: string;
  mockData?: T;
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
