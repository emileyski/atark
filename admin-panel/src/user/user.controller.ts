import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { EventType } from 'src/core/events/event-type.enum';
import { UserCreatedEvent } from 'src/core/events/event-types/user-created.event';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @EventPattern(EventType.UserCreated)
  async userCreated(
    @Payload() data: UserCreatedEvent['data'],
    @Ctx() context: RmqContext,
  ) {
    const newUser = await this.userService.create(data);

    if (newUser) {
      this.ackMsg(context);
    }
  }

  // @EventPattern(Subjects.TicketCreated)
  // async ticketCreated(
  //   @Payload() data: TicketCreatedEvent['data'],
  //   @Ctx() context: RmqContext,
  // ) {
  //   console.log(data);
  //   this.ackMsg(context);
  // }

  private ackMsg(context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    channel.ack(originalMsg);
  }
}
