import { IsInt, IsUUID, Max, Min } from 'class-validator';

export class ValidateSponsorshipDto {
  @IsUUID()
  crewId: string;

  @IsInt()
  @Min(1000)
  @Max(1000000)
  amount: number;
}
