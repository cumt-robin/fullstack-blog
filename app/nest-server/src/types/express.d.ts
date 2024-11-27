import "express";

declare module "express" {
    interface Request {
        currentUser: Record<string, any>;
    }
}
