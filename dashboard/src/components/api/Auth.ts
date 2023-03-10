export type Role =
  | "owner"
  | "manager"
  | "editor"
  | "member"
  | "student"
  | "assistant"
  | "unknown";

export interface IUserRequest {
  id?: string;
  userName?: string;
  nickName?: string;
  avatar?: string;
}
export interface IUserApiData {
  id: string;
  userName: string;
  nickName: string;
  avatar?: string;
}
export interface IUserListResponse {
  ok: boolean;
  message: string;
  data: {
    rows: IUserApiData[];
    count: number;
  };
}

export interface IUserApiResponse {
  id: string;
  userName: string;
  nickName: string;
  avatar: string;
}

export interface IStudioApiResponse {
  id: string;
  nickName: string;
  studioName: string;
  avatar: string;
  owner: IUserApiResponse;
}