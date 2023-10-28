import { CanActivate, ExecutionContext } from "@nestjs/common";
export declare class IsUUIDGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean;
}
