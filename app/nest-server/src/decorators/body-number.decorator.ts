import { Type } from "class-transformer";
import { IsInt, IsPositive } from "class-validator";

/**
 * body中的正整数类型
 */
export function BodyPositiveInt() {
    return function (target: any, propertyKey: string) {
        Type(() => Number)(target, propertyKey);
        IsInt({ message: "必须是整数" })(target, propertyKey);
        IsPositive({ message: "必须大于0" })(target, propertyKey);
    };
}
