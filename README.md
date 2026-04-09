# svelte-nui

A lightweight, type-safe NUI bridge for FiveM resources built for Svelte 5.

## Usage

### Sending data to the client

```typescript
import { nui } from "svelte-nui";

const { trigger: fetchBalance, state: balanceState } = nui.send<void, number>({
  action: "getAccountBalance",
  mockData: 5000,
  autoFetch: true,
});

console.log(balanceState.data);

fetchBalance(); // Refetching the action

console.log(balanceState.data);
```

### Receiving data from the client

```typescript
import { nui } from "svelte-nui";

let isVisible = $state(false);

nui.receive<boolean>({
  action: "visibility",
  callback: (visible) => (isVisible = visible),
});
```

### Getting the current environment

```typescript
import { inBrowser } from "svelte-nui";

console.log(`Dev env: ${inBrowser() ? "yes" : "no"}`);
```

### Getting the current resource name

```typescript
import { resourceName } from "svelte-nui";

console.log(resourceName());
```

## API

| Export         | Description                                                      |
| -------------- | ---------------------------------------------------------------- |
| `nui`          | Class for sending/receiving NUI events from client               |
| `inBrowser`    | Returns `true` when running outside FiveM (useful for local dev) |
| `resourceName` | Returns the current FiveM resource name                          |
| `noop`         | A no-op function, useful as a default callback                   |

## Development

```bash
bun install
bun run build
```

## License

The project is licensed under the [LGPL-3.0](./LICENSE)
