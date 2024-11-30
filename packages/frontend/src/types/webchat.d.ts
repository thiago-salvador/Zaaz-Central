export namespace WebChat {
  export interface Activity {
    type: string;
    text: string;
    from: {
      id: string;
      name?: string;
    };
    timestamp?: string;
    locale?: string;
    textFormat?: string;
    attachments?: any[];
  }

  export interface DirectLineClient {
    postActivity: (activity: Activity) => Promise<void>;
    activity$: {
      filter: (predicate: (activity: Activity) => boolean) => {
        subscribe: (callback: (activity: Activity) => void) => {
          unsubscribe: () => void;
        };
      };
    };
  }

  export interface StyleOptions {
    backgroundColor?: string;
    bubbleBackground?: string;
    bubbleBorderRadius?: number;
    bubbleFromUserBackground?: string;
    bubbleFromUserBorderRadius?: number;
    bubbleFromUserTextColor?: string;
    bubbleTextColor?: string;
    sendBoxBackground?: string;
    sendBoxBorderTop?: string;
    sendBoxTextColor?: string;
    timestampColor?: string;
  }

  export interface Action {
    type: string;
    payload?: {
      name: string;
      value: any;
    };
  }
}

declare global {
  interface Window {
    WebChat: {
      createDirectLine: (options: { token: string }) => WebChat.DirectLineClient;
      renderWebChat: (options: {
        directLine: WebChat.DirectLineClient;
        store?: any;
        styleOptions?: WebChat.StyleOptions;
        locale?: string;
      }, element: HTMLElement) => void;
      createStore: (
        initialState?: any,
        middleware?: (store: { dispatch: (action: WebChat.Action) => void }) => 
          (next: (action: WebChat.Action) => void) => 
          (action: WebChat.Action) => void
      ) => any;
    }
  }
}
