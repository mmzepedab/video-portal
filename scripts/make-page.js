const fs = require('fs');
const path = require('path');

function createPage(routeArg, baseDir = process.cwd()) {
  if (!routeArg) {
    throw new Error('Route is required');
  }

  const cleanRoute = routeArg.replace(/^\/+|\/+$/g, '');
  const routeParts = cleanRoute.split('/').filter(Boolean);

  const appDir = path.join(baseDir, 'app', ...routeParts);
  const pageFilePath = path.join(appDir, 'page.tsx');

  const pageName =
    routeParts[routeParts.length - 1]
      ?.replace(/[-_](.)/g, (_, char) => char.toUpperCase())
      ?.replace(/^(.)/, (_, char) => char.toUpperCase()) || 'Page';

  const componentName = `${pageName}Page`;
  const title = routeParts.join(' / ');

  if (fs.existsSync(pageFilePath)) {
    throw new Error('Page already exists');
  }

  fs.mkdirSync(appDir, { recursive: true });

  const content = `export default function ${componentName}() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">${title}</h1>
    </main>
  );
}
`;

  fs.writeFileSync(pageFilePath, content, 'utf8');

  return pageFilePath;
}

if (require.main === module) {
  const routeArg = process.argv[2];

  try {
    const result = createPage(routeArg);
    console.log(`Created: ${result}`);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}

module.exports = { createPage };
