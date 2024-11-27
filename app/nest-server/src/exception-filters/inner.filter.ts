import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from "@nestjs/common";
import { Response } from "express";
import { InnerException } from "../exceptions/inner.exception";

@Catch(InnerException)
export class InnerExceptionFilter implements ExceptionFilter {
    catch(exception: InnerException, host: ArgumentsHost) {
        console.log("InnerExceptionFilter", exception);
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        const data = exception.getResponse() as any;

        console.log("InnerExceptionFilter data", data);

        response.status(HttpStatus.OK).json(data);
    }
}
