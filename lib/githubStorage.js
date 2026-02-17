const path = require('path');

const DEFAULT_PDF_DIR = 'public/pdf';
const GITHUB_API_VERSION = '2022-11-28';

const trimSlashes = (value) => String(value || '').replace(/^\/+|\/+$/g, '');

const getConfig = () => {
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || 'main';
  const token = process.env.GITHUB_TOKEN;
  const pdfDir = trimSlashes(process.env.GITHUB_PDF_DIR || DEFAULT_PDF_DIR);
  const pdfBaseRaw = process.env.PDF_BASE_RAW
    || `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${pdfDir}`;

  return {
    owner,
    repo,
    branch,
    token,
    pdfDir,
    pdfBaseRaw,
  };
};

const assertConfig = () => {
  const config = getConfig();
  const missing = ['GITHUB_OWNER', 'GITHUB_REPO', 'GITHUB_TOKEN']
    .filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(`GitHub storage is not configured: missing ${missing.join(', ')}`);
  }

  if (typeof fetch !== 'function') {
    throw new Error('Global fetch is not available in this Node runtime.');
  }

  return config;
};

const encodeContentPath = (filePath) => trimSlashes(filePath)
  .split('/')
  .map(encodeURIComponent)
  .join('/');

const buildContentsUrl = (filePath, withRef = false) => {
  const { owner, repo, branch } = assertConfig();
  const encodedPath = encodeContentPath(filePath);
  const baseUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${encodedPath}`;
  return withRef ? `${baseUrl}?ref=${encodeURIComponent(branch)}` : baseUrl;
};

const getHeaders = (acceptValue = 'application/vnd.github+json') => {
  const { token } = assertConfig();
  return {
    Authorization: `Bearer ${token}`,
    Accept: acceptValue,
    'X-GitHub-Api-Version': GITHUB_API_VERSION,
    'User-Agent': 'fale7-res-server',
  };
};

const parseErrorBody = async (response) => {
  try {
    const data = await response.json();
    if (data && typeof data.message === 'string') {
      return data.message;
    }
  } catch {
    // Ignore JSON parsing errors and fall back to status text.
  }
  return response.statusText || 'Unknown GitHub API error';
};

const resolvePdfPath = (filename) => {
  const { pdfDir } = getConfig();
  return `${pdfDir}/${filename}`;
};

const buildRawFileUrl = (filename) => {
  const { pdfBaseRaw } = getConfig();
  return `${trimSlashes(pdfBaseRaw)}/${encodeURIComponent(filename)}`;
};

const getFileSha = async (filePath) => {
  const url = buildContentsUrl(filePath, true);
  const response = await fetch(url, {
    method: 'GET',
    headers: getHeaders(),
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    const details = await parseErrorBody(response);
    throw new Error(`Failed to read file SHA (${response.status}): ${details}`);
  }

  const fileData = await response.json();
  return fileData.sha || null;
};

const uploadOrUpdateFile = async (filePath, buffer, commitMessage) => {
  const { branch } = assertConfig();
  const sha = await getFileSha(filePath);
  const payload = {
    message: commitMessage || `Update ${path.basename(filePath)}`,
    content: Buffer.from(buffer).toString('base64'),
    branch,
  };

  if (sha) {
    payload.sha = sha;
  }

  const response = await fetch(buildContentsUrl(filePath), {
    method: 'PUT',
    headers: {
      ...getHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const details = await parseErrorBody(response);
    throw new Error(`Failed to upload file (${response.status}): ${details}`);
  }

  const result = await response.json();
  return {
    path: filePath,
    sha: result.content?.sha || null,
    commitSha: result.commit?.sha || null,
  };
};

const deleteFile = async (filePath, commitMessage) => {
  const { branch } = assertConfig();
  const sha = await getFileSha(filePath);
  if (!sha) {
    return { deleted: false };
  }

  const response = await fetch(buildContentsUrl(filePath), {
    method: 'DELETE',
    headers: {
      ...getHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: commitMessage || `Delete ${path.basename(filePath)}`,
      sha,
      branch,
    }),
  });

  if (response.status === 404) {
    return { deleted: false };
  }

  if (!response.ok) {
    const details = await parseErrorBody(response);
    throw new Error(`Failed to delete file (${response.status}): ${details}`);
  }

  const result = await response.json();
  return {
    deleted: true,
    commitSha: result.commit?.sha || null,
  };
};

const downloadFile = async (filePath) => {
  const response = await fetch(buildContentsUrl(filePath, true), {
    method: 'GET',
    headers: getHeaders('application/vnd.github.raw'),
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    const details = await parseErrorBody(response);
    throw new Error(`Failed to download file (${response.status}): ${details}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
};

module.exports = {
  getConfig,
  resolvePdfPath,
  buildRawFileUrl,
  getFileSha,
  uploadOrUpdateFile,
  deleteFile,
  downloadFile,
};
