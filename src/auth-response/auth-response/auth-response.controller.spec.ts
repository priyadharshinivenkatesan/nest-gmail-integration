import { Test, TestingModule } from '@nestjs/testing';
import { AuthResponseController } from './auth-response.controller';

describe('AuthResponseController', () => {
  let controller: AuthResponseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthResponseController],
    }).compile();

    controller = module.get<AuthResponseController>(AuthResponseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
