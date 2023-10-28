import { EventType } from '../event-type.enum';
import { BaseEvent } from './base-event';

export class UserCreatedEvent extends BaseEvent<EventType.UserCreated> {
  readonly subject = EventType.UserCreated;
  data:
    | {
        id: string;
        email: string;
        name: string;
        role: string;
      }
    | undefined;
}
