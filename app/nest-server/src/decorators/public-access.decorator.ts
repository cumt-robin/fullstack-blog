import { SetMetadata } from "@nestjs/common";

export const PUBLIC_ACCESS_KEY = "public-access";
export const PublicAccess = () => SetMetadata(PUBLIC_ACCESS_KEY, true);
