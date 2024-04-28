import * as fs from 'fs-extra';
import * as path from 'path';

const isCI = process.env.CI === 'true';
if (isCI) {
  console.log('🏃 CI detected, skipping .env.local generation');
  process.exit(0);
}

console.log('🔥 Generating .env.local files');

const autogeneratedComment =
  '# This file is autogenerated. To make changes, modify the root level .env.local file and run bun install\n\n';
const outputName = '.env';

// Read the .env file
const envFilePath = path.join(__dirname, '..', '..', outputName);
if (!fs.existsSync(envFilePath)) {
  console.log('🛑 .env file does not exist');
  process.exit(0);
}
const envFileContent = fs.readFileSync(envFilePath, 'utf8');

/**
 * Generate Expo .env file content
 */
const expoOutputPath = path.join(
  __dirname,
  '..',
  '..',
  'apps',
  'expo',
  outputName,
);
const expoFileContent = envFileContent
  .split('\n')
  .map((line) => {
    if (line.startsWith('PUBLIC_')) {
      return line.replace(/^PUBLIC_/, 'EXPO_PUBLIC_');
    }
  })
  .join('\n');
const expoNoTelemetry = 'EXPO_NO_TELEMETRY=true';
fs.writeFileSync(
  expoOutputPath,
  `${autogeneratedComment}\n${expoFileContent}\n${expoNoTelemetry}`,
);

/**
 * Generate Next.js .env file content
 */
const nextOutputPath = path.join(
  __dirname,
  '..',
  '..',
  'apps',
  'next',
  outputName,
);
const nextFileContent = envFileContent
  .split('\n')
  .map((line) => {
    if (line.startsWith('PUBLIC_')) {
      return line.replace(/^PUBLIC_/, 'NEXT_PUBLIC_');
    }
  })
  .join('\n');
fs.writeFileSync(nextOutputPath, `${autogeneratedComment}\n${nextFileContent}`);

/**
 * Generate Vite.js .env file content
 */
const viteOutputPath = path.join(
  __dirname,
  '..',
  '..',
  'apps',
  'vite',
  outputName,
);
const viteFileContent = envFileContent
  .split('\n')
  .map((line) => {
    if (line.startsWith('PUBLIC_')) {
      return line.replace(/^PUBLIC_/, 'VITE_');
    }
  })
  .join('\n');
fs.writeFileSync(viteOutputPath, `${autogeneratedComment}\n${viteFileContent}`);
