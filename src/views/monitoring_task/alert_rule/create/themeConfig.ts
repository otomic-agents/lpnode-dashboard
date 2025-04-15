export const themeConfig = {
    "&": {
        height: "200px",
        overflow: "auto",
        backgroundColor: "#ffffff",
        fontSize: "14px",
        fontFamily: "SFMono-Regular, Consolas, 'Liberation Mono', Menlo, monospace"
    },
    ".cm-content": {
        color: "#24292e"  // GitHub's primary text color
    },
    ".cm-cursor": {
        borderLeftColor: "#044289",
        borderLeftWidth: "2px"
    },
    ".cm-activeLine": {
        backgroundColor: "#f6f8fa"  // GitHub's active line background color
    },
    ".cm-gutters": {
        backgroundColor: "#f6f8fa",
        color: "#6a737d",  // GitHub's secondary text color
        border: "none",
        borderRight: "1px solid #e1e4e8"
    },
    ".cm-activeLineGutter": {
        backgroundColor: "#e1e4e8",
        color: "#24292e",
        fontWeight: "600"
    },
    ".cm-selectionMatch": {
        backgroundColor: "#c8e1ff"  // GitHub's selection match highlight
    },
    ".cm-matchingBracket, .cm-nonmatchingBracket": {
        backgroundColor: "#c8e1ff",
        color: "#24292e",
        fontWeight: "bold"
    },
    // Syntax highlighting
    ".cm-keyword": { color: "#d73a49" },  // Keywords like if, function etc
    ".cm-operator": { color: "#d73a49" },  // Operators
    ".cm-variable": { color: "#24292e" },  // Variables
    ".cm-variable-2": { color: "#005cc5" },  // Special variables
    ".cm-def": { color: "#6f42c1" },  // Definitions
    ".cm-number": { color: "#005cc5" },  // Numbers
    ".cm-property": { color: "#005cc5" },  // Properties
    ".cm-string": { color: "#032f62" },  // Strings
    ".cm-string-2": { color: "#032f62" },  // Special strings
    ".cm-comment": { color: "#6a737d" },  // Comments
    ".cm-tag": { color: "#22863a" },  // HTML/XML tags
    ".cm-attribute": { color: "#6f42c1" },  // HTML/XML attributes
    ".cm-meta": { color: "#24292e" },  // Meta information
    ".cm-builtin": { color: "#6f42c1" },  // Built-in functions
    ".cm-qualifier": { color: "#6f42c1" },  // Qualifiers
    ".cm-atom": { color: "#005cc5" },  // Atomic values like true, false

    // Autocomplete styling
    ".cm-tooltip": {
        border: "1px solid #e1e4e8",
        backgroundColor: "#ffffff",
        borderRadius: "6px",
        boxShadow: "0 1px 5px rgba(27, 31, 35, 0.15)"
    },
    ".cm-tooltip.cm-tooltip-autocomplete": {
        "& > ul": {
            maxHeight: "200px",
            fontFamily: "SFMono-Regular, Consolas, 'Liberation Mono', Menlo, monospace",
            fontSize: "14px"
        },
        "& > ul > li": {
            padding: "6px 10px",
            borderBottom: "1px solid #f1f1f1"
        },
        "& > ul > li:last-child": {
            borderBottom: "none"
        },
        "& > ul > li[aria-selected]": {
            backgroundColor: "#f6f8fa",
            color: "#0366d6",
            fontWeight: "500"
        }
    },
    ".cm-completionLabel": {
        color: "#24292e"
    },
    ".cm-completionDetail": {
        color: "#6a737d",
        fontSize: "12px",
        marginLeft: "8px"
    },
    ".cm-completionInfo": {
        padding: "10px",
        marginTop: "4px",
        borderTop: "1px solid #e1e4e8",
        backgroundColor: "#f6f8fa",
        color: "#24292e",
        fontSize: "13px",
        lineHeight: "1.5"
    },
    ".cm-autocomplete-type": {
        color: "#0366d6",
        fontSize: "12px",
        marginLeft: "8px",
        fontWeight: "500"
    },

    // Search highlighting
    ".cm-searchMatch": {
        backgroundColor: "#ffdf5d",
        outline: "1px solid #ffdf5d"
    },
    ".cm-searchMatch.cm-searchMatch-selected": {
        backgroundColor: "#ffb800",
        outline: "1px solid #ffb800"
    },

    // Errors and warnings
    ".cm-lint-marker-error": {
        backgroundImage: "url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 16 16\"><path fill=\"%23d73a49\" d=\"M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 14c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6zm2-9H6v5h4V5z\"/></svg>')"
    },
    ".cm-lint-marker-warning": {
        backgroundImage: "url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 16 16\"><path fill=\"%23f9c513\" d=\"M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 14c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6zm0-9c-.6 0-1 .4-1 1v3c0 .6.4 1 1 1s1-.4 1-1V6c0-.6-.4-1-1-1zm0 6c-.6 0-1 .4-1 1s.4 1 1 1 1-.4 1-1-.4-1-1-1z\"/></svg>')"
    },

    // Folding indicators
    ".cm-foldPlaceholder": {
        backgroundColor: "#f6f8fa",
        border: "1px solid #e1e4e8",
        color: "#6a737d",
        borderRadius: "3px",
        padding: "0 4px",
        margin: "0 2px"
    }
}
