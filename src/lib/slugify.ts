export function slugify(text: string): string {
  // remove acentos e transforma em lowercase
  const normalizedTitle = text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
  // substitui espaços por traços
  const slug = normalizedTitle.replace(/\s+/g, '-')
  return slug
}
