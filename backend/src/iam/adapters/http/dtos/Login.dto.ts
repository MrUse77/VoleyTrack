import { IsEmail, IsString, MinLength } from "class-validator";
export class LoginDto {
  @IsEmail()
  public readonly emailRaw: string;

  @IsString()
  @MinLength(8)
  public readonly passwordRaw: string;
}
