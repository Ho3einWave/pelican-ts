export interface FileObject {
  name: string;
  mode: string;
  mode_bits: string;
  size: number;
  is_file: boolean;
  is_symlink: boolean;
  mimetype: string;
  created_at: string;
  modified_at: string;
}

export interface SignedUrl {
  url: string;
}

export type CompressionExtension =
  | 'zip'
  | 'tgz'
  | 'tar.gz'
  | 'txz'
  | 'tar.xz'
  | 'tbz2'
  | 'tar.bz2';
