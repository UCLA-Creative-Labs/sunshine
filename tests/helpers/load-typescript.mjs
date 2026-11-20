import { readFileSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import { SourceTextModule, SyntheticModule } from 'node:vm';

// Load the real module with only explicit dependency mocks. An unexpected import
// fails the test instead of connecting to Supabase, GitHub, or notifications.
export async function loadTypeScript(url, mocks) {
  const source = stripTypeScriptTypes(readFileSync(url, 'utf8'));
  const loadedModule = new SourceTextModule(source, { identifier: url.href });
  await loadedModule.link((specifier) => {
    if (!Object.hasOwn(mocks, specifier)) {
      throw new Error(`Missing test mock for ${specifier}`);
    }
    const exports = mocks[specifier];
    return new SyntheticModule(Object.keys(exports), function () {
      for (const [name, value] of Object.entries(exports)) this.setExport(name, value);
    });
  });
  await loadedModule.evaluate();
  return loadedModule.namespace;
}
