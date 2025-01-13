import { Get, UseGuards } from '@nestjs/common';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { EmailVerifiedGuard } from '../auth/guards/email-verified.guard';
import { ApiVersionController } from '../common/decorators/version.decorator';

@ApiVersionController({
  path: 'users',
  tag: 'users',
})
@UseGuards(EmailVerifiedGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  async getProfile(@GetUser() user: User) {
    const fullUser = await this.usersService.findByEmail(user.email);
    return {
      status: true,
      message: 'Profile retrieved successfully',
      data: {
        id: fullUser?.id,
        email: fullUser?.email,
        name: fullUser?.name,
      },
    };
  }
}
