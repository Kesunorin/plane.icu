<template>
  <div class="web-global">
    <h2>好友查询</h2>
    <div class="content-init">
      <div>
        <el-form
          :model="form"
          label-width="auto"
          style="max-width: 100%; padding: 16px"
        >
          <el-form-item>
            <el-row :gutter="16">
              <el-col :span="12">
                <el-select v-model="form.server" placeholder="Select">
                  <el-option
                    v-for="item in serverOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-col>
              <el-col :span="12">
                <el-input v-model="form.friendCode" />
              </el-col>
              <span>因为是在线查询，需要一点时间，缓存有效期5分钟</span>
            </el-row>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="onSubmit"
              v-loading.fullscreen.lock="fullscreenLoading"
              element-loading-background="rgba(244, 244, 244, 0.8)"
              element-loading-text="因为是在线查询，需要一点时间"
              >查询好友码</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="content-init" v-if="result">
      <div style="display: flex; padding: 16px">
        <el-space wrap>
          <span style="font-size: smaller; font-weight: bold"
            >好友数量: {{ friendCount }}/30 角色数量:
            {{ characterCount }} 竞技场排名:{{ arenaRanking }} 总力战排名:{{
              raidRanking
            }}
            大决战排名:{{ eRaidRanking }}</span
          >
        </el-space>
      </div>
      <div v-for="item in tableDataGroupDisplay">
        <el-table
          :data="item"
          style="max-width: 600px; font-weight: bold"
          :header-cell-style="TypeHeaderStyle"
        >
          <el-table-column
            align="center"
            min-width="64px"
            :label="EchelonType[item[0].EchelonType]"
          >
            <template v-slot="scope">
              <div class="image-container">
                <img
                  src="../assets/Student_Bg.webp"
                  style="width: 100%; height: 100%; top: 0; left: 0"
                />
                <img
                  :src="scope.row.ImgUrl"
                  alt="Image"
                  style="
                    position: absolute;
                    width: 100%;
                    height: auto;
                    top: 0;
                    left: 0;
                    z-index: 1;
                  "
                />
                <img
                  :src="scope.row.StudentStarImgUrl"
                  alt="Image"
                  style="
                    position: absolute;
                    width: auto;
                    max-height: 20px;
                    left: 0;
                    bottom: 0;
                    z-index: 2;
                    margin-bottom: 4px;
                  "
                />
                <img
                  v-if="scope.row.WeaponStarImgUrl"
                  :src="scope.row.WeaponStarImgUrl"
                  alt="Image"
                  style="
                    position: absolute;
                    width: auto;
                    max-height: 20px;
                    left: 0;
                    bottom: 0;
                    z-index: 3;
                    margin-bottom: 4px;
                  "
                />
                <img
                  src="../assets/Favor.png"
                  alt="Image"
                  style="
                    position: absolute;
                    width: auto;
                    max-height: 28px;
                    right: 0;
                    bottom: 0;
                    z-index: 4;
                  "
                />
                <span
                  style="
                    position: absolute;
                    top: 0;
                    left: 0;
                    z-index: 5;
                    font-size: 11px;
                    font-weight: bold;
                    margin-left: 9px;
                    text-shadow:
                      -1px -1px 0 #fff,
                      1px -1px 0 #fff,
                      -1px 1px 0 #fff,
                      1px 1px 0 #fff;
                  "
                  >Lv.{{ scope.row.StudentLevel }}</span
                >
                <span
                  style="
                    position: absolute;
                    bottom: 0;
                    right: 0;
                    z-index: 6;
                    font-size: 11px;
                    font-weight: bold;
                    margin-right: 7px;
                    margin-bottom: 2px;
                    text-shadow:
                      -1px -1px 0 #fff,
                      1px -1px 0 #fff,
                      -1px 1px 0 #fff,
                      1px 1px 0 #fff;
                  "
                  >{{ scope.row.StudentFavorRank }}</span
                >
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            class="custom-table"
            min-width="160px"
          >
            <template v-slot="scope">
              <el-table :data="[scope.row]" border>
                <el-table-column
                  prop="StudentEX"
                  label="EX"
                  min-width="40px"
                  align="center"
                >
                </el-table-column>
                <el-table-column
                  prop="StudentNS"
                  label="NS"
                  min-width="40px"
                  align="center"
                >
                </el-table-column>
                <el-table-column
                  prop="StudentPS"
                  label="PS"
                  min-width="40px"
                  align="center"
                >
                </el-table-column>
                <el-table-column
                  prop="StudentSS"
                  label="SS"
                  min-width="40px"
                  align="center"
                >
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column align="center" min-width="120px">
            <template v-slot="scope">
              <el-table
                :data="[scope.row]"
                :header-cell-style="equipmentHeaderStyle"
                class="custom-table"
                border
              >
                <el-table-column
                  prop="equipment1Level"
                  min-width="40px"
                  align="center"
                  label="装备等级"
                >
                </el-table-column>
                <el-table-column
                  prop="equipment2Level"
                  min-width="40px"
                  align="center"
                >
                </el-table-column>
                <el-table-column
                  prop="equipment3Level"
                  min-width="40px"
                  align="center"
                >
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column align="center">
            <template v-slot="scope">
              <el-table
                v-if="scope.row.WeaponStar"
                :data="[scope.row]"
                :header-cell-style="weaponHeaderStyle"
                class="custom-table"
              >
                <el-table-column
                  prop="WeaponStarImgUrl"
                  min-width="40px"
                  align="center"
                  label="专武"
                >
                  <template v-slot="scope">
                    <div class="image-container">
                      <img
                        :src="scope.row.WeaponStarImgUrl"
                        style="width: 100%; height: 100%; top: 0; left: 0"
                      />
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="WeaponLevel"
                  min-width="40px"
                  align="center"
                >
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- <el-table
        :data="tableData"
        style="max-width: 600px; font-weight: bold"
        :show-header="false"
      >
        <el-table-column align="center" min-width="64px">
          <template v-slot="scope">
            <div class="image-container">
              <img
                src="/src/assets/Student_Bg.webp"
                style="width: 100%; height: 100%; top: 0; left: 0"
              />
              <img
                :src="scope.row.ImgUrl"
                alt="Image"
                style="
                  position: absolute;
                  width: 100%;
                  height: auto;
                  top: 0;
                  left: 0;
                  z-index: 1;
                "
              />
              <img
                :src="scope.row.StudentStarImgUrl"
                alt="Image"
                style="
                  position: absolute;
                  width: auto;
                  max-height: 20px;
                  left: 0;
                  bottom: 0;
                  z-index: 2;
                  margin-bottom: 4px;
                "
              />
              <img
                v-if="scope.row.WeaponStarImgUrl"
                :src="scope.row.WeaponStarImgUrl"
                alt="Image"
                style="
                  position: absolute;
                  width: auto;
                  max-height: 20px;
                  left: 0;
                  bottom: 0;
                  z-index: 3;
                  margin-bottom: 4px;
                "
              />
              <img
                src="../assets/Favor.png"
                alt="Image"
                style="
                  position: absolute;
                  width: auto;
                  max-height: 28px;
                  right: 0;
                  bottom: 0;
                  z-index: 4;
                "
              />
              <span
                style="
                  position: absolute;
                  top: 0;
                  left: 0;
                  z-index: 5;
                  font-size: 11px;
                  font-weight: bold;
                  margin-left: 9px;
                  text-shadow:
                    -1px -1px 0 #fff,
                    1px -1px 0 #fff,
                    -1px 1px 0 #fff,
                    1px 1px 0 #fff;
                "
                >Lv.{{ scope.row.StudentLevel }}</span
              >
              <span
                style="
                  position: absolute;
                  bottom: 0;
                  right: 0;
                  z-index: 6;
                  font-size: 11px;
                  font-weight: bold;
                  margin-right: 7px;
                  margin-bottom: 2px;
                  text-shadow:
                    -1px -1px 0 #fff,
                    1px -1px 0 #fff,
                    -1px 1px 0 #fff,
                    1px 1px 0 #fff;
                "
                >{{ scope.row.StudentFavorRank }}</span
              >
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" class="custom-table" min-width="160px">
          <template v-slot="scope">
            <el-table :data="[scope.row]" border>
              <el-table-column
                prop="StudentEX"
                label="EX"
                min-width="40px"
                align="center"
              >
              </el-table-column>
              <el-table-column
                prop="StudentNS"
                label="NS"
                min-width="40px"
                align="center"
              >
              </el-table-column>
              <el-table-column
                prop="StudentPS"
                label="PS"
                min-width="40px"
                align="center"
              >
              </el-table-column>
              <el-table-column
                prop="StudentSS"
                label="SS"
                min-width="40px"
                align="center"
              >
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column align="center" min-width="120px">
          <template v-slot="scope">
            <el-table
              :data="[scope.row]"
              :header-cell-style="equipmentHeaderStyle"
              class="custom-table"
              border
            >
              <el-table-column
                prop="equipment1Level"
                min-width="40px"
                align="center"
                label="装备等级"
              >
              </el-table-column>
              <el-table-column
                prop="equipment2Level"
                min-width="40px"
                align="center"
              >
              </el-table-column>
              <el-table-column
                prop="equipment3Level"
                min-width="40px"
                align="center"
              >
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column align="center">
          <template v-slot="scope">
            <el-table
              v-if="scope.row.WeaponStar"
              :data="[scope.row]"
              :header-cell-style="weaponHeaderStyle"
              class="custom-table"
            >
              <el-table-column
                prop="WeaponStarImgUrl"
                min-width="40px"
                align="center"
                label="专武"
              >
                <template v-slot="scope">
                  <div class="image-container">
                    <img
                      :src="scope.row.WeaponStarImgUrl"
                      style="width: 100%; height: 100%; top: 0; left: 0"
                    />
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="WeaponLevel"
                min-width="40px"
                align="center"
              >
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
      </el-table> -->
    </div>
  </div>
