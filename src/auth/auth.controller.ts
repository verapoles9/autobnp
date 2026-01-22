import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Регистрация пользователя' })
  @ApiResponse({ status: 201, description: 'Пользователь создан' })
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);  // ✅ 1 аргумент — DTO
  }

  @Post('login')
  @ApiOperation({ summary: 'Вход в систему' })
  @ApiResponse({ status: 200, description: 'JWT токен' })
  @ApiResponse({ status: 401, description: 'Неверные данные' })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);  // ✅ 1 аргумент — DTO
  }
}
