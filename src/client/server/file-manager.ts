import type { HttpClient } from '../../core/http-client.js';
import type { CompressionExtension, FileObject, SignedUrl } from '../../types/client/file.js';

export class FileManager {
  private readonly base: string;

  constructor(
    private readonly http: HttpClient,
    serverId: string,
  ) {
    this.base = `/api/client/servers/${serverId}/files`;
  }

  async list(directory = '/'): Promise<FileObject[]> {
    const result = await this.http.getList<FileObject>(`${this.base}/list`, {
      filters: { directory },
    });
    return result.data;
  }

  async getContent(file: string): Promise<string> {
    const path = `${this.base}/contents?file=${encodeURIComponent(file)}`;
    const response = await this.http.raw('GET', path);
    return response.text();
  }

  async writeFile(file: string, content: string): Promise<void> {
    await this.http.post<void>(`${this.base}/write`, { file, content });
  }

  async getUploadUrl(directory = '/'): Promise<string> {
    const path = `${this.base}/upload?directory=${encodeURIComponent(directory)}`;
    const result = await this.http.get<SignedUrl>(path);
    return result.url;
  }

  async getDownloadUrl(file: string): Promise<string> {
    const path = `${this.base}/download?file=${encodeURIComponent(file)}`;
    const result = await this.http.get<SignedUrl>(path);
    return result.url;
  }

  async createFolder(root: string, name: string): Promise<void> {
    await this.http.post<void>(`${this.base}/create-folder`, { root, name });
  }

  async copy(location: string): Promise<void> {
    await this.http.post<void>(`${this.base}/copy`, { location });
  }

  async rename(root: string, files: Array<{ from: string; to: string }>): Promise<void> {
    await this.http.put<void>(`${this.base}/rename`, { root, files });
  }

  async delete(root: string, files: string[]): Promise<void> {
    await this.http.post<void>(`${this.base}/delete`, { root, files });
  }

  async compress(
    root: string,
    files: string[],
    options?: { extension?: CompressionExtension; name?: string },
  ): Promise<FileObject> {
    return this.http.post<FileObject>(`${this.base}/compress`, {
      root,
      files,
      ...options,
    });
  }

  async decompress(root: string, file: string): Promise<void> {
    await this.http.post<void>(`${this.base}/decompress`, { root, file });
  }

  async chmod(root: string, files: Array<{ file: string; mode: string }>): Promise<void> {
    await this.http.post<void>(`${this.base}/chmod`, { root, files });
  }

  async pull(url: string, directory: string, filename?: string): Promise<void> {
    await this.http.post<void>(`${this.base}/pull`, {
      url,
      directory,
      ...(filename && { filename }),
    });
  }
}
