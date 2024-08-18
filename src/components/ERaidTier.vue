<template>
  <div class="web-global">
    <h2>大决战档线</h2>
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
          </div>
        </el-col>
      </el-row>
    </div>

    <div>
      <el-button type="primary" class="button" @click="queryTier"
        >查询档线</el-button
      >
    </div>
    <div><el-button class="button" @click="queryRank">查询排名</el-button></div>

    <div class="content-init">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="Rank" label="排名" width="160" />
        <el-table-column prop="BestRankingPoint" label="分数" />
        <el-table-column prop="LightArmor" label="轻型装甲" />
        <el-table-column prop="HeavyArmor" label="重型装甲" />
        <el-table-column prop="Unarmed" label="特殊装甲" />
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
import { ref, onMounted, markRaw } from "vue";
import { ElMessage } from "element-plus";

const tierEchartsRef = ref<HTMLElement>(null as any);
const server = ref("TW");
const boss = ref<number>();
const queryMode = ref(0);
const currentPage = ref(1);
const pageSize = ref(10); // 每页显示的条数
const totalItems = ref(0); // 总条数
const tableData = ref<tableDataDisplayERaid[]>([]);
const peopleCountEchartsRef = ref<HTMLElement>(null as any);

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
const tierDataDisplay = ref<SimpleData[]>([]);
const timestampDisplay = ref<string>("");

async function setTierTrackChart() {
  const trackRes = await axios.post<TierDataTrackResponse>(
    "https://bacrawl.diyigemt.com/api/v2/eraid/tierTrack",
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
      `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${date.toTimeString().slice(0, 8)}`
    );
    for (const [iData, key] of dataKeys.entries()) {
      dataList[iData].push(trackRes.data.Data.Value[key][i]);
    }
  }

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
      minInterval: 1000, //分割刻度
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

async function setPeopleCountTrackChart() {
  const peopleRes = await axios.post<TrackResponse>(
    "https://bacrawl.diyigemt.com/api/v2/eraid/peopleTrack",
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
    "https://bacrawl.diyigemt.com/api/v2/eraid/statusList",
    { server: server.value }
  );
  bossOptions.value = statusListResponse.data.map((item) => ({
    value: item.SeasonId,
    label: `第${item.SeasonDisplayId}期 ${bossNameMap[item.BossName] || item.BossName}`, // 映射 BossName 并格式化 label
  }));
  boss.value = bossOptions.value.at(-1)?.value;
};

const fetchTierData = async () => {
  try {
    const tierResponse = await axios.post<SimpleDataResponse>(
      "https://bacrawl.diyigemt.com/api/v2/eraid/tier",
      { server: server.value, seasonId: boss.value }
    );
    const tierData = tierResponse.data;
    tierDataDisplay.value = tierData.Data;
    timestampDisplay.value = new Date(tierData.Timestamp).toLocaleString();

    await fetchRankListChart();
    await setTierTrackChart();
    await setPeopleCountTrackChart();
  } catch (error) {
    console.error(error);
  }
};

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

onMounted(() => {
  initBoss();
  fetchTierData();
});

async function fetchRankListChart() {
  if (queryMode.value == 0) {
    const partialListResponse = await axios.post<simpleDataPagingResponseERaid>(
      "https://bacrawl.diyigemt.com/api/v2/eraid/partial_list",
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
      LightArmor: Intl.NumberFormat().format(
        item.BossGroup[2].BestRankingPoint
      ),
      HeavyArmor: Intl.NumberFormat().format(
        item.BossGroup[0].BestRankingPoint
      ),
      Unarmed: Intl.NumberFormat().format(item.BossGroup[1].BestRankingPoint),
    }));
    totalItems.value = partialListResponse.data.TotalCount;
  } else {
    const partialListResponse =
      await axios.post<complexDataPagingResponseERaid>(
        "https://bacrawl.diyigemt.com/api/v2/eraid/settle_list",
        {
          server: server.value,
          seasonId: boss.value,
          pageNumber: currentPage.value,
          pageSize: pageSize.value,
        }
      );
    const partialListData = partialListResponse.data;
    if (partialListData.Data.length === 0) {
      ElMessage.error("没有数据!");
    } else {
      tableData.value = partialListData.Data.map((item) => ({
        Rank: item.Rank,
        BestRankingPoint: Intl.NumberFormat().format(item.BestRankingPoint),
        LightArmor: Intl.NumberFormat().format(
          item.BossGroup[2].BestRankingPoint
        ),
        HeavyArmor: Intl.NumberFormat().format(
          item.BossGroup[0].BestRankingPoint
        ),
        Unarmed: Intl.NumberFormat().format(item.BossGroup[1].BestRankingPoint),
      }));
      totalItems.value = partialListResponse.data.TotalCount;
    }
  }
}

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
  max-width: 800px;
  width: 100%;
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
  height: auto;
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
