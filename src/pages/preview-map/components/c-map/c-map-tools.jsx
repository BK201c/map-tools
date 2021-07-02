export default {
  name: "",
  props: {
    layerSource: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      radioStyle: {
        display: "block",
        height: "30px",
        lineHeight: "30px"
      },
      selectedLayerId: ""
    };
  },
  watch: {},
  computed: {},
  created() {},
  methods: {
    changeLayer(e) {
      console.log(e);
      this.selectedLayerId = e.target.value;
      const [source] = this.layerSource.filter(
        source => source.layer === this.selectedLayerId
      );
      this.$emit("change", source);
    }
  },
  render() {
    const { layerSource } = this.$props;
    this.selectedLayerId = layerSource[0]?.layer;
    const radios = layerSource.map(({ layer }) => (
      <a-radio key={layer} style={this.radioStyle} value={layer}>
        {layer}
      </a-radio>
    ));

    return (
      <div className="map-tools">
        <h2>图层</h2>
        <a-radio-group value={this.selectedLayerId} onChange={this.changeLayer}>
          {radios}
        </a-radio-group>
      </div>
    );
  }
};
