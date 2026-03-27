const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1];
const isUserPagesRepo = process.env.GITHUB_REPOSITORY
  ? process.env.GITHUB_REPOSITORY.split("/")[0] === repoName
  : false;
const basePath = repoName && !isUserPagesRepo ? `/${repoName}` : "";

const nextConfig = {
  reactStrictMode: true,
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  basePath,
  assetPrefix: basePath || undefined
};

export default nextConfig;
