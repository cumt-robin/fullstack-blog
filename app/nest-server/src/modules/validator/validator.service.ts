import { Injectable } from "@nestjs/common";
import * as svgCaptcha from "svg-captcha";

@Injectable()
export class ValidatorService {
    getImgCode() {
        return svgCaptcha.create({
            // 验证码长度
            size: 5,
            // 要排除的字符
            ignoreChars: "o0i1",
            // 干扰线条数量
            noise: 1,
            // 验证码的字符是否有颜色，默认没有，如果设定了背景，则默认有
            color: true,
            // 验证码图片背景颜色
            background: "#4dffc9",
            // 宽度
            width: 150,
            // 高度
            height: 50,
            // viewBox
            viewBox: "0,0,150,50",
        });
    }
}
