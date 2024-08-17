<template>
  <div class="web-global">
    <h2>总力战档线</h2>
    <div class="flex flex-wrap gap-4 items-center choose-box">
      <div class="select">
        <el-select
          v-model="server"
          placeholder="Select"
          style="width: 200px; margin-left: 16px"
          @change="fetchTierData"
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
          @change="fetchTierData"
        >
          <el-option
            v-for="item in bossOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <span>更新时间:{{ timestampDisplay }}</span>
    </div>
    <div>
      <el-button type="primary" class="button" @click="queryTier"
        >查询档线</el-button
      >
    </div>
    <div><el-button class="button" @click="queryRank">查询排名</el-button></div>
    <div class="content-header"><span>各档线分数</span></div>
    <div class="content-init">
      <el-row>
        <el-col :span="8">
          <div class="grid-content">
            <img src="../assets/tier4.webp" class="tier-icon" alt="一档" />
            <span style="font-weight: bold">{{
              Intl.NumberFormat().format(
                tierDataDisplay[0]?.BestRankingPoint
              ) || "N/A"
            }}</span>
            <span style="font-style: italic"
              >{{ tierDataDisplay[0]?.Hard || "N/A" }}
              {{ tierDataDisplay[0]?.BattleTime || "N/A" }}</span
            >
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content">
            <img src="../assets/tier3.webp" class="tier-icon" alt="二档" />
            <span style="font-weight: bold">{{
              Intl.NumberFormat().format(
                tierDataDisplay[1]?.BestRankingPoint
              ) || "N/A"
            }}</span>
            <span style="font-style: italic"
              >{{ tierDataDisplay[1]?.Hard || "N/A" }}
              {{ tierDataDisplay[1]?.BattleTime || "N/A" }}</span
            >
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content">
            <img src="../assets/tier2.webp" class="tier-icon" alt="三档" />
            <span style="font-weight: bold">{{
              Intl.NumberFormat().format(
                tierDataDisplay[2]?.BestRankingPoint
              ) || "N/A"
            }}</span>
            <span style="font-style: italic"
              >{{ tierDataDisplay[2]?.Hard || "N/A" }}
              {{ tierDataDisplay[2]?.BattleTime || "N/A" }}</span
            >
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="content-header"><span>各难度最低排名</span></div>
    <div class="content-init">
      <el-row>
        <el-col :span="8">
          <div class="grid-content">
            <span style="font-weight: bold">Torment</span>
            <span>{{
              Intl.NumberFormat().format(hardLowestDataDisplay[0]?.Count) ||
              "N/A"
            }}</span>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content">
            <span style="font-weight: bold">Insane</span>
            <span>{{
              Intl.NumberFormat().format(hardLowestDataDisplay[1]?.Count) ||
              "N/A"
            }}</span>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content">
            <span style="font-weight: bold">Extreme</span>
            <span>{{
              Intl.NumberFormat().format(hardLowestDataDisplay[2]?.Count) ||
              "N/A"
            }}</span>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content">
            <span style="font-weight: bold">Hardcore</span>
            <span>{{
              Intl.NumberFormat().format(hardLowestDataDisplay[3]?.Count) ||
              "N/A"
            }}</span>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content">
            <span style="font-weight: bold">VeryHard</span>
            <span>{{
              Intl.NumberFormat().format(hardLowestDataDisplay[4]?.Count) ||
              "N/A"
            }}</span>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content">
            <span style="font-weight: bold">Hard</span>
            <span>{{
              Intl.NumberFormat().format(hardLowestDataDisplay[5]?.Count) ||
              "N/A"
            }}</span>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content">
            <span style="font-weight: bold">Normal</span>
            <span>{{
              Intl.NumberFormat().format(hardLowestDataDisplay[6]?.Count) ||
              "N/A"
            }}</span>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="content-init">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="Rank" label="排名" />
        <el-table-column prop="BestRankingPoint" label="分数" />
        <el-table-column prop="Hard" label="难度" />
        <el-table-column prop="BattleTime" label="用时" />
      </el-table>
      <el-pagination
        v-model:current-page="currentPage"
        background
        layout="prev, pager, next, jumper"
        :pager-count="3"
        :page-size="pageSize"
        :total="totalItems"
        @current-change="handlePageChange"
        style="justify-content: flex-end; margin-top: 16px"
      />
    </div>

    <div class="content-init">
      <div class="echarts">
        <div
          ref="tierEchartsRef"
          style="
            box-sizing: border-box;
            width: 100%;
            max-width: 800px;
            height: 500px;
            padding: 16px;
          "
        ></div>
      </div>
      <div class="echarts">
        <div
          ref="platinumEchartsRef"
          style="
            box-sizing: border-box;
            width: 100%;
            max-width: 800px;
            height: 500px;
            padding: 16px;
          "
        ></div>
      </div>
      <div class="scoreDistribute-slider">
        <el-slider
          v-model="platinumEchartsTimeIndex"
          :format-tooltip="formatScoreDistributeTimeTooltip"
          :max="platinumEchartsTimeIndexMax"
          @input="setRaidScoreDistributeTrackChart"
          :disabled="isSliderDisabled"
        />
      </div>
      <div class="echarts">
        <div
          ref="topRankCountRef"
          style="
            box-sizing: border-box;
            width: 100%;
            max-width: 800px;
            height: 500px;
            padding: 16px;
          "
        ></div>
      </div>
      <div class="echarts">
        <div
          ref="peopleCountEchartsRef"
          style="
            box-sizing: border-box;
            width: 100%;
            max-width: 800px;
            height: 500px;
            padding: 16px;
          "
        ></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import axios from "axios";
