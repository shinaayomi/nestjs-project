import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RolesGuard } from './guards/roles-guard';
import { EventsModule } from 'src/events/events.module';

@Module({
  imports: [
    // this will make the post repository available for injection
    // this will be available in the current scope
    TypeOrmModule.forFeature([User]),

    // passport modul
    PassportModule,

    // confifgure JWT
    JwtModule.register({}),
    EventsModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RolesGuard], // jwt strategy, roles guard -> todo
  exports: [AuthService, RolesGuard], // roles guard -> todo
})
export class AuthModule {}
