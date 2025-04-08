
export function getAttributeColor(attribute) {
    switch (attribute) {
      case "木":
        return "bg-green-400 text-white";
      case "水":
        return "bg-blue-400 text-white";
      case "火":
        return "bg-red-400 text-white";
      default:
        return "bg-gray-300 text-black";
    }
  }
  