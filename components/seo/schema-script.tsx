import Script from "next/script";

interface SchemaScriptProps {
  schema: object;
}

export function SchemaScript({ schema }: SchemaScriptProps) {
  return (
    <Script
      id="schema-markup"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema),
      }}
    />
  );
}
