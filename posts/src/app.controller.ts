// app.controller.ts
import {
  Controller,
  Get,
  UseGuards,
  // SetMetadata,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from './middlewares/require-auth.middleware';

@Controller()
export class AppController {
  @Get('/public-route')
  // @SetMetadata('isPublic', true)
  publicRoute() {
    return { message: 'This is a public route' };
  }

  @Get('/protected-route')
  @UseGuards(JwtAuthGuard)
  protectedRoute(@Request() req) {
    //как получить здесь юзера?
    console.log('this is protected route', req.user);
    return 'u have access';
  }
}
