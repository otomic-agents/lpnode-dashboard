export const customCompletions = [
    {
        label: "getLatestMetric",
        type: "function",
        info: "Get the latest value of the specified metric",
        detail: "(metricName: string, labels?: Record<string, any>, options?: { maxAgeSeconds?: number }) => number | null",
        apply: "getLatestMetric",
    },
    {
        label: "getLatestMetricWithTimestamp",
        type: "function",
        info: "Get the latest value of the specified metric with its timestamp",
        detail: "(metricName: string, labels?: Record<string, any>, options?: { maxAgeSeconds?: number }) => { value: number | null; timestamp: Date | null }",
        apply: "getLatestMetricWithTimestamp",
    },
    {
        label: "getMetrics",
        type: "function",
        info: "Get a collection of metric data within the specified time window",
        detail: "(metricName: string, labels?: Record<string, any>, timeWindow?: string | number) => any[]",
        apply: "getMetrics",
    },
    {
        label: "avgMetric",
        type: "function",
        info: "Calculate the average value of the metric within the specified time window",
        detail: "(metricName: string, labels?: Record<string, any>, timeWindow?: string | number) => number | null",
        apply: "avgMetric",
    },
    {
        label: "maxMetric",
        type: "function",
        info: "Get the maximum value of the metric within the specified time window",
        detail: "(metricName: string, labels?: Record<string, any>, timeWindow?: string | number) => number | null",
        apply: "maxMetric",
    },
    {
        label: "minMetric",
        type: "function",
        info: "Get the minimum value of the metric within the specified time window",
        detail: "(metricName: string, labels?: Record<string, any>, timeWindow?: string | number) => number | null",
        apply: "minMetric",
    },
    {
        label: "countMetrics",
        type: "function",
        info: "Count the number of metrics that meet the conditions within the specified time window",
        detail: "(metricName: string, labels?: Record<string, any>, timeWindow?: string | number, condition?: (metric: any) => boolean) => number",
        apply: "countMetrics",
    },

    // Logging and reporting functions
    {
        label: "log",
        type: "function",
        info: "Record log information",
        detail: "(message: string, data?: any) => void",
        apply: "log",
    },
    {
        label: "reportIssue",
        type: "function",
        info: "Report an issue or exception",
        detail: "(message: string, data?: any) => void",
        apply: "reportIssue",
    },

    // JavaScript keywords
    {
        label: "return",
        type: "keyword",
        info: "Return expression result",
        detail: "JavaScript return statement",
        apply: "return ",
    },
    {
        label: "const",
        type: "keyword",
        info: "Declare a constant",
        detail: "JavaScript constant declaration",
        apply: "const ",
    },
    {
        label: "let",
        type: "keyword",
        info: "Declare a variable",
        detail: "JavaScript variable declaration",
        apply: "let ",
    },
    {
        label: "if",
        type: "keyword",
        info: "Conditional statement",
        detail: "JavaScript if statement",
        apply: "if () {\n  \n}",
    },
    {
        label: "else",
        type: "keyword",
        info: "Alternative branch of conditional statement",
        detail: "JavaScript else statement",
        apply: "else {\n  \n}",
    },

    // Type conversion functions
    {
        label: "parseInt",
        type: "function",
        info: "Parse a string to an integer",
        detail: "(string: string, radix?: number) => number",
        apply: "parseInt",
    },
    {
        label: "parseFloat",
        type: "function",
        info: "Parse a string to a float",
        detail: "(string: string) => number",
        apply: "parseFloat",
    },
    {
        label: "String",
        type: "function",
        info: "Convert a value to string",
        detail: "(value: any) => string",
        apply: "String",
    },
    {
        label: "Number",
        type: "function",
        info: "Convert a value to number",
        detail: "(value: any) => number",
        apply: "Number",
    },
    {
        label: "Boolean",
        type: "function",
        info: "Convert a value to boolean",
        detail: "(value: any) => boolean",
        apply: "Boolean",
    },

    // Basic operators
    {
        label: "+",
        type: "operator",
        info: "Addition operator",
        detail: "Addition operator",
    },
    {
        label: "-",
        type: "operator",
        info: "Subtraction operator",
        detail: "Subtraction operator",
    },
    {
        label: "*",
        type: "operator",
        info: "Multiplication operator",
        detail: "Multiplication operator",
    },
    {
        label: "/",
        type: "operator",
        info: "Division operator",
        detail: "Division operator",
    },
    {
        label: "%",
        type: "operator",
        info: "Modulo operator",
        detail: "Modulo operator",
    },

    // Comparison operators
    {
        label: "==",
        type: "operator",
        info: "Equality operator",
        detail: "Equality operator",
    },
    {
        label: "===",
        type: "operator",
        info: "Strict equality operator",
        detail: "Strict equality operator",
    },
    {
        label: "!=",
        type: "operator",
        info: "Inequality operator",
        detail: "Inequality operator",
    },
    {
        label: "!==",
        type: "operator",
        info: "Strict inequality operator",
        detail: "Strict inequality operator",
    },
    {
        label: ">",
        type: "operator",
        info: "Greater than operator",
        detail: "Greater than operator",
    },
    {
        label: ">=",
        type: "operator",
        info: "Greater than or equal operator",
        detail: "Greater than or equal operator",
    },
    {
        label: "<",
        type: "operator",
        info: "Less than operator",
        detail: "Less than operator",
    },
    {
        label: "<=",
        type: "operator",
        info: "Less than or equal operator",
        detail: "Less than or equal operator",
    },

    // Logical operators
    {
        label: "&&",
        type: "operator",
        info: "Logical AND operator",
        detail: "Logical AND operator",
    },
    {
        label: "||",
        type: "operator",
        info: "Logical OR operator",
        detail: "Logical OR operator",
    },
    {
        label: "!",
        type: "operator",
        info: "Logical NOT operator",
        detail: "Logical NOT operator",
    },
    {
        label: "??",
        type: "operator",
        info: "Nullish coalescing operator",
        detail: "Nullish coalescing operator",
    }
];
