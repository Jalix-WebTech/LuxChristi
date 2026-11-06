# Picture quiz image assets

Ten picture questions are configured to load from this directory first. The project includes a Wikimedia Commons source manifest at `sources.json` and a downloader script at `scripts/download-picture-assets.mjs`.

From the project root, run:

```bash
npm run download:picture-assets
```

The build environment used to prepare this project could not retrieve binary image files from the external image host, so the JPEG files are not bundled in this ZIP. Until they are downloaded, the quiz uses the real source image URLs as a browser fallback. A network connection is therefore required for picture questions until the local assets are populated.

Check each image's source page and current licence before public or commercial distribution. Keep attribution and licence information with the assets.
