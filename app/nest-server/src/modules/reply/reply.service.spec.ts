import { Test, TestingModule } from '@nestjs/testing';
import { ReplyService } from './reply.service';

describe('ReplyService', () => {
  let service: ReplyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReplyService],
    }).compile();

    service = module.get<ReplyService>(ReplyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
