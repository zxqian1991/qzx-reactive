const syntaxJsx = require("@babel/plugin-syntax-jsx").default;
const htmlTags = require("html-tags");
const svgTags = require("svg-tags");
let id = 0;
module.exports = (babel) => {
  const t = babel.types;

  return {
    name: "babel-plugin-transform-que-jsx",
    inherits: syntaxJsx,
    visitor: {
      JSXElement: {
        exit(path) {
          // t.CallExpression('')
          path.replaceWith(transformJSXElement(t, path));
        },
      },
    },
  };
};

function transformJSXElement(t, path) {
  if (t.isJSXAttribute(path.container)) {
    throw new Error(
      `getAttributes (attribute value): ${path.type} is not supported`
    );
  }
  const jsxNode = path.node;
  const openingElement = jsxNode.openingElement;
  const node = openingElement.name;
  const tagName = node.name;
  const attributes = openingElement.attributes;
  const isNativeTag = htmlTags.includes(tagName) || svgTags.includes(tagName);
  const tag = isNativeTag ? t.stringLiteral(tagName) : t.identifier(tagName);
  const { key, attrs } = getAttribute(t, attributes);
  return t.callExpression(t.identifier("Lazyman.createElement"), [
    t.numericLiteral(++id),
    key || t.arrowFunctionExpression([], t.nullLiteral(), false),
    tag,
    attrs,
    getChildren(t, jsxNode.children),
  ]);
}

function getAttribute(t, attributes) {
  let key = undefined;
  const attrs = t.arrayExpression(
    attributes
      .map((attribute) => {
        if (attribute.type === "JSXAttribute") {
          if (attribute.name.name === "key") {
            // key也是一个functional的函数
            key = t.arrowFunctionExpression(
              [],
              attribute.value.expression,
              false
            );
            return null;
          }
          return t.objectExpression([
            t.objectProperty(
              t.stringLiteral("type"),
              t.stringLiteral("normal")
            ),
            t.objectProperty(
              t.stringLiteral("property"),
              t.stringLiteral(attribute.name.name)
            ),
            t.objectProperty(
              t.stringLiteral("value"),
              t.arrowFunctionExpression([], attribute.value.expression, false)
            ),
          ]);
        } else if (attribute.type === "JSXSpreadAttribute") {
          return t.objectExpression([
            t.objectProperty(t.stringLiteral("type"), t.stringLiteral("rest")),
            t.objectProperty(
              t.stringLiteral("value"),
              t.arrowFunctionExpression([], attribute.argument, false)
            ),
          ]);
        }
        return null;
      })
      .filter((i) => i)
  );
  return {
    key,
    attrs,
  };
}

function getChildren(t, children) {
  return t.arrayExpression(
    children
      .map((path) => {
        if (path.type === "JSXText") {
          return transformJSXText(t, path);
        }
        if (path.type === "JSXExpressionContainer") {
          return transformJSXExpressionContainer(t, path);
        }
        if (path.type === "JSXSpreadChild") {
          return transformJSXSpreadChild(t, path);
        }
        if (path.type === "CallExpression") {
          return path;
        }
        /* istanbul ignore next */
        throw new Error(`getChildren: ${path.type} is not supported`);
      })
      .filter((el) => el !== null && !t.isJSXEmptyExpression(el))
      .map((h) => t.arrowFunctionExpression([], h, false))
  );
}

const transformJSXText = (t, node) => {
  const lines = node.value.split(/\r\n|\n|\r/);

  let lastNonEmptyLine = 0;

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].match(/[^ \t]/)) {
      lastNonEmptyLine = i;
    }
  }

  let str = "";

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    const isFirstLine = i === 0;
    const isLastLine = i === lines.length - 1;
    const isLastNonEmptyLine = i === lastNonEmptyLine;

    // replace rendered whitespace tabs with spaces
    let trimmedLine = line.replace(/\t/g, " ");

    // trim whitespace touching a newline
    if (!isFirstLine) {
      trimmedLine = trimmedLine.replace(/^[ ]+/, "");
    }

    // trim whitespace touching an endline
    if (!isLastLine) {
      trimmedLine = trimmedLine.replace(/[ ]+$/, "");
    }

    if (trimmedLine) {
      if (!isLastNonEmptyLine) {
        trimmedLine += " ";
      }

      str += trimmedLine;
    }
  }

  return str !== "" ? t.stringLiteral(str) : null;
};

const transformJSXExpressionContainer = (t, path) => {
  return path.expression;
};
const transformJSXSpreadChild = (t, path) => t.spreadElement(path.expression);
