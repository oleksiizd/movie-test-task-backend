import { Controller, Post, UseGuards, Req, Body, Get, HttpStatus, HttpCode } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { Authorized } from './decorators';
import { RefreshTokenDto, SignInDto, SignUpDto } from './dto';
import { LocalAuthGuard } from './guards';
import { IRequestWithUser } from './interfaces';
import { JoiValidationPipe } from 'src/pipes';
import { signUpSchema } from './validations';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  // _signInDto parameter is declared here to allow Swagger plugin
  // parse endpoint body signature
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async signIn(@Req() req: IRequestWithUser, @Body() _signInDto: SignInDto) {
    return this.authService.signIn(req.user);
  }

  @HttpCode(HttpStatus.OK)
  @Post('sign-up')
  async signUp(@Body(new JoiValidationPipe(signUpSchema)) signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @ApiOperation({
    description: 'Generates new auth token pair using valid refresh token',
  })
  @Post('refresh')
  async refreshAccessToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshAccessToken(refreshTokenDto.refreshToken);
  }

  @Authorized()
  @Get('profile')
  getProfile(@Req() req: IRequestWithUser) {
    return req.user;
  }
}
