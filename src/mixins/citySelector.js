import { initCityList } from "@/api/commonAPI";

const citySelector = {
  name: "citySelecter",
  data() {
    return {
      citys: [],
      center: [120.619585, 31.299379]
    };
  },
  watch: {},
  computed: {},
  created() {
    initCityList().then(res => (this.citys = res));
  },
  methods: {
    // 城市选择
    changeCity(value, selectedOptions) {
      if (selectedOptions?.length > 0) this.center = selectedOptions[1]?.center;
    },

    // 中心点搜索
    filter(inputValue, path) {
      return path.some(
        option =>
          option.name.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
      );
    }
  }
};

export default citySelector;
