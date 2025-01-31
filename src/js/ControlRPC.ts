import { MessageAction } from "./InterceptedMessagesQueue";
import { WebSocketMessageData } from "./WebSocketMessageData";

export type ServerMethods = {
  startInterception(params: InterceptionModeDTO): Record<string, never>;
  injectMessage(params: InjectMessageParamsDTO): InjectMessageResultDTO;

  // TODO how to represent a notification?
  mitmproxyReady(): void;
};

export type ClientMethods = {
  transformInterceptedMessage(
    params: TransformInterceptedMessageParamsDTO,
  ): TransformInterceptedMessageResultDTO;
};

export type WebSocketMessageDataDTO = { type: "binary" | "text"; data: string };

export function createWebSocketMessageData(
  dto: WebSocketMessageDataDTO,
): WebSocketMessageData {
  switch (dto.type) {
    case "binary": {
      const data = Buffer.from(dto.data, "base64");
      return { type: "binary", data };
    }
    case "text":
      return { type: "text", data: dto.data };
  }
}

export function createWebSocketMessageDataDTO(
  webSocketMessageData: WebSocketMessageData,
): WebSocketMessageDataDTO {
  let dataRepresentation: string;
  switch (webSocketMessageData.type) {
    case "binary":
      dataRepresentation = webSocketMessageData.data.toString("base64");
      break;
    case "text":
      dataRepresentation = webSocketMessageData.data;
      break;
  }

  return { type: webSocketMessageData.type, data: dataRepresentation };
}

export type InterceptionModeDTO =
  | { mode: "local"; pid: number }
  | { mode: "proxy" };

export type TransformInterceptedMessageParams = {
  id: string;
  connectionID: string;
  data: WebSocketMessageData;
  fromClient: boolean;
};

export type TransformInterceptedMessageParamsDTO = {
  id: string;
  connectionID: string;
  fromClient: boolean;
} & WebSocketMessageDataDTO;

export function createTransformInterceptedMessageParamsDTO(
  params: TransformInterceptedMessageParams,
): TransformInterceptedMessageParamsDTO {
  return {
    id: params.id,
    connectionID: params.connectionID,
    ...createWebSocketMessageDataDTO(params.data),
    fromClient: params.fromClient,
  };
}

export type TransformInterceptedMessageResultDTO =
  | { action: "drop" }
  | ({ action: "replace" } & WebSocketMessageDataDTO);

export type TransformInterceptedMessageResult = {
  action: MessageAction;
};

export function createTransformInterceptedMessageResult(
  dto: TransformInterceptedMessageResultDTO,
): TransformInterceptedMessageResult {
  let action: MessageAction;

  switch (dto.action) {
    case "drop":
      action = { type: "drop" };
      break;
    case "replace":
      action = { type: "replace", data: createWebSocketMessageData(dto) };
      break;
  }

  return { action };
}

export type InjectMessageParams = {
  connectionID: string;
  data: WebSocketMessageData;
  fromClient: boolean;
};

export type InjectMessageParamsDTO = {
  connectionID: string;
  fromClient: boolean;
} & WebSocketMessageDataDTO;

export function createInjectMessageParams(
  dto: InjectMessageParamsDTO,
): InjectMessageParams {
  return {
    connectionID: dto.connectionID,
    data: createWebSocketMessageData(dto),
    fromClient: dto.fromClient,
  };
}

export type InjectMessageResultDTO = {
  id: string;
};
