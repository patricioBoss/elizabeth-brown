declare module '@tawk.to/tawk-messenger-react' {
  import { Component, RefObject } from 'react';

  export interface TawkMessengerReactProps {
    propertyId: string;
    widgetId: string;
    customStyle?: Record<string, string>;
    onLoad?: () => void;
    onStatusChange?: (status: string) => void;
    onBeforeLoad?: () => void;
    onChatMaximized?: () => void;
    onChatMinimized?: () => void;
    onChatHidden?: () => void;
    onChatStarted?: () => void;
    onChatEnded?: () => void;
    onPrechatSubmit?: (data: unknown) => void;
    onOfflineSubmit?: (data: unknown) => void;
    onChatMessageVisitor?: (message: string) => void;
    onChatMessageAgent?: (message: string) => void;
    onChatMessageSystem?: (message: string) => void;
    onAgentJoinChat?: (data: unknown) => void;
    onAgentLeaveChat?: (data: unknown) => void;
    onChatSatisfaction?: (satisfaction: unknown) => void;
    onVisitorNameChanged?: (visitorName: string) => void;
    onFileUpload?: (link: string) => void;
    onTagsUpdated?: (data: unknown) => void;
    onUnreadCountChanged?: (data: unknown) => void;
  }

  export default class TawkMessengerReact extends Component<TawkMessengerReactProps> {
    maximize(): void;
    minimize(): void;
    toggle(): void;
    popup(): void;
    showWidget(): void;
    hideWidget(): void;
    toggleVisibility(): void;
    endChat(): void;
    getWindowType(): string;
    getStatus(): string;
    isChatMaximized(): boolean;
    isChatMinimized(): boolean;
    isChatHidden(): boolean;
    isChatOngoing(): boolean;
    isVisitorEngaged(): boolean;
    onLoaded: boolean;
    onBeforeLoaded: boolean;
    widgetPosition: string;
    visitor: unknown;
    addEvent(eventName: string, callback: (...args: unknown[]) => void): void;
    addTags(tags: string[], callback?: (error: Error | null) => void): void;
    removeTags(tags: string[], callback?: (error: Error | null) => void): void;
    setAttributes(attributes: Record<string, string>, callback?: (error: Error | null) => void): void;
  }
}
