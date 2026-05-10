# Publishing Haru Player

## npm public registry

Use this path when consumers should install with the plain package name:

```bash
npm install haru-player
```

The package is already configured with:

- `name: haru-player`
- `publishConfig.registry: https://registry.npmjs.org/`
- `publishConfig.access: public`
- ESM/CJS exports
- TypeScript declarations
- CSS export at `haru-player/style.css`

### First publish from local machine

```bash
npm login
npm whoami
npm publish
```

`npm publish` runs `prepublishOnly`, so lint, build, and audit must pass before publishing.

### Publish from GitHub Actions

1. Create an npm automation token from npmjs.com.
2. Add it to the GitHub repository secrets as `NPM_TOKEN`.
3. Create a GitHub release or run the `publish npm` workflow manually.

## GitHub Packages

GitHub Packages is useful for private/internal distribution, but it normally uses a scoped package name and registry mapping. Consumers usually install it like this:

```bash
npm install @ryungwang/haru-player
```

With a project `.npmrc` such as:

```ini
@ryungwang:registry=https://npm.pkg.github.com
```

Because the requested install command is `npm install haru-player`, the public npm registry is the recommended publishing target.
