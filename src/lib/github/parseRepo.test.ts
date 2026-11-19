import assert from 'node:assert/strict';
import { test } from 'node:test';
import { parseGithubRepo } from './parseRepo.ts';

test('accepts owner/repo', () => {
  assert.equal(parseGithubRepo('UCLA-Creative-Labs/sunshine'), 'ucla-creative-labs/sunshine');
});

test('accepts an https URL', () => {
  assert.equal(parseGithubRepo('https://github.com/UCLA-Creative-Labs/sunshine'), 'ucla-creative-labs/sunshine');
  assert.equal(parseGithubRepo('https://github.com/org/repo/tree/main'), 'org/repo');
});

test('strips a .git suffix', () => {
  assert.equal(parseGithubRepo('https://github.com/org/repo.git'), 'org/repo');
  assert.equal(parseGithubRepo('org/repo.git'), 'org/repo');
});

test('rejects lookalike hosts', () => {
  assert.equal(parseGithubRepo('https://github.com.evil.com/org/repo'), null);
  assert.equal(parseGithubRepo('https://notgithub.com/org/repo'), null);
});

test('rejects empty and incomplete input', () => {
  assert.equal(parseGithubRepo('   '), null);
  assert.equal(parseGithubRepo('not a url'), null);
  assert.equal(parseGithubRepo('https://github.com/org'), null);
});
