type AdminSectionPlaceholderProps = {
  title: string
  description: string
}

export function AdminSectionPlaceholder({ title, description }: AdminSectionPlaceholderProps) {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4 p-8">
      <h1 className="text-2xl font-bold text-[#00315C]">{title}</h1>
      <p className="text-sm text-gray-600 italic">{description}</p>
      <p className="rounded-md border border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-center text-sm text-gray-500">
        Esta sección estará disponible en una próxima fase.
      </p>
    </div>
  )
}
