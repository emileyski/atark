export abstract class BaseEvent<T> {
  abstract readonly subject: T;
  abstract data: any;
}