import * as echarts from "echarts";
import { ref, onMounted, computed, markRaw } from "vue";
import { ElMessage } from "element-plus";

const tierEchartsRef = ref<HTMLElement>(null as any);
const platinumEchartsRef = ref<HTMLElement>(null as any);
const platinumEchartsTimeIndex = ref<number>(0);
const platinumEchartsTimeIndexMax = ref<number>(0);
const platinumEchartsTimeList = ref<string[]>([]);
const platinumEchartsResponse = ref<RaidScoreDistributeResponse>();
const topRankCountRef = ref<HTMLElement>(null as any);
const peopleCountEchartsRef = ref<HTMLElement>(null as any);

const server = ref("TW");
const boss = ref<number>();
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
const bossOptions = ref<chooseBox[]>([]);
const queryMode = ref(0);
const tierDataDisplay = ref<SimpleData[]>([]);
const timestampDisplay = ref<string>("");
const hardLowestDataDisplay = ref<HardCountData[]>([]);
const tableData = ref<tableDataDisplay[]>([]);
const currentPage = ref(1);
const pageSize = ref(10); // 每页显示的条数
const totalItems = ref(0); // 总条数

async function setTierTrackChart() {
  const trackRes = await axios.post<TierDataTrackResponse>(
    "https://bacrawl.diyigemt.com/api/v2/raid/tierTrack",
    { server: server.value, seasonId: boss.value }
  );

  const chart = markRaw(echarts.init(tierEchartsRef.value));

  const dateList: string[] = [];
  const dataKeys = Object.keys(trackRes.data.Data.Value);
  const dataList = Array.from(
    { length: dataKeys.length },
    () => [] as number[]
  );

  for (const [i, ts] of trackRes.data.Data.Key.entries()) {
    const date = new Date(ts);
    dateList.push(
      `${date.getMonth() + 1}/${date.getDate()} ${date.toTimeString().slice(0, 5)}`
    );
    // console.log(i, ts);
    for (const [iData, key] of dataKeys.entries()) {
      dataList[iData].push(trackRes.data.Data.Value[key][i]);
    }
  }
  // console.log(dateList, dataKeys, dataList);

  const option: echarts.EChartsOption = {
    title: {
      text: "档线趋势",
    },
    tooltip: {
      trigger: "axis",
    },
    legend: {
      data: dataKeys,
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
      type: "category",
      boundaryGap: false,
      data: dateList,
    },
    yAxis: {
      type: "value",
      scale: true,
    },
    dataZoom: [
      {
        type: "slider",
        xAxisIndex: 0,
        filterMode: "none",
      },
      {
        type: "slider",
        yAxisIndex: 0,
        filterMode: "none",
      },
      {
        type: "inside",
        xAxisIndex: 0,
        filterMode: "none",
      },
      {
        type: "inside",
        yAxisIndex: 0,
        filterMode: "none",
      },
    ],
    series: dataList.map((v, i) => ({
      name: `${dataKeys[i]}`,
      type: "line",
      symbol: "none",
      data: v,
      lineStyle: { width: 3 },
    })),
  };
  chart.clear();
  chart.setOption(option);
}

