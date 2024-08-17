<template>
  <div class="web-global">
    <div class="flex flex-wrap gap-4 items-center choose-box">
      <div class="select">
        <el-select
          v-model="server"
          placeholder="Select"
          style="width: 200px; margin-left: 16px"
          @change="serverSwitch"
        >
          <el-option
            v-for="item in serverOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-select
          v-model="boss"
          placeholder="Select"
          style="width: 200px"
          @change="fetchPageData"
        >
          <el-option
            v-for="item in bossOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div class="select">
        <el-select
          v-model="count"
          placeholder="Select"
          style="width: 200px; margin-left: 16px"
          @change="fetchPageData"
        >
          <el-option
            v-for="item in countOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
    </div>

    <div class="content-init">
      <div class="echarts">
        <div
          ref="trynumberDistributionEchartsRef"
          style="margin: 8px; max-width: 750px; width: 100%"
        ></div>
      </div>
      <div class="echarts">
        <div
          ref="charaterUseEchartsRef"
          style="margin: 8px; max-width: 750px; width: 100%"
        ></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import axios from "axios";
import * as echarts from "echarts";
import { ref, onMounted, markRaw, watch, computed } from "vue";

const trynumberDistributionEchartsRef = ref<HTMLElement>(null as any);
const charaterUseEchartsRef = ref<HTMLElement>(null as any);

const server = ref("TW");
const boss = ref<number>();
const count = ref(10);
const serverOptions = ref([
  {
    value: "TW",
    label: "港澳台",
  },
  {
    value: "AS",
    label: "亚服",
  },
  {
    value: "NA",
    label: "北美服",
  },
  {
    value: "KR",
    label: "韩服",
  },
  {
    value: "GL",
    label: "全球服",
  },
]);
const countServerChoose = ref<{ [key: string]: any[] }>({
  AS: [
    { label: "前10名", value: 10 },
    { label: "前50名", value: 50 },
    { label: "前100名", value: 100 },
    { label: "前500名", value: 500 },
    { label: "前1000名", value: 1000 },
    { label: "前2000名", value: 2000 },
    { label: "前5000名", value: 5000 },
    { label: "前10000名", value: 10000 },
  ],
  GL: [
    { label: "前10名", value: 10 },
    { label: "前50名", value: 50 },
    { label: "前100名", value: 100 },
    { label: "前500名", value: 500 },
    { label: "前1000名", value: 1000 },
    { label: "前2000名", value: 2000 },
  ],
  KR: [
    { label: "前10名", value: 10 },
    { label: "前50名", value: 50 },
    { label: "前100名", value: 100 },
    { label: "前500名", value: 500 },
    { label: "前1000名", value: 1000 },
    { label: "前2000名", value: 2000 },
    { label: "前5000名", value: 5000 },
    { label: "前10000名", value: 10000 },
    { label: "前12000名", value: 12000 },
  ],
  NA: [
    { label: "前10名", value: 10 },
    { label: "前50名", value: 50 },
    { label: "前100名", value: 100 },
    { label: "前500名", value: 500 },
    { label: "前1000名", value: 1000 },
    { label: "前2000名", value: 2000 },
    { label: "前5000名", value: 5000 },
  ],
  TW: [
    { label: "前10名", value: 10 },
    { label: "前50名", value: 50 },
    { label: "前100名", value: 100 },
    { label: "前500名", value: 500 },
    { label: "前1000名", value: 1000 },
    { label: "前2000名", value: 2000 },
    { label: "前5000名", value: 5000 },
    { label: "前10000名", value: 10000 },
  ],
});
const countOptions = ref(countServerChoose.value[server.value]);
const bossOptions = ref<chooseBox[]>([]);

const CHARUSERichConfig = ref({});

async function richGetImg(backgroundUrl: URL, overlayUrl: URL) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const background = new Image();
  const overlay = new Image();
  background.src = backgroundUrl.href;
  overlay.src = overlayUrl.href;

  // 设置 canvas 大小
  canvas.width = 25;
  canvas.height = 20;

  // 在 canvas 上绘制背景图片
  background.onload = () => {
    ctx!.drawImage(background, 0, 0, canvas.width, canvas.height);
    // 在背景图片上叠加 overlay 图片
    overlay.onload = () => {
      ctx!.drawImage(overlay, 0, 0, canvas.width, canvas.height);
    };
  };
  return canvas;
}