</template>

<script lang="ts" setup>
import axios from "axios";
import { ref, reactive } from "vue";
import { ElMessage, ElLoading } from "element-plus";

const fullscreenLoading = ref(false);

const form = reactive({
  server: "TW",
  friendCode: "",
});

const EchelonType: { [key: number]: string } = {
  2: "总力战&大决战&联合作战",
  11: "占领战",
  15: "火力演习",
};

const friendCount = ref(0);
const characterCount = ref(0);
const arenaRanking = ref();
const raidRanking = ref();
const eRaidRanking = ref();
const tableDataGroupDisplay = ref<FriendSearchResultDisplay[][]>();

const equipmentHeaderStyle = ({ row, column, rowIndex, columnIndex }: any) => {
  row[0].colSpan = 3;
  row[1].colSpan = 0;
  row[2].colSpan = 0;
};

const weaponHeaderStyle = ({ row, column, rowIndex, columnIndex }: any) => {
  row[0].colSpan = 2;
  row[1].colSpan = 0;
};

const TypeHeaderStyle = ({ row, column, rowIndex, columnIndex }: any) => {
  row[0].colSpan = 4;
  row[1].colSpan = 0;
  row[2].colSpan = 0;
  row[3].colSpan = 0;
};

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

const result = ref(false);

