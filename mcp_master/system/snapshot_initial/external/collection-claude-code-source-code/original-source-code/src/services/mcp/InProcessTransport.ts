import type { Transport } from '@modelcontextprotocol/sdk/shared/transport.js'
import type { JSONRPCMessage } from '@modelcontextprotocol/sdk/types.js'

/**
 * In-process linked transport pair for running an MCP server and client
 * in the same process without spawning a subprocess.
 *
 * `send()` on one side delivers to `onmessage` on the other.
 * `close()` on either side calls `onclose` on both.
 */
class InProcessTransport_v2 implements Transport {
  private peer: InProcessTransport_v2 | undefined
  private closed = false

  onclose?: () => void
  onerror?: (error: Error) => void
  onmessage?: (message: JSONRPCMessage) => void

  /** @internal */
  _setPeer(peer: InProcessTransport_v2): void {
    this.peer = peer
  }

  async start(): Promise<void> {}

  async send(message: JSONRPCMessage): Promise<void> {
    if (this.closed) {
      throw new Error('Transport is closed')
    }
    // Deliver to the other side asynchronously to avoid stack depth issues
    // with synchronous request/response cycles
    queueMicrotask(() => {
      this.peer?.onmessage?.(message)
    })
  }

  async close(): Promise<void> {
    if (this.closed) {
      return
    }
    this.closed = true
    this.onclose?.()
    // Close the peer if it hasn't already closed
    if (this.peer && !this.peer.closed) {
      this.peer.closed = true
      this.peer.onclose?.()
    }
  }
}

/**
 * Creates a pair of linked transports for in-process MCP communication.
 * Messages sent on one transport are delivered to the other's `onmessage`.
 *
 * @returns [clientTransport, serverTransport]
 */
export function createLinkedTransportPair(): [Transport, Transport] {
  const a = new InProcessTransport_v2()
  const b = new InProcessTransport_v2()
  a._setPeer(b)
  b._setPeer(a)
  return [a, b]
}
