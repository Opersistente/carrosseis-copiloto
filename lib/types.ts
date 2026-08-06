export type PostStatus = "pending" | "generated" | "approved" | "published";

export type ContentType = "caso" | "informativo";

export type InputMaterial = {
  type: "file" | "link" | "pdf" | "text";
  text?: string;
  url?: string;
  fileUrl?: string;
  fileName?: string;
};

export type GeneratedContent = {
  slides: string[]; // 8 image URLs, Instagram carousel
  linkedinImageUrl: string;
  captionInstagram: string;
  captionLinkedin: string;
  generatedAt: string;
};

export type PublishRecord = {
  publishedAt: string;
  url: string;
};

export type Post = {
  id: string;
  title: string;
  status: PostStatus;
  contentType: ContentType;
  input: InputMaterial;
  presetId: string;
  createdAt: string;
  updatedAt: string;
  generated?: GeneratedContent;
  publish?: {
    instagram?: PublishRecord;
    linkedin?: PublishRecord;
  };
  notes?: string;
};

export type PresetColors = {
  background: string;
  primary: string;
  accent2: string;
  cta: string;
  text: string;
};

export type PresetTypography = {
  headingFont: string;
  bodyFont: string;
  headingSize: number; // px, slide 1 headline
  bodySize: number; // px, body paragraphs
};

export type Preset = {
  id: string;
  name: string;
  description: string;
  colors: PresetColors;
  typography: PresetTypography;
  guidance: {
    carrossel: string;
    linkedin: string;
  };
  createdAt: string;
  updatedAt: string;
};
