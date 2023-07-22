// Enable inline css imports in .ts f iles
declare module "*.css?inline" {
  const content: string;
  export default content;
}
