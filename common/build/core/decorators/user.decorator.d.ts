import { JwtPayloadWithRefreshToken } from '../interfaces/jwt-payload.interface';
export declare const User: (...dataOrPipes: (keyof JwtPayloadWithRefreshToken | import("@nestjs/common").PipeTransform<any, any> | import("@nestjs/common").Type<import("@nestjs/common").PipeTransform<any, any>> | undefined)[]) => ParameterDecorator;