const onSubmit = async () => {
  fullscreenLoading.value = true;
  try {
    const friendResponse = await axios.post<friendSearchResponse>(
      "https://bacrawl.diyigemt.com/api/friend/search",
      { server: form.server, friendCode: form.friendCode }
    );
    if (friendResponse.data.Level === 0) {
      result.value = false;
      ElMessage.error("不存在!");
    } else {
      friendCount.value = friendResponse.data.FriendCount;
      characterCount.value = friendResponse.data.CharacterCount;
      arenaRanking.value = friendResponse.data.ArenaRanking;
      raidRanking.value = friendResponse.data.RaidRanking;
      eRaidRanking.value = friendResponse.data.EliminateRaidRanking;
      result.value = true;
      const createTableData = (item: any) => ({
        ImgUrl: new URL(`../assets/char/${item.UniqueId}.webp`, import.meta.url)
          .href,
        EchelonType: item.EchelonType,
        StudentLevel: item.Level,
        StudentStar: item.StarGrade,
        StudentStarImgUrl: new URL(
          `../assets/Star${item.StarGrade}.png`,
          import.meta.url
        ).href,
        WeaponStar: item.WeaponDB?.StarGrade ?? null,
        WeaponStarImgUrl: item.WeaponDB?.StarGrade
          ? new URL(
              `../assets/WStar${item.WeaponDB.StarGrade}.png`,
              import.meta.url
            ).href
          : null,
        WeaponLevel: item.WeaponDB?.Level ?? null,
        StudentFavorRank: item.FavorRank,
        StudentEX: item.ExSkillLevel,
        StudentNS: item.PublicSkillLevel,
        StudentPS: item.PassiveSkillLevel,
        StudentSS: item.ExtraPassiveSkillLevel,
        equipment1Tier: item.EquipmentDBs[0].Tier,
        equipment1Level: item.EquipmentDBs[0].Level,
        equipment2Tier: item.EquipmentDBs[1].Tier,
        equipment2Level: item.EquipmentDBs[1].Level,
        equipment3Tier: item.EquipmentDBs[2].Tier,
        equipment3Level: item.EquipmentDBs[2].Level,
      });

      const tableDataGroups: { [key: number]: FriendSearchResultDisplay[] } = {
        2: [],
        15: [],
        11: [],
      };

      friendResponse.data?.AssistCharacterDBs.forEach((item) => {
        const group = tableDataGroups[item.EchelonType] || null;
        group.push(createTableData(item));
        tableDataGroupDisplay.value = [
          tableDataGroups[2],
          tableDataGroups[15],
          tableDataGroups[11],
        ];
      });
    }
  } catch (error) {
    console.error(error);
  }
  fullscreenLoading.value = false;
};
</script>

<style lang="scss" scoped>
.web-global {
  text-align: left;
  margin-left: 16px;
  margin-right: 16px;
  padding: 4px;
  max-width: 800px;
  width: 100%;
}

span {
  font-size: 14px;
}

.button {
  width: 100%;
  margin-top: 8px;
}

.content-init {
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  background-color: white;
  width: 100%;
  padding: 2px;
  margin-top: 8px;
  max-width: 800px;
}

.searchResult {
  display: flex;
  padding: 16px;
  flex-direction: column;
  align-items: left;
  justify-content: left;
  width: 100%;
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

.image-container {
  position: relative;
  max-width: 100px; /* 根据实际情况调整 */
  width: 100%;
  height: auto; /* 根据实际情况调整 */
}
</style>
