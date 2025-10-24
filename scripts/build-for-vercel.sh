#!/usr/bin/env bash
# Purpose: Re-clone content repo during Vercel build and run app build.
# Requires: environment variable GITHUB_PAT with GitHub token (read access).
set -euo pipefail

cd "$(dirname "$0")/../" || exit 1

# Pastikan token tersedia
if [ -z "${GITHUB_PAT}" ]; then
  echo "❌ GITHUB_PAT tidak ditemukan. Silakan buat token baru dan daftarkan di environment Vercel."
  echo "👉 https://github.com/settings/tokens?type=beta"
  echo "👉 https://vercel.com/<your-org>/<project>/settings/environment-variables"
  exit 1
fi

# Lokasi submodule
CONTENT_DIR="src/content"
CONTENT_REPO="https://github.com/artsbymat/2nd-brain.git"
BRANCH="main"

echo "🔄 Delete old content directory..."
rm -rf "${CONTENT_DIR}"

echo "📥 re-cloning content repository..."
git clone --depth 1 --branch "${BRANCH}" "https://${GITHUB_PAT}@${CONTENT_REPO#https://}" "${CONTENT_DIR}"

echo "🚀 Success re-cloning, building app..."
npm run build
