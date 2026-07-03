import { IsString, IsNotEmpty } from 'class-validator';

export class ModifyProjectDto {
  @IsString()
  @IsNotEmpty()
  instruction: string;
}
