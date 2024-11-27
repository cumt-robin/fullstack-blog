import "express-session";

declare module "express-session" {
    interface Session {
        captcha: string;
        // 在这里添加其他需要的 session 属性
    }
}
