'use client';

import ImageUpload from '@/components/admin/ui/ImageUpload';

type Props = {
  value: string;
  onChange: (value: string) => void;
  folder?: string;
};

/** Shared CMS control for page-title / breadcrumb banner background. */
export default function PageHeaderBackgroundField({
  value,
  onChange,
  folder = 'page-headers',
}: Props) {
  return (
    <div className="form-group">
      <ImageUpload
        label="Breadcrumb background image"
        value={value}
        onChange={onChange}
        folder={folder}
        helperText="Recommended: 1920 × 600 px (JPEG, PNG, or WebP). Leave empty to use the default theme image."
      />
    </div>
  );
}
