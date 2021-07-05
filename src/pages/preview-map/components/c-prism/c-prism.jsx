import Prism from "prismjs";
import tools from "./c-prism-tools";
export default {
  name: "c-prism",
  props: {
    language: {
      type: String,
      default: "json"
    },
    code: {
      default: () => ""
    },
    xml: {
      default: () => ""
    },
    hasTools: {
      type: Boolean,
      default: true
    },
    path: {
      type: String,
      default: "C:/"
    }
  },
  data() {
    return {};
  },
  watch: {},
  component: {
    tools
  },
  computed: {
    codeString: function() {
      return this.code instanceof String
        ? this.code
        : JSON.stringify(this.code);
    },
    xmlString: function() {
      return this.xml instanceof String ? this.xml : JSON.stringify(this.xml);
    }
  },
  created() {},
  methods: {},
  render() {
    const { language, path, code } = this.$props;
    const rawHtml = Prism.highlight(
      this.codeString,
      Prism.languages[language],
      language
    );
    if (!this.codeString) return <a-empty />;
    return (
      <pre class={`language-${language} preview-container`}>
        <tools
          path={path}
          json={this.codeString}
          xml={this.xmlString}
          fileName={code.layer}
        ></tools>
        <code domPropsInnerHTML={rawHtml}></code>
      </pre>
    );
  }
};
