import { Module } from '@nestjs/common';
import { CrewService } from './crew.service';
import { CrewController } from './crew.controller';
import { PostModule } from 'src/post/post.module';

@Module({
  imports: [PostModule],
  controllers: [CrewController],
  providers: [CrewService],
  exports: [CrewService],
})
export class CrewModule {}
