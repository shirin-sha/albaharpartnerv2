/** Admin-only types for Home Page CMS */

export interface SectionData {
  sectionId: string;
  enabled: boolean;
  order: number;
  // Section shapes vary a lot (hero/about/process/etc). Keep this permissive
  // for admin editing, while the actual site types remain strict in `@/types/homepage`.
  ltr: any;
  rtl: any;
}

export interface SectionEditorProps {
  sectionId: string;
  section?: SectionData | null;
  onSave: (sectionId: string, data: Partial<SectionData>) => void | Promise<void>;
  isOpen: boolean;
  onToggle: () => void;
}

/** Form data shape used by section field components (permissive for form bindings) */
export interface SectionFormData {
  ltr: any;
  rtl: any;
}

export interface SectionFieldsProps {
  formData: SectionFormData;
  setFormData: React.Dispatch<React.SetStateAction<SectionFormData>>;
  updateField: (lang: 'ltr' | 'rtl', path: string, value: unknown) => void;
}

/** Section id to field component map (sectionId -> React component) */
export type SectionFieldComponent = React.ComponentType<SectionFieldsProps>;
