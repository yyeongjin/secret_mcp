import path from 'node:path';

export function resolveDesignIndexOutputDirectory(
  configuredDirectory?: string
): string {
  return path.resolve(
    configuredDirectory ??
      process.env.DESIGN_INDEX_OUTPUT_DIR ??
      path.join(process.cwd(), 'design-index')
  );
}
