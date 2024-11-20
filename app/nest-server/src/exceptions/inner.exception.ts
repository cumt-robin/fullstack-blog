import { HttpException, HttpStatus } from "@nestjs/common";

export class InnerException extends HttpException {
    constructor(code: string, msg: string) {
        super({ code, msg }, HttpStatus.OK); // 使用 200 状态码
    }
}
