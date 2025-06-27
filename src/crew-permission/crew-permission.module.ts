import { Module } from '@nestjs/common';
import { CrewPermissionService } from './crew-permission.service';

@Module({
  providers: [CrewPermissionService],
  exports: [CrewPermissionService],
})
export class CrewPermissionModule {}
