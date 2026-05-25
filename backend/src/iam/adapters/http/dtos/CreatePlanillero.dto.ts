import { IsEmail, IsString, MinLength } from "class-validator";

export class CreatePlanilleroDto {
  @IsString()
  @MinLength(3)
  public readonly name: string;

  @IsEmail()
  public readonly emailRaw: string;

  @IsString()
  @MinLength(8)
  public readonly passwordRaw: string;
}