async function getStudentImgId() {
  const fileList: string[] = [];
  const files = import.meta.glob("../assets/char/*.webp");
  const filesName = Object.keys(files).map((file) => {
    fileList.push(file.replace(/^.*\/(.*)\.\w+$/, "$1"));
  });
  const richConfigs: any = {};

  for (const fileId of fileList) {
    const imgUrl: HTMLCanvasElement = await richGetImg(
      new URL(`../assets/Student_Bg.webp`, import.meta.url),
      new URL(`../assets/char/${fileId}.webp`, import.meta.url)
    );
    richConfigs[fileId] = {
      height: 25,
      weight: 20,
      align: "center",
      backgroundColor: {
        image: imgUrl,
      },
    };
  }
  CHARUSERichConfig.value = richConfigs;
}

async function setTryNumDistriTrackChart() {
  const res = await axios.post<raidAnalysisDataResponse>(
    "https://bacrawl.diyigemt.com/api/v2/raid/AnalysisData",
    { server: server.value, seasonId: boss.value, count: count.value }
  );

  const tryNumberDistributionchart = markRaw(
    echarts.init(trynumberDistributionEchartsRef.value)
  );

  const hardTypes = Array.from(
    new Set(res.data.HardSummaries.map((item) => item.Hard))
  ).reverse();
  const maxTryTypes = Array.from(
    new Set(res.data.HardSummaries.map((item) => item.MaxTry))
  ).sort((a, b) => a - b);
  const option1: echarts.EChartsOption = {
    title: {
      text: "出刀分布",
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        // Use axis to trigger tooltip
        type: "shadow", // 'shadow' as default; can also be 'line' or 'shadow'
      },
      confine: true,
    },
    legend: {
      right: "left",
    },
    grid: {
      left: "3%",
      right: "3%",
      top: "8%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "value",
    },
    yAxis: {
      type: "category",
      data: hardTypes,
    },
    series: maxTryTypes.map((maxTry) => ({
      name: `${maxTry}刀`,
      type: "bar",
      stack: "total",
      label: {
        show: true,
      },
      emphasis: {
        focus: "series",
      },
      barWidth: "32px",
      data: hardTypes.map((hard) => {
        const item = res.data.HardSummaries.find(
          (d) => d.Hard === hard && d.MaxTry === maxTry
        );
        return item ? item.Count : 0;
      }),
    })),
  };
  tryNumberDistributionchart.clear();
  tryNumberDistributionchart.setOption(option1);
  tryNumberDistributionchart.resize({ height: hardTypes.length * 32 + 150 });

  const charaterUsechart = markRaw(echarts.init(charaterUseEchartsRef.value));

  const studentIdList = Array.from(
    new Set(res.data.CharacterSummaries.map((item) => item.UniqueId))
  );
  const isAssistList = [false, true];
  const option2: echarts.EChartsOption = {
    title: {
      text: "角色使用率",
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        // Use axis to trigger tooltip
        type: "shadow", // 'shadow' as default; can also be 'line' or 'shadow'
      },
      formatter: "{a0}: {c0}%<br />{a1}: {c1}%",
      confine: true,
    },
    legend: {
      right: "left",
    },
    grid: {
      left: "32px",
      right: "32px",
      top: "32px",
      bottom: "12px",
      containLabel: true,
    },
    xAxis: {
      type: "value",
    },
    yAxis: {
      type: "category",
      data: studentIdList,
      axisLabel: {
        formatter: function (value) {
          return "{" + value + "| }";
        },
        rich: {
          ...CHARUSERichConfig.value,
        },
      },
      inverse: true,
    },
    series: isAssistList.map((isAssist) => ({
      name: isAssist ? "借用率" : "自用率",
      type: "bar",
      stack: "total",
      label: {
        formatter: `{c}%`,
      },
      barWidth: "24px",
      data: studentIdList.map((studentId) => {
        const item = res.data.CharacterSummaries.find(
          (d) => d.UniqueId === studentId && d.IsAssist === isAssist
        );
        const number = item ? (item.CharacterCount / count.value) * 100 : 0;
        return number.toFixed(2);
      }),
    })),
  };
  charaterUsechart.clear();
  charaterUsechart.setOption(option2);
  charaterUsechart.resize({ height: studentIdList.length * 30 + 160 });
}