async function getRaidScoreDistributeTime() {
  const trackRes = await axios.post<RaidScoreDistributeResponse>(
    "https://bacrawl.diyigemt.com/api/v2/raid/scoreDistributeTrack",
    { server: server.value, seasonId: boss.value }
  );
  platinumEchartsTimeIndex.value = trackRes.data.Data.Key.length - 1;
  platinumEchartsTimeIndexMax.value = trackRes.data.Data.Key.length - 1;
  for (const [i, ts] of trackRes.data.Data.Key.entries()) {
    const date = new Date(ts);
    platinumEchartsTimeList.value.push(
      `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${date.toTimeString().slice(0, 8)}`
    );
  }
  platinumEchartsResponse.value = trackRes.data;
}

function formatScoreDistributeTimeTooltip(val: number) {
  return platinumEchartsTimeList.value[val];
}

const isSliderDisabled = computed(
  () => platinumEchartsTimeIndexMax.value === 0
);

async function setRaidScoreDistributeTrackChart() {
  const chart = markRaw(echarts.init(platinumEchartsRef.value));

  const dateList: string[] = [];
  // const dataKeys = Object.keys(trackRes.data.Data.Value);
  const dataList = platinumEchartsResponse.value!.Data.Value;

  for (const [i, ts] of platinumEchartsResponse.value!.Data.Key.entries()) {
    const date = new Date(ts);
    dateList.push(
      `${date.getMonth() + 1}/${date.getDate()} ${date.toTimeString().slice(0, 5)}`
    );
  }

  const yAxisData = dataList[platinumEchartsTimeIndex.value].map(
    (item) => `${item.Hard} | ${item.Time}`
  );

  const option: echarts.EChartsOption = {
    title: {
      text: "一档分数分布",
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        // Use axis to trigger tooltip
        type: "shadow", // 'shadow' as default; can also be 'line' or 'shadow'
      },
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
      data: yAxisData,
    },
    dataZoom: [
      {
        type: "slider",
        yAxisIndex: 0,
        filterMode: "none",
      },
      {
        type: "inside",
        yAxisIndex: 0,
        filterMode: "none",
      },
    ],
    series: {
      name: "人数",
      type: "bar",
      label: {
        show: true,
        position: "right",
      },
      data: dataList[platinumEchartsTimeIndex.value].map((b) => b.Number),
    },
  };
  chart.clear();
  chart.setOption(option);
}

async function setTopRankCountTrackChart() {
  const trackRes = await axios.post<TrackResponse>(
    "https://bacrawl.diyigemt.com/api/v2/raid/topRankTrack",
    { server: server.value, seasonId: boss.value }
  );

  const chart = markRaw(echarts.init(topRankCountRef.value));

  const dateList: string[] = [];
  // const dataKeys = Object.keys(trackRes.data.Data.Value);
  const dataList = trackRes.data.Data.Value;

  for (const [i, ts] of trackRes.data.Data.Key.entries()) {
    const date = new Date(ts);
    dateList.push(
      `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${date.toTimeString().slice(0, 8)}`
    );
  }

  const dataGrowth = [];
  dataGrowth.push(null);
  for (let i = 0; i < trackRes.data.Data.Value.length - 1; i++) {
    dataGrowth.push(dataList[i + 1] - dataList[i]);
  }

  const option: echarts.EChartsOption = {
    title: {
      text: "最高难度人数趋势",
    },
    tooltip: {
      trigger: "axis",
    },
    legend: {
      data: ["最高难度人数", "增长量"],
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
      type: "category",
      boundaryGap: false,
      data: dateList,
    },
    yAxis: {
      type: "value",
      scale: true,
    },
    dataZoom: [
      {
        type: "slider",
        xAxisIndex: 0,
        filterMode: "none",
      },
      {
        type: "slider",
        yAxisIndex: 0,
        filterMode: "none",
      },
      {
        type: "inside",
        xAxisIndex: 0,
        filterMode: "none",
      },
      {
        type: "inside",
        yAxisIndex: 0,
        filterMode: "none",
      },
    ],
    series: [
      {
        name: "最高难度人数",
        type: "line",
        symbol: "none",
        data: dataList,
        lineStyle: { width: 3 },
      },
      {
        name: "增长量",
        type: "line",
        symbol: "none",
        data: dataGrowth,
        lineStyle: { width: 3 },
      },
    ],
  };
  chart.clear();
  chart.setOption(option);
}

