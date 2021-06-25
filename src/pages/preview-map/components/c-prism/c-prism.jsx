import Prism from "prismjs";
export default {
  name: "c-prism",
  props: {
    language: {
      type: String,
      default: "json"
    },
    code: {
      type: String,
      default: ""
    }
  },
  data() {
    return {};
  },
  watch: {},
  computed: {},
  created() {
    console.log(this.$props.code);
  },
  methods: {},
  render() {
    const { language, code } = this.$props;
    const rawHtml = Prism.highlight(code, Prism.languages[language], language);
    if (rawHtml === "") return <a-empty />;
    return (
      <pre className={`language-${language}`}>
        <code domPropsInnerHTML={rawHtml}></code>
      </pre>
    );
  }
};
