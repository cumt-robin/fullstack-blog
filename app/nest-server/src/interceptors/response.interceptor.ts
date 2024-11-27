import { CallHandler, HttpException, HttpStatus } from "@nestjs/common";

import { ExecutionContext } from "@nestjs/common";

import { NestInterceptor } from "@nestjs/common";
import { catchError, map, Observable, throwError } from "rxjs";

export class ResponseInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            map((data) => ({ code: "0", ...data })),
            // catchError((error) => {
            //     console.log("ResponseInterceptor", error);
            //     const statusCode = error instanceof HttpException ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
            //     const errorMessage = error.message || "请求失败";

            //     // let errorData = null;

            //     // if (error instanceof HttpException) {
            //     //     errorData = error.getResponse()["data"] || null; // 获取 data
            //     // }

            //     // console.log(errorData);
            //     // console.log(error instanceof HttpException, statusCode, error.message);

            //     return throwError(
            //         () =>
            //             new HttpException(
            //                 {
            //                     msg: errorMessage,
            //                 },
            //                 statusCode,
            //             ),
            //     );
            // }),
        );
    }
}
