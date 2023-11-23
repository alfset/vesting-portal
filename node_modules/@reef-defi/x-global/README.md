# @reef-defi/x-global

A cross-environment global object. checks for global > self > window > this.

Install it via `yarn add @reef-defi/x-global`

```js
import { xglobal } from '@reef-defi/x-global';

console.log(typeof xglobal.TextEncoder);
```
