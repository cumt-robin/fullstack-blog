import { Test, TestingModule } from "@nestjs/testing";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { AuthService } from "./auth.service";
import { AUTH_COOKIE_NAME } from "./auth.constants";

describe("AuthService", () => {
    let service: AuthService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: JwtService,
                    useValue: {
                        signAsync: jest.fn(),
                        verifyAsync: jest.fn(),
                    },
                },
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn((key: string) => {
                            if (key === "JWT_SECRET") {
                                return "test-secret";
                            }
                            if (key === "NODE_ENV") {
                                return "test";
                            }
                            return undefined;
                        }),
                    },
                },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
    });

    it("extractTokenFromRequest prefers Authorization Bearer over cookie", () => {
        const token = service.extractTokenFromRequest({
            headers: {
                authorization: "Bearer from-header",
                cookie: `${AUTH_COOKIE_NAME}=from-cookie`,
            },
        });
        expect(token).toBe("from-header");
    });

    it("extractTokenFromRequest falls back to auth cookie", () => {
        const token = service.extractTokenFromRequest({
            headers: {
                cookie: `foo=1; ${AUTH_COOKIE_NAME}=jwt-from-cookie%3Dstill; bar=2`,
            },
        });
        expect(token).toBe("jwt-from-cookie=still");
    });

    it("extractTokenFromRequest returns undefined when missing", () => {
        expect(service.extractTokenFromRequest({ headers: {} })).toBeUndefined();
    });
});
