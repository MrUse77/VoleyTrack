import { ICerrarSesion } from "../ports/in/iam.port";

import { Injectable } from "@nestjs/common";

@Injectable()
export class CerrarSesion implements ICerrarSesion {
  async execute(): Promise<any> {}
}
