import type { RecordDTO } from "../base";

export interface UserDTO extends RecordDTO {
    role_id: number;
    role_name: string;
    user_name: string;
    avatar: string;
    last_login_time: string;
    token: string;
}
