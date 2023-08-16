import { type AppContextType } from '~/context/AppContext';
import {
  type CustomAttributes,
  type GuidedAttributes,
} from '~/context/PromptAttributesContext';

declare global {
  interface Window {
    analytics: { track: (eventName: string, props: unknown) => void };
  }
}

interface TrackSubmitProps {
  context: string;
  locale: string;
  storeHash: string;
  isFormGuided: boolean;
  results: number;
  guidedAttributes: GuidedAttributes;
  customAttributes: CustomAttributes;
}

export const EVENT_NAMES = {
  BIGC_APP_AI_UI_SUBMIT: 'BIGC_APP_AI_UI_SUBMIT',
  BIGC_APP_AI_UI_CLICK: 'BIGC_APP_AI_UI_CLICK',
};

export const useTracking = () => {
  const trackSubmit = (props: TrackSubmitProps): void =>
    window.analytics.track(EVENT_NAMES.BIGC_APP_AI_UI_SUBMIT, {
      context: props.context,
      storeHash: props.storeHash,
      language: props.locale,
      results: props.results,
      isFormGuided: props.isFormGuided,
      ...(props.isFormGuided ? props.guidedAttributes : props.customAttributes),
    });

  const trackClick = (props: AppContextType & { action: string }): void =>
    window.analytics.track(EVENT_NAMES.BIGC_APP_AI_UI_CLICK, props);

  return { trackSubmit, trackClick };
};
