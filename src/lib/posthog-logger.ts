import posthog from "posthog-js";

type LogAttributes = Record<string, boolean | number | string>;

/** Emits only purpose-written, non-sensitive application logs to PostHog. */
export const prototypeLog = {
  info(message: string, attributes: LogAttributes) {
    posthog.logger.info(message, attributes);
  },
};
