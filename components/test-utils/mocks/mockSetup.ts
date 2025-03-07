import { TransformStream as NodeTransformStream } from 'node:stream/web';

class BroadcastChannelPolyfill {
  postMessage() {}
  addEventListener() {}
  removeEventListener() {}
  close() {}
}

(global as any).TransformStream = NodeTransformStream;
(global as any).BroadcastChannel = BroadcastChannelPolyfill;
