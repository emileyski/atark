import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserCreatedEvent } from 'src/core/events/event-types/user-created.event';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(user: UserCreatedEvent['data']): Promise<User> {
    const newUser = this.usersRepository.create(user);

    return await this.usersRepository.save(newUser);
  }
}
