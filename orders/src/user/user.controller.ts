import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';

@Controller('user')
export class UserController {
  @EventPattern('user:created')
  userCreated(data: any) {
    console.log('User created', data); //TODO: fix this
  }
}
