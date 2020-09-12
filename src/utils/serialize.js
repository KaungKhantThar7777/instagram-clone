import escapeHtml from "escape-html";
import { Text } from "slate";

const serialize = (node) => {
  if (Text.isText(node)) {
    return escapeHtml(node.text);
  }

  const children = node.children.map((n) => serialize(n)).join("");

  switch (node.type) {
    case "paragraph":
      return `${children}</br>`;
    default:
      return children;
  }
};

export default serialize;
