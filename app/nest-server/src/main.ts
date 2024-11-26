import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ResponseInterceptor } from "./interceptors/response.interceptor";
import { InnerExceptionFilter } from "./exception-filters/inner.filter";
import { HttpException, HttpStatus, ValidationPipe } from "@nestjs/common";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            exceptionFactory: (errors) => {
                // 自定义异常处理逻辑，将验证错误转换为 HttpException
                const message = errors
                    .map((err) => {
                        const info = Object.values(err.constraints).join(", ");
                        return info.includes(err.property) ? info : `${err.property}${info}`;
                    })
                    .join("\n");
                return new HttpException(
                    {
                        message,
                    },
                    HttpStatus.BAD_REQUEST,
                );
            },
        }),
    );
    app.useGlobalInterceptors(new ResponseInterceptor());
    app.useGlobalFilters(new InnerExceptionFilter());
    await app.listen(process.env.PORT ?? 3000, process.env.HOST ?? "0.0.0.0");
}
bootstrap();
