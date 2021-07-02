import Prism from "prismjs";
export default {
  name: "c-prism",
  props: {
    language: {
      type: String,
      default: "json"
    },
    code: {
      default: () => ""
    }
  },
  data() {
    return {};
  },
  watch: {},
  computed: {},
  created() {},
  methods: {},
  render() {
    const { language, code } = this.$props;
    const codeString = code instanceof String ? code : JSON.stringify(code);
    const rawHtml = Prism.highlight(
      codeString,
      Prism.languages[language],
      language
    );
    if (rawHtml === "") return <a-empty />;
    return (
      <pre className={`language-${language}`}>
        <code domPropsInnerHTML={rawHtml}></code>
      </pre>
    );
  }
};
