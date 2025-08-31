declare global {
  interface Window {
    EBWidgets: {
      createWidget: (config: {
        widgetType: string;
        eventId: string;
        modal?: boolean;
        modalTriggerElementId?: string;
        onOrderComplete?: () => void;
        onWidgetLoaded?: () => void;
        onWidgetError?: (error: { message?: string }) => void;
        [key: string]: string | boolean | (() => void) | ((error: { message?: string }) => void) | undefined;
      }) => void;
    };
  }
}

export {};
