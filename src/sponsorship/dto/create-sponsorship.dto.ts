import { IsInt, IsUUID, Min, Max } from 'class-validator';

export class CreateSponsorshipDto {
  @IsUUID()
  crewId: string;

  @IsInt()
  @Min(1000)
  @Max(1000000)
  amount: number;
}