async function setPeopleCountTrackChart() {
  const peopleRes = await axios.post<TrackResponse>(
    "https://bacrawl.diyigemt.com/api/v2/raid/peopleTrack",
    { server: server.value, seasonId: boss.value }
  );

  const chart = markRaw(echarts.init(peopleCountEchartsRef.value));

  const dateList: string[] = [];
  const dataList = peopleRes.data.Data.Value;

  for (const [i, ts] of peopleRes.data.Data.Key.entries()) {
    const date = new Date(ts);
    dateList.push(
      `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${date.toTimeString().slice(0, 8)}`
    );
  }

  const dataGrowth = [];
  dataGrowth.push(null);
  for (let i = 0; i < peopleRes.data.Data.Value.length - 1; i++) {
    dataGrowth.push(dataList[i + 1] - dataList[i]);
  }

  const option: echarts.EChartsOption = {
    title: {
      text: "参与人数趋势",
    },
    tooltip: {
      trigger: "axis",
    },
    legend: {
      data: ["参与人数", "增长量"],
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
      type: "category",
      boundaryGap: false,
      data: dateList,
    },
    yAxis: {
      type: "value",
      scale: true,
    },
    dataZoom: [
      {
        type: "slider",
        xAxisIndex: 0,
        filterMode: "none",
      },
      {
        type: "slider",
        yAxisIndex: 0,
        filterMode: "none",
      },
      {
        type: "inside",
        xAxisIndex: 0,
        filterMode: "none",
      },
      {
        type: "inside",
        yAxisIndex: 0,
        filterMode: "none",
      },
    ],
    series: [
      {
        name: "参与人数",
        type: "line",
        symbol: "none",
        data: dataList,
        lineStyle: { width: 3 },
      },
      {
        name: "增长量",
        type: "line",
        symbol: "none",
        data: dataGrowth,
        lineStyle: { width: 3 },
      },
    ],
  };
  chart.clear();
  chart.setOption(option);
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

async function fetchRankListChart() {
  if (queryMode.value == 0) {
    const partialListResponse = await axios.post<ComplexDataPagingResponse>(
      "https://bacrawl.diyigemt.com/api/v2/raid/partial_list",
      {
        server: server.value,
        seasonId: boss.value,
        pageNumber: currentPage.value,
        pageSize: pageSize.value,
      }
    );
    const partialListData = partialListResponse.data;
    tableData.value = partialListData.Data.map((item) => ({
      Rank: item.Rank,
      BestRankingPoint: Intl.NumberFormat().format(item.BestRankingPoint),
      Hard: item.Hard,
      BattleTime: item.BattleTime,
    }));
    totalItems.value = partialListResponse.data.TotalCount;
  } else {
    const partialListResponse = await axios.post<ComplexDataPagingResponse>(
      "https://bacrawl.diyigemt.com/api/v2/raid/settle_list",
      {
        server: server.value,
        seasonId: boss.value,
        pageNumber: currentPage.value,
        pageSize: pageSize.value,
      }
    );
    const partialListData = partialListResponse.data;
    if ((partialListData.Data = [])) {
      ElMessage.error("没有数据!");
    }
    tableData.value = partialListData.Data.map((item) => ({
      Rank: item.Rank,
      BestRankingPoint: Intl.NumberFormat().format(item.BestRankingPoint),
      Hard: item.Hard,
      BattleTime: item.BattleTime,
    }));
    totalItems.value = partialListResponse.data.TotalCount;
  }
}

const fetchTierData = async () => {
  try {
    const tierResponse = await axios.post<SimpleDataResponse>(
      "https://bacrawl.diyigemt.com/api/v2/raid/tier",
      { server: server.value, seasonId: boss.value }
    );
    const tierData = tierResponse.data;
    tierDataDisplay.value = tierData.Data;
    timestampDisplay.value = new Date(tierData.Timestamp).toLocaleString();

    const hardLowestResponse = await axios.post<HardCountResponse>(
      "https://bacrawl.diyigemt.com/api/v2/raid/hard_people",
      { server: server.value, seasonId: boss.value }
    );
    const hardLowestData = hardLowestResponse.data;
    hardLowestDataDisplay.value = hardLowestData.Data;

    await fetchRankListChart();
    await setTierTrackChart();
    await getRaidScoreDistributeTime();
    await setRaidScoreDistributeTrackChart();
    await setTopRankCountTrackChart();
    await setPeopleCountTrackChart();
  } catch (error) {
    console.error(error);
  }
};

onMounted(() => {
  initBoss();
  fetchTierData();
});

const queryTier = () => {
  queryMode.value = 0;
  currentPage.value = 1;
  fetchRankListChart();
};
const queryRank = () => {
  queryMode.value = 1;
  currentPage.value = 1;
  fetchRankListChart();
};

const handlePageChange = (page: number) => {
  currentPage.value = page;
  fetchRankListChart();
};
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
