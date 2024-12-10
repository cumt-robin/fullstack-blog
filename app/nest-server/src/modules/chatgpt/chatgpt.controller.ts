import { Body, Controller, Get, HttpException, Post, Query, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import { OpenAIApi, Configuration } from "openai";
import { ConfigService } from "@nestjs/config";
import { Readable } from "stream";
import { PublicAccess } from "@/decorators/public-access.decorator";

@Controller("chatgpt")
export class ChatgptController {
    private openai: OpenAIApi;
    constructor(private readonly configService: ConfigService) {
        const configuration = new Configuration({
            apiKey: this.configService.get("OPENAI_API_KEY"),
        });
        this.openai = new OpenAIApi(configuration);
    }

    @PublicAccess()
    @Get("/chat")
    async chat(@Query("wd") queryWd: string, @Req() req: Request, @Res() res: Response) {
        if (req.session.chatgptTimes && req.session.chatgptTimes >= 50) {
            throw new HttpException("到达调用上限，欢迎明天再来哦", 403);
        }
        if (req.session.chatgptTopicCount && req.session.chatgptTopicCount >= 10) {
            req.session.chatgptSessionPrompt = "";
            req.session.chatgptTopicCount = 0;
            throw new HttpException("这个话题聊得有点深入了，不如换一个", 403);
        }
        if (req.session.chatgptRequestTime && Date.now() - req.session.chatgptRequestTime <= 3000) {
            throw new HttpException("请降低请求频次", 403);
        }
        if (!req.session.chatgptSessionPrompt) {
            req.session.chatgptSessionPrompt = "";
        }
        const wd = queryWd || "";
        if (wd.length <= 1) {
            throw new HttpException("你说得太少了，我不明白", 400);
        }
        if (wd.length >= 60) {
            throw new HttpException("请不要输入太长的内容", 400);
        }
        const prompt = `${req.session.chatgptSessionPrompt}\n提问:${wd}\nAI:`;
        try {
            const completion = await this.openai.createCompletion(
                {
                    model: "text-davinci-003",
                    prompt,
                    temperature: 0.9,
                    max_tokens: 150,
                    top_p: 1,
                    frequency_penalty: 0,
                    presence_penalty: 0.6,
                    stop: ["\n提问:", "\nAI:"],
                    stream: true,
                },
                { responseType: "stream" },
            );
            req.session.chatgptRequestTime = Date.now();
            if (!req.session.chatgptTopicCount) {
                req.session.chatgptTopicCount = 1;
            } else {
                req.session.chatgptTopicCount += 1;
            }
            if (!req.session.chatgptTimes) {
                req.session.chatgptTimes = 1;
            } else {
                req.session.chatgptTimes += 1;
            }
            const stream = completion.data as unknown as Readable;
            res.setHeader("content-type", "text/event-stream");
            stream.pipe(res);
            stream.on("end", () => {
                res.end();
            });
            stream.on("error", (error) => {
                console.error(error);
                throw new HttpException("Open AI Stream 异常", 500);
            });
        } catch (error) {
            console.error(error);
            throw new HttpException("Open AI 调用异常", 500);
        }
    }

    @PublicAccess()
    @Post("/feedback")
    async feedback(@Body("result") result: string, @Req() req: Request) {
        if (result) {
            req.session.chatgptSessionPrompt += result;
            return {
                msg: "更新成功",
            };
        } else {
            throw new HttpException("参数错误", 400);
        }
    }

    @PublicAccess()
    @Post("/changeTopic")
    async changeTopic(@Req() req: Request) {
        req.session.chatgptSessionPrompt = "";
        req.session.chatgptTopicCount = 0;
        return {
            msg: "可以尝试新的话题",
        };
    }
}
