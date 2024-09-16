import { observable } from "@legendapp/state";

import {
  configureObservablePersistence,
  persistObservable,
} from "@legendapp/state/persist";
import { ObservablePersistLocalStorage } from "@legendapp/state/persist-plugins/local-storage";
import { enableReactTracking } from "@legendapp/state/config/enableReactTracking";

const version = 1;

configureObservablePersistence({
  pluginLocal: ObservablePersistLocalStorage,
  localOptions: {},
});

export const settings$ = observable<{
  theme: "light" | "dark" | "system";
}>({
  theme: "system",
});

persistObservable(settings$, {
  local: `settings.v${version}`,
});

enableReactTracking({ auto: true });