const bossNameMap: Record<string, string> = {
  Binah: "野外 Binah",
  Binah_Street: "市街 Binah",
  Chesed: "室内 Chesed",
  Chesed_Outdoor: "野外 Chesed",
  ShiroKuro: "市街 白＆黑",
  ShiroKuro_Indoor: "室内 白＆黑",
  Hieronymus: "室内 希罗尼穆斯",
  Hieronymus_Street: "市街 希罗尼穆斯",
  Kaitenger: "野外 KAITEN FX 0型",
  Kaitenger_Street: "市街 KAITEN FX 0型",
  Perorozilla: "室内 佩洛洛斯拉",
  Perorozilla_Outdoor: "野外 佩洛洛斯拉",
  HOD: "市街 Hod",
  HOD_Indoor: "室内 Hod",
  Goz: "室内 Goz",
  Goz_Outdoor: "野外 Goz",
  HoverCraft: "野外 灾厄之狐",
  EN0005: "室内 格里高利",
  EN0006: "市街 黑影",
};

const initBoss = async () => {
  const statusListResponse = await axios.post<RaidStatusList[]>(
    "https://bacrawl.diyigemt.com/api/v2/raid/statusList",
    { server: server.value }
  );
  bossOptions.value = statusListResponse.data.map((item) => ({
    value: item.SeasonId,
    label: `第${item.SeasonDisplayId}期 ${bossNameMap[item.BossName] || item.BossName}`, // 映射 BossName 并格式化 label
  }));
  boss.value = bossOptions.value.at(-1)?.value;
};

const serverSwitch = async () => {
  count.value = 10;
  countOptions.value = countServerChoose.value[server.value];
  fetchPageData();
};

const fetchPageData = async () => {
  try {
    await setTryNumDistriTrackChart();
  } catch (error) {
    console.error(error);
  }
};

onMounted(async () => {
  try {
    await initBoss();
    await getStudentImgId();
    await fetchPageData();
  } catch (error) {
    console.error(error);
  }
});
</script>

<style lang="scss" scoped>
.web-global {
  text-align: left;
  margin-left: 16px;
  margin-right: 16px;
  padding: 4px;
  width: 100%;
  max-width: 800px;
  // display: flex;
  // flex-direction: column;
  // align-items: center;

  .choose-box {
    /* background-color: white; */
    padding: 4px;
    /* height: 70px; */
    flex-direction: column;
    justify-content: space-around;
    align-items: center;

    .echarts {
      box-sizing: border-box;
      display: flex;
      width: 100%;
      height: 100%;
      max-width: 800px;
    }

    .select {
      display: flex;
      justify-content: space-evenly;
      flex-direction: row;
      flex-wrap: nowrap;
      width: 100%;
    }
  }
}

span {
  font-size: 14px;
}

.button {
  width: 100%;
  margin-top: 8px;
}

.content-header {
  text-align: center;
  margin-top: 20px;
  background-color: #344b6f;
  color: white;
  display: flex;
  /* 使 div 成为 flexbox 容器 */
  align-items: center;
  /* 垂直居中子元素 */
  justify-content: center;
  height: 24px;
}

.content-init {
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  margin-top: 8px;
  background-color: white;
  width: 100%;
  padding: 2px;
  max-width: 800px;
}

.scoreDistribute-slider {
  display: flex;
  justify-content: center; /* 水平居中 */
  margin: 0 60px; /* 设置容器的左右边距 */
}

.el-row {
  margin-bottom: 20px;
}

.el-row:last-child {
  margin-bottom: 0;
}

.el-col {
  border-radius: 4px;
}

.grid-content {
  display: flex;
  /* 使 div 成为 flexbox 容器 */
  align-items: center;
  /* 垂直居中子元素 */
  justify-content: center;
  padding: 4px;
  flex-direction: column;
}

.tier-icon {
  height: 40px;
  max-width: 100%;
}
</style>
