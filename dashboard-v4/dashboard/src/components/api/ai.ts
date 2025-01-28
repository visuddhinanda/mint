import { IStudio } from "../auth/Studio";
import { IUser } from "../auth/User";

export type TPrivacy = "private" | "public";

export interface IKimiResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: AiChoice[];
  usage: AiUsage;
}

export interface AiUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

export interface AiChoice {
  index: number;
  message: AiMessage;
  logprobs?: string | null; //volcengine
  finish_reason: string;
}

export interface AiMessage {
  role: string;
  content: string;
}

export interface IAiTranslateRequest {
  origin: string;
}

export interface IAiTranslateResponse {
  ok: boolean;
  message: string;
  data: IKimiResponse;
}

export interface IAiModel {
  uid: string;
  name: string;
  description?: string | null;
  url?: string | null;
  model?: string;
  key?: string;
  privacy: TPrivacy;
  owner: IStudio;
  editor: IUser;
  created_at: string;
  updated_at: string;
}

export interface IAiModelRequest {
  name: string;
  description?: string | null;
  url?: string | null;
  model?: string;
  key?: string;
  privacy: TPrivacy;
  studio_name?: string;
}

export interface IAiModelListResponse {
  ok: boolean;
  message: string;
  data: { rows: IAiModel[]; total: number };
}

export interface IAiModelResponse {
  ok: boolean;
  message: string;
  data: IAiModel;
}
