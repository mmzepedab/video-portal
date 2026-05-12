const fs = require('fs');
const path = require('path');
const os = require('os');

const { createPage } = require('./make-page');

describe('make-page script', () => {
  let tempDir;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'test-'));
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  test('creates a simple page', () => {
    const filePath = createPage('dashboard', tempDir);

    const expectedPath = path.join(tempDir, 'app', 'dashboard', 'page.tsx');

    expect(filePath).toBe(expectedPath);
    expect(fs.existsSync(expectedPath)).toBe(true);

    const content = fs.readFileSync(expectedPath, 'utf8');
    expect(content).toContain('DashboardPage');
  });

  test('creates nested page', () => {
    createPage('uploads/new', tempDir);

    const expectedPath = path.join(
      tempDir,
      'app',
      'uploads',
      'new',
      'page.tsx'
    );

    expect(fs.existsSync(expectedPath)).toBe(true);
  });

  test('throws if page already exists', () => {
    createPage('dashboard', tempDir);

    expect(() => createPage('dashboard', tempDir)).toThrow(
      'Page already exists'
    );
  });

  test('throws if no route provided', () => {
    expect(() => createPage(null, tempDir)).toThrow('Route is required');
  });
});
