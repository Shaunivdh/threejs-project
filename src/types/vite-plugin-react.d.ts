declare module "@vitejs/plugin-react" {
  import type { PluginOption } from "vite";

  export interface ReactPluginOptions {
    include?: string | RegExp | Array<string | RegExp>;
    exclude?: string | RegExp | Array<string | RegExp>;
    jsxImportSource?: string;
    babel?: Record<string, unknown>;
  }

  export default function react(options?: ReactPluginOptions): PluginOption;
}
