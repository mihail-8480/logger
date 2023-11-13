import { Subscriber, blockFromSubject, createSubject } from "@mojsoski/streams";

export type LogFormat<T extends {}> = (log: T) => string;

export type Logger<T extends {}> = ReturnType<typeof createLogger<T>>;

export function createLogger<T extends {}>(
  textFormat: LogFormat<T>,
  encoder: TextEncoder = new TextEncoder()
) {
  const { notify, close, subject } = createSubject<T>();
  const block = blockFromSubject(subject);
  return {
    log: notify,
    close,
    setTextFormat(format: LogFormat<T>) {
      textFormat = format;
    },
    copyToString: (subscriber: Subscriber<string>) => {
      return block.map(textFormat).copyTo(subscriber);
    },
    copyTo: (subscriber: Subscriber<T>) => {
      return block.copyTo(subscriber);
    },
    copyToStream: (stream: Subscriber<Uint8Array>) => {
      return block
        .map(textFormat)
        .map((value) => encoder.encode(value))
        .copyTo(stream);
    },
  };
}
