#!/bin/sh
# Build the site and remove the duplicate /en/index.html that Hugo's
# multilingual mode generates even with defaultContentLanguageInSubdir = false.
# English lives at "/"; /en/ only exists as a legacy alias handled by
# the _redirects file. /en/sitemap.xml is kept since the sitemap index
# at /sitemap.xml references it directly.
set -e
rm -rf public
hugo --minify
rm -f public/en/index.html
