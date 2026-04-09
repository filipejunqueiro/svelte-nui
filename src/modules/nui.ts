import { onMount } from "svelte";
import type { ISendArgs, IReceiveArgs, IEventPayload } from "../types/events.ts";
import resourceName from "./resourceName.ts";
import inBrowser from "./inBrowser.ts";

class nui {
  static readonly _resource = resourceName();

  /**
   * Sends a NUI event to the client and returns a reactive Svelte state object.
   *
   * In the browser, if `mockData` is provided, it will populate the state with it, otherwise, it remains `undefined`.
   *
   * @template TSend - The type of the payload sent with the trigger.
   * @template TResponse - The type of the response returned by the client.
   *
   * @param action - The name of the NUI event to send.
   * @param mockData - The optional mock data returned in the browser environment instead of a real fetch.
   * @param autoFetch - If true, automatically fires the trigger in the background upon initialization.
   *
   * @returns An object containing:
   * - `trigger` - An async function to fire the event with an optional typed payload.
   * - `state` - A Svelte 5 `$state` proxy containing `data`, `loading`, and `error`.
   * > **Warning:** Do not destructure properties out of the `state` object, or you will break Svelte's reactivity!
   *
   * @throws {Error} if `action` contains whitespaces or is empty.
   *
   * @example
   *  const { trigger: fetchBalance, state: balanceState } = nui.send<void, number>({
   *    action: "getAccountBalance",
   *    mockData: 5000,
   *    autoFetch: true,
   *  });
   *
   * // In markup:
   * // {#if balanceState.loading}
   * //   <p>Syncing data...</p>
   * // {:else if balanceState.data}
   * //   <p>Balance: ${balanceState.data}</p>
   * // {/if}
   */
  static send<TSend = unknown, TResponse = unknown>({
    action,
    mockData,
    autoFetch = false,
  }: ISendArgs<TSend>) {
    if (!action.trim()) throw new Error(`[ERROR]: Invalid or missing event name`);

    const state = $state({
      data: undefined as TResponse | undefined,
      loading: false,
      error: undefined as Error | undefined,
    });

    const trigger = async (data?: TSend) => {
      state.loading = true;
      state.error = undefined;

      try {
        if (inBrowser()) {
          if (mockData !== undefined) state.data = mockData as unknown as TResponse;
          return;
        }

        const response = await fetch(`https://${this._resource}/${action}`, {
          method: "post",
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) throw new Error(`[ERROR]: ${action}: ${response.statusText}`);

        state.data = (await response.json()) as TResponse;
      } catch (e) {
        state.error = e instanceof Error ? e : new Error(String(e));
      } finally {
        state.loading = false;
      }
    };

    if (autoFetch) void trigger();

    return {
      trigger,
      state,
    };
  }

  /**
   * Listens for a NUI event posted from the client and invokes a callback with the typed payload.
   *
   * Registers a `message` event listener on `window` when the component mounts,
   * and automatically removes it when the component unmounts.
   *
   * > **Note:** Because this uses Svelte's `onMount` lifecycle, it MUST be called at the top level of your component's script block, not inside a function.
   *
   * @template TData - The type of the data received from the client event.
   *
   * @param action - The name of the NUI event to listen for.
   * @param callback - A function invoked with the typed data when the event is received.
   *
   * @example
   *  let isVisible = $state(false);
   *
   *  nui.receive<boolean>({
   *    action: "visibility",
   *    callback: (visible) => isVisible = visible,
   *  });
   */
  static receive<TData = unknown>({ action, callback }: IReceiveArgs<TData>): void {
    onMount(() => {
      const eventListener = (event: MessageEvent<IEventPayload<TData>>) => {
        const { action: eventAction, data } = event.data;

        if (eventAction === action) callback(data);
      };

      window.addEventListener("message", eventListener);

      return () => window.removeEventListener("message", eventListener);
    });
  }
}

export default nui;
