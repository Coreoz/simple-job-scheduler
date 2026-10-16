import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it } from 'vitest';

const require = createRequire(import.meta.url);
const currentDir = path.dirname(fileURLToPath(import.meta.url));

const packageRoot = path.resolve(currentDir, '..', '..');
const cjsEntry = path.join(packageRoot, 'build', 'cjs', 'index.js');
const esmEntry = path.join(packageRoot, 'build', 'esm', 'index.js');
const typesEntry = path.join(packageRoot, 'build', 'esm', 'index.d.ts');

const CTOR_NAME_SYMBOL = Symbol.for('___CTOR_NAME___');
const CTOR_ARGS_SYMBOL = Symbol.for('___CTOR_ARGS___');

// These tests run against the *built* package (not the TypeScript sources) so that they
// verify the published artifacts: the three outputs, the DI metadata and the injection.
describe('Built package consumption', () => {
  it('produces the three build outputs (cjs, esm and declarations)', () => {
    assert.ok(fs.existsSync(cjsEntry), `missing CommonJS output: ${cjsEntry}`);
    assert.ok(fs.existsSync(esmEntry), `missing ESM output: ${esmEntry}`);
    assert.ok(fs.existsSync(typesEntry), `missing declarations output: ${typesEntry}`);
  });

  it('emits the ESM output with ESM syntax', () => {
    assert.match(fs.readFileSync(esmEntry, 'utf8'), /export\s*\{/);
  });

  it('exposes the DI metadata expected by plume-ts-di on the compiled Scheduler', () => {
    const { Scheduler } = require(cjsEntry);
    assert.equal(Scheduler[CTOR_NAME_SYMBOL], 'Scheduler');
    assert.deepEqual(Scheduler[CTOR_ARGS_SYMBOL], []);
  });

  it('resolves a Scheduler instance through an Injector without a "Cannot find type name" warning', () => {
    const { Scheduler } = require(cjsEntry);
    const warnings: string[] = [];
    const originalWarn = console.warn;
    console.warn = (...args: unknown[]) => {
      warnings.push(args.join(' '));
    };
    try {
      const { Injector } = require('plume-ts-di');
      const injector = new Injector();
      injector.registerSingleton(Scheduler);
      const instance = injector.getInstance(Scheduler);
      assert.ok(instance instanceof Scheduler);
    } finally {
      console.warn = originalWarn;
    }
    assert.ok(
      !warnings.some((warning) => warning.includes('Cannot find type name')),
      `unexpected warning while resolving Scheduler: ${warnings.join(' | ')}`,
    );
  });
});
