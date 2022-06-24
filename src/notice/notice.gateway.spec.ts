import { Test, TestingModule } from '@nestjs/testing';
import { NoticeGateway } from './notice.gateway';
import { NoticeService } from './notice.service';

describe('NoticeGateway', () => {
  let gateway: NoticeGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NoticeGateway, NoticeService],
    }).compile();

    gateway = module.get<NoticeGateway>(NoticeGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
