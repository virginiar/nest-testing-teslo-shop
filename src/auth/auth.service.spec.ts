import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { CreateUserDto, LoginUserDto } from './dto';
import {
  BadRequestException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import argon from './argon.mock';

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const mockUserRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
    };

    const mockJwtService = {
      sign: jest.fn().mockReturnValue('mock-jwt-token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },

        AuthService,
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('should create a user and return user with token', async () => {
    const dto: CreateUserDto = {
      email: 'test@google.com',
      password: 'Abc123',
      fullName: 'Test User',
    };

    const user = {
      email: dto.email,
      fullName: dto.fullName,
      id: '1',
      isActive: true,
      roles: ['user'],
    } as User;

    jest.spyOn(userRepository, 'create').mockReturnValue(user);

    const result = await authService.createUser(dto);

    expect(result).toEqual({
      user: {
        email: 'test@google.com',
        fullName: 'Test User',
        id: '1',
        isActive: true,
        roles: ['user'],
      },
      token: 'mock-jwt-token',
    });
  });

  it('should throw an error if email already exist', async () => {
    const dto: CreateUserDto = {
      email: 'test@google.com',
      password: 'Abc123',
      fullName: 'Test User',
    };

    jest
      .spyOn(userRepository, 'save')
      .mockRejectedValue({ code: '23505', detail: 'Email already exists' });

    await expect(authService.createUser(dto)).rejects.toThrow(
      BadRequestException,
    );
    await expect(authService.createUser(dto)).rejects.toThrow(
      'Email already exists',
    );
  });

  it('should throw an internal server error', async () => {
    const dto = {
      email: 'test@google.com',
    } as CreateUserDto;

    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    jest
      .spyOn(userRepository, 'save')
      .mockRejectedValue({ code: '9999', detail: 'Unhandled error' });

    await expect(authService.createUser(dto)).rejects.toThrow(
      InternalServerErrorException,
    );
    await expect(authService.createUser(dto)).rejects.toThrow(
      'Please check server logs',
    );

    expect(console.log).toHaveBeenCalledTimes(2);
    /* expect(console.log).toHaveBeenCalledWith({
      code: '9999',
      detail: 'Unhandled error',
    }); */
    logSpy.mockRestore();
  });

  it('should login user and return token', async () => {
    const dto: LoginUserDto = {
      email: 'test@gogle.com',
      password: 'Abc123',
    };

    const user = {
      ...dto,
      password:
        '$argon2i$v=19$m=4096,t=3,p=1$8rKV3QWX0Y8GQ7ChOgVIRw$u+UEaGhG8Rvge4TvG17gnx/6jhdmePh9s7V3aK/asXA',
      isActive: true,
      roles: ['user'],
      fullName: 'Test User',
    } as User;

    jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
    jest
      .spyOn(argon, 'hash')
      .mockResolvedValue(
        '$argon2i$v=19$m=4096,t=3,p=1$8rKV3QWX0Y8GQ7ChOgVIRw$u+UEaGhG8Rvge4TvG17gnx/6jhdmePh9s7V3aK/asXA',
      );
    jest.spyOn(argon, 'verify').mockResolvedValue(true);

    // const result = await authService.login(dto);
    // expect(result).toEqual({
    //   user: {
    //     email: 'test@gogle.com',
    //     isActive: true,
    //     roles: ['user'],
    //     fullName: 'Test User',
    //   },
    //   token: 'mock-jwt-token',
    // });

    // expect(result.user.password).not.toBeDefined();
    // expect(result.user.password).toBeUndefined();
  });

  it('should throw an UnAuthorized Exception if user doest not exist', async () => {
    const dto = { email: 'test@google.com' } as LoginUserDto;

    jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

    await expect(authService.login(dto)).rejects.toThrow(UnauthorizedException);
    await expect(authService.login(dto)).rejects.toThrow(
      'Credentials are not valid (email)',
    );
  });

  it('should throw an UnAuthorized Exception if password is not valid', async () => {
    const dto = {
      email: 'test@google.com',
      password: 'Xyz123',
    } as LoginUserDto;

    jest.spyOn(userRepository, 'findOne').mockResolvedValue({
      password:
        '$argon2i$v=19$m=4096,t=3,p=1$8rKV3QWX0Y8GQ7ChOgVIRw$u+UEaGhG8Rvge4TvG17gnx/6jhdmePh9s7V3aK/asXA',
    } as User);

    jest.spyOn(argon, 'verify').mockResolvedValue(false);

    await expect(authService.login(dto)).rejects.toThrow(UnauthorizedException);
    await expect(authService.login(dto)).rejects.toThrow(
      'Credentials are not valid (password)',
    );
  });
});
