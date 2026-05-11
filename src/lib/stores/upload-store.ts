import { create } from "zustand"

interface UploadState {
  // Datos del archivo
  file: File | null
  isImageOnly: boolean
  
  // Metadatos
  title: string
  category: string
  linkedCourse: string
  abstract: string
  classificationTags: string[]
  keywords: string
  
  // Acciones para el archivo
  setFile: (file: File | null) => void
  setIsImageOnly: (value: boolean) => void
  
  // Acciones para metadatos
  setTitle: (value: string) => void
  setCategory: (value: string) => void
  setLinkedCourse: (value: string) => void
  setAbstract: (value: string) => void
  setClassificationTags: (tags: string[]) => void
  addTag: (tag: string) => void
  removeTag: (tag: string) => void
  setKeywords: (value: string) => void
  
  // Acciones generales
  reset: () => void
}

export const useUploadStore = create<UploadState>((set) => ({
  // Estado inicial
  file: null,
  isImageOnly: false,
  title: "",
  category: "",
  linkedCourse: "",
  abstract: "",
  classificationTags: ["Derecho Romano", "Obligaciones"],
  keywords: "",

  // Implementación de acciones
  setFile: (file) => set({ file }),
  setIsImageOnly: (isImageOnly) => set({ isImageOnly }),
  
  setTitle: (title) => set({ title }),
  setCategory: (category) => set({ category }),
  setLinkedCourse: (linkedCourse) => set({ linkedCourse }),
  setAbstract: (abstract) => set({ abstract }),
  setClassificationTags: (classificationTags) => set({ classificationTags }),
  
  addTag: (tag) => set((state) => ({
    classificationTags: state.classificationTags.includes(tag) 
      ? state.classificationTags 
      : [...state.classificationTags, tag]
  })),
  
  removeTag: (tag) => set((state) => ({
    classificationTags: state.classificationTags.filter((t) => t !== tag)
  })),
  
  setKeywords: (keywords) => set({ keywords }),

  reset: () => set({
    file: null,
    isImageOnly: false,
    title: "",
    category: "",
    linkedCourse: "",
    abstract: "",
    classificationTags: ["Derecho Romano", "Obligaciones"],
    keywords: "",
  }),
}))
