/**
 * Emits one or more JSON-LD graphs as `<script type="application/ld+json">`.
 *
 * Deliberately a plain server component with no `"use client"`: structured data
 * is read by crawlers from the HTML response, so shipping a component that
 * hydrates would cost client JavaScript for markup no user ever sees. Rendered
 * inside `<body>`, which the spec allows and Google explicitly supports.
 *
 * `dangerouslySetInnerHTML` is the only way to emit a raw JSON string here —
 * React would otherwise escape the quotes and produce invalid JSON-LD. The
 * `<` replacement closes the one real hole in that: a string value containing
 * `</script>` would terminate the block early and turn the rest of the payload
 * into parsed HTML. Every value on this site is authored copy, but the escape
 * costs nothing and the failure mode is markup injection.
 */
export function JsonLd({ schema }: { schema: object | object[] }) {
  const graphs = Array.isArray(schema) ? schema : [schema];

  return (
    <>
      {graphs.map((graph, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(graph).replace(/</g, "\\u003c"),
          }}
        />
      ))}
    </>
  );
}
