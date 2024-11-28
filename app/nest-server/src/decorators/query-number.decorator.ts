import { Transform, Type } from "class-transformer";
import { IsInt, IsPositive } from "class-validator";

/**
 * 查询字符串中的正整数类型
 * @param defaultValue 默认值
 */
export function QueryPositiveInt(defaultValue: number = 0) {
    return function (target: any, propertyKey: string) {
        // 应用所有需要的装饰器
        Transform(({ value }) => {
            if (value === 0) {
                return defaultValue;
            }
            return value;
        })(target, propertyKey);
        Type(() => Number)(target, propertyKey);
        IsInt({ message: "必须是整数" })(target, propertyKey);
        IsPositive({ message: "必须大于0" })(target, propertyKey);
    };
}
