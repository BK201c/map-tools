<template>
  <a-cascader
    :field-names="{
      label: 'name',
      value: 'adcode',
      children: 'children',
    }"
    :options="citys"
    :show-search="{ filter }"
    v-model:value="position"
    placeholder="搜索或选择中心点"
    @change="change"
  />
</template>

<script lang="ts" setup>
import { reactive, toRefs } from "@vue/reactivity";
import location from "@/assets/json/location.json";
interface city {
  adcode: number;
  name: string;
  center: number[];
  children?: city[];
  [key: string]: any;
}
const citys: city[] = location;

const { center, position } = toRefs(
  reactive({
    center: [120.619585,31.299379],
    position: [320000, 320500],
  })
);

// 过滤
const filter = (inputValue: string, path: city[]) => {
  return path.some(
    (option) =>
      option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
  );
};

const emit = defineEmits(["change"]);

const change = (value:any, selectedOptions:city): void => {
  if (selectedOptions?.length > 0) center.value = selectedOptions[1]?.center;
  emit("change", center.value);
};
</script>

<style lang="scss" scoped></style>
