/** Admin types for Customer Care Center CMS */

export interface CccSectionData {
  sectionId: string;
  enabled: boolean;
  order: number;
  ltr: Record<string, unknown>;
  rtl: Record<string, unknown>;
}

export interface CccSectionEditorProps {
  sectionId: string;
  section?: CccSectionData | null;
  onSave: (sectionId: string, data: Partial<CccSectionData>) => void | Promise<void>;
  isOpen: boolean;
  onToggle: () => void;
}

export interface CccSectionFormData {
  ltr: Record<string, unknown>;
  rtl: Record<string, unknown>;
}

export interface CccSectionFieldsProps {
  formData: CccSectionFormData;
  setFormData: React.Dispatch<React.SetStateAction<CccSectionFormData>>;
  updateField: (lang: 'ltr' | 'rtl', path: string, value: unknown) => void;
}

export type CccSectionFieldComponent = React.ComponentType<CccSectionFieldsProps>;
