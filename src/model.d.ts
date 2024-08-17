interface SimpleData {
  Rank: number;
  BestRankingPoint: number;
  Hard: string;
  BattleTime: string;
}

interface SimpleDataResponse {
  Data: SimpleData[];
  Timestamp: number;
}

interface CharacterDB {
  UniqueId: number;
  StarGrade: number;
  Level: number;
  SlotIndex: number;
  IsAssist: boolean;
  HasWeapon: boolean;
}

interface RaidTeamDetail {
  TryNumber: number;
  MainCharacterDBs: CharacterDB[];
  SupportCharacterDBs: CharacterDB[];
}

interface ComplexData {
  RepresentCharacterUniqueId: number;
  Level: number;
  Nickname: string;
  Tier: number;
  Rank: number;
  BestRankingPoint: number;
  Hard: string;
  BattleTime: string;
  RaidTeamDetail: RaidTeamDetail[];
}

interface ComplexDataResponse {
  Data: ComplexData[];
  Timestamp: number;
}

interface HardCountData {
  Hard: string;
  Count: number;
}

interface HardCountResponse {
  Data: HardCountData[];
  Timestamp: number;
}

interface TierDataTrack {
  Key: number[];
  Value: {
    [key: string]: number[];
  };
}

interface TierDataTrackResponse {
  Data: TierDataTrack;
}

interface RaidScoreDistribute {
  BestRankingPoint: number;
  Rank: number;
  BattleTime: number;
  Time: string;
  Hard: string;
  Number: number;
}

interface RaidScoreDistributeTrack {
  Key: number[];
  Value: RaidScoreDistribute[][];
}

interface RaidScoreDistributeResponse {
  Data: RaidScoreDistributeTrack;
}

interface RaidStatusList {
  SeasonType: number;
  SeasonId: number;
  SeasonDisplayId: number;
  BossName: string;
  SeasonStartDate: string;
  SeasonEndDate: string;
  SettlementEndDate: string;
  NextSeasonId: number;
  NextSeasonDisplayId: number;
  NextSeasonStartDate: string;
  NextSeasonEndDate: string;
  NextSettlementEndDate: string;
}

interface chooseBox {
  value: number;
  label: string;
}

interface ComplexDataPagingResponse {
  Data: ComplexData[];
  CurrentPage: number;
  TotalPages: number;
  TotalCount: number;
  Timestamp: number;
}

interface tableDataDisplay {
  Rank: number;
  BestRankingPoint: string;
  Hard: string;
  BattleTime: string;
}

interface tableDataDisplayERaid {
  Rank: number;
  BestRankingPoint: string;
  LightArmor: string;
  HeavyArmor: string;
  Unarmed: string;
}

interface simpleDataPagingResponseERaid {
  Data: simpleDataERaid[];
  CurrentPage: number;
  TotalPages: number;
  TotalCount: number;
  Timestamp: number;
}

interface simpleDataERaid {
  BossGroup: bossGroupSimpleERaid[];
  Rank: number;
  BestRankingPoint: number;
}

interface bossGroupSimpleERaid {
  BossName: string;
  BestRankingPoint: number;
  Hard: string;
  BattleTime: string;
}

interface ComplexDataERaid {
  BossGroup: bossGroupHavingTeamERaid[];
  RepresentCharacterUniqueId: number;
  Level: number;
  Nickname: string;
  Tier: number;
  Rank: number;
  BestRankingPoint: number;
}

interface bossGroupHavingTeamERaid {
  BossName: string;
  BestRankingPoint: number;
  Hard: string;
  BattleTime: string;
  RaidTeamDetail: RaidTeamDetail[];
}

interface complexDataPagingResponseERaid {
  Data: ComplexDataERaid[];
  CurrentPage: number;
  TotalPages: number;
  TotalCount: number;
  Timestamp: number;
}

interface Track {
  Key: number[];
  Value: number[];
}

interface TrackResponse {
  Data: Track;
}

interface friendSearchResponse {
  AccountId: number;
  Nickname: string;
  Level: number;
  ClanName: string;
  Comment: string;
  FriendCount: number;
  FriendCode: string;
  RepresentCharacterUniqueId: number;
  CharacterCount: number;
  LastNormalCampaignClearStageId: number;
  LastHardCampaignClearStageId: number;
  ArenaRanking: number;
  RaidRanking: number;
  RaidTier: number;
  EliminateRaidRanking: number;
  EliminateRaidTier: number;
  AssistCharacterDBs: AssistCharacterDB[];
}

interface AssistCharacterDB {
  EchelonType: number;
  SlotNumber: number;
  AccountId: number;
  AssistRelation: number;
  AssistCharacterServerId: number;
  NickName: string;
  EquipmentDBs: EquipmentDB[];
  WeaponDB: WeaponDB;
  GearDB: GearDB;
  CostumeId: number;
  CostumeDB: CostumeDB;
  IsMulligan: boolean;
  IsTSAInteraction: boolean;
  CombatStyleIndex: number;
  Type: number;
  ServerId: number;
  UniqueId: number;
  StarGrade: number;
  Level: number;
  Exp: number;
  FavorRank: number;
  FavorExp: number;
  PublicSkillLevel: number;
  ExSkillLevel: number;
  PassiveSkillLevel: number;
  ExtraPassiveSkillLevel: number;
  LeaderSkillLevel: number;
  IsNew: boolean;
  IsLocked: boolean;
  IsFavorite: boolean;
  EquipmentServerIds: number[];
  PotentialStats: Record<number, number>;
}

interface WeaponDB {
  Type: number;
  UniqueId: number;
  Level: number;
  Exp: number;
  StarGrade: number;
}

interface GearDB {
  Type: number;
  ServerId: number;
  UniqueId: number;
  Level: number;
  Exp: number;
  Tier: number;
  SlotIndex: number;
  BoundCharacterServerId: number;
  ToEquipmentDB: EquipmentDB;
}

interface EquipmentDB {
  Type: number;
  Level: number;
  Exp: number;
  Tier: number;
  ServerId: number;
  UniqueId: number;
  StackCount: number;
}

interface CostumeDB {
  Type: number;
  UniqueId: number;
  BoundCharacterServerId: number;
}

interface FriendSearchResultDisplay {
  ImgUrl: string;
  EchelonType: number;
  StudentLevel: number;
  StudentStar: number;
  StudentStarImgUrl: string;
  WeaponStar: number | null;
  WeaponStarImgUrl: string | null;
  WeaponLevel: number | null;
  StudentFavorRank: number;
  StudentEX: number;
  StudentNS: number;
  StudentPS: number;
  StudentSS: number;
  equipment1Tier: number;
  equipment1Level: number;
  equipment2Tier: number;
  equipment2Level: number;
  equipment3Tier: number;
  equipment3Level: number;
}

interface raidAnalysisDataResponse {
  HardSummaries: HardSummary[];
  CharacterSummaries: CharacterSummary[];
}

interface HardSummary {
  Hard: string;
  MaxTry: number;
  Count: number;
}

interface CharacterSummary {
  UniqueId: number;
  IsAssist: boolean;
  CharacterCount: number;
}
