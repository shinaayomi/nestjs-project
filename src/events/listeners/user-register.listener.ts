import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { UserRegisteredEvent } from '../user-events.service';

// event listeners -> respond to the events emitted by eventemitter
@Injectable()
export class UserRegisteredListener {
  private readonly logger = new Logger(UserRegisteredListener.name);

  @OnEvent('user.registerd')
  handleUserRegisteredEvent(event: UserRegisteredEvent): void {
    const { user, timeStamp } = event;

    // real app -> you will mainly do action here
    // send verified email to the customers
    this.logger.log(
      `Welcome, ${user.email} Your Account created at ${timeStamp.toISOString()}`,
    );
  }
}
