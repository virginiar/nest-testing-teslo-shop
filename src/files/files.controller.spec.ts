import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';
import { BadRequestException } from '@nestjs/common';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { ConfigService } from '@nestjs/config';

describe('FilesController', () => {
  let controller: FilesController;
  let filesService: FilesService;

  beforeEach(async () => {
    const mockFilesService = {
      getStaticProductImage: jest.fn(),
    };

    const mockConfigService = {
      get: jest.fn().mockReturnValue('http://localhost:3000'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: FilesService,
          useValue: mockFilesService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
      controllers: [FilesController],
    }).compile();

    controller = module.get<FilesController>(FilesController);
    filesService = module.get<FilesService>(FilesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return file path when findProductImage is called', () => {
    const mockResponse = { sendFile: jest.fn() } as unknown as Response;
    const imageName = 'test-image.jpg';
    const filePath = `/static/products${imageName}`;

    jest.spyOn(filesService, 'getStaticProductImage').mockReturnValue(filePath);

    controller.findProductImage(imageName, mockResponse);

    expect(mockResponse.sendFile).toHaveBeenCalled();
    expect(mockResponse.sendFile).toHaveBeenCalledWith(filePath);
  });

  it('should return a secureUrl when uploadProduct image is called with a file', () => {
    const file = {
      file: 'test-image.jpg',
      filename: 'testImageName.jpg',
    } as unknown as Express.Multer.File;

    const result = controller.uploadProductFile(file);

    expect(result).toEqual({
      secureUrl: 'http://localhost:3000/files/product/testImageName.jpg',
      fileName: 'testImageName.jpg',
    });
  });

  it('should throw a BadRequestException if no file was provided', () => {
    expect(() => controller.uploadProductFile(null)).toThrow(
      new BadRequestException('Make sure that the file is an image'),
    );
  });
});
