import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { UserEventsService } from './user-events.service';
import { UserRegisteredListener } from './listeners/user-register.listener';

@Module({
  imports: [
    EventEmitterModule.forRoot({
      global: true,
      wildcard: false,
      maxListeners: 10,
      verboseMemoryLeak: true,
    }),
  ],
  providers: [UserRegisteredListener, UserEventsService],
  exports: [UserEventsService],
})
export class EventsModule {}
