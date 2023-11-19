export default function splitCamel(val) {
  if (typeof val === "string")
    return val.replace(/([a-z0-9])([A-Z])/g, "$1 $2");
}
