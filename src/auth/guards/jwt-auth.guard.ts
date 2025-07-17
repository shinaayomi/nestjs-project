import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// protect routes that requires authentications -> protected route

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
