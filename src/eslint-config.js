import Handlebars from "handlebars";


export const getEslintConfig = (args) => {
  // const dependencies = getDependencies(argv);
  // console.log('options', getOptions(argv));
  // const options = JSON.parse(getOptions(argv));

  const template = Handlebars.compile(`
    
    
import js from "@eslint/js";
{{#if typescript}}
import tseslint from "typescript-eslint";
{{/if}}

export default [
  {
    "ignores": [
      ".netlify/**",
      "dist/**"
    ]
  },
  js.configs.recommended

  {{#if typescript}}

, ...tseslint.configs.recommended,
  {
    files: ["**/*.ts"],
    rules: {
      "@typescript-eslint/no-floating-promises": "error",
    },
    languageOptions: {
      parserOptions: {
        project: true,
      },
    },
  },

  {{/if}}
];

    
    
    
    `)

    // todo: run prettier on this
    return template(args)
  
  
}