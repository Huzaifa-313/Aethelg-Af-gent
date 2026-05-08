# -*- coding: utf-8 -*-

"""
功能：
	选取和过滤舰船

使用方法：
	附加在需要的执行单元上（如基础编成舰队）
	在填写函数的地方填写需要的函数名（见范例配置中的示例）

更新记录：
	20260216 - 2.3.3
		修改海防战舰适配规则
	20251124 - 2.3.2
		适配海防战舰；更新等级上限
	20210619 - 2.3.1
		修改错误函数名
	20201006 - 2.3
		补充常用舰种
	20200806 - 2.2
		修改导出函数
	20200623 - 2.1
		默认排除不实用的船（まるゆ）
	20200527 - 2.0
		延迟初始化
	20200211 - 1.3
		修复Bug
	20200210 - 1.2
		修复Bug
	20200209 - 1.1
		多处优化
	20200208 - 1.0
		随KCPS1.3.3.0发布
"""

#===================================================#
#                                                   #
#                        导入                       #
#                                                   #
#===================================================#
from KancollePlayerSimulatorKaiCore import *
import time
import itertools
import math

#===================================================#
#                                                   #
#                        常量                       #
#                                                   #
#===================================================#
def getEquipConstId_v2(name):
	return EquipmentConstUtility.Id([obj for obj in EquipmentConstUtility.All() if EquipmentConstUtility.Name(obj) == name][0])

DLC_CONST_ID = getEquipConstId_v2("大発動艇") #大发的ID，能带特大发的船大发也能带
KHT_CONST_ID = getEquipConstId_v2("甲標的 甲型")
TNN_CONST_ID = getEquipConstId_v2("特二式内火艇")
SBC_CONST_ID = getEquipConstId_v2("増設バルジ(中型艦)")
DCP_CONST_ID = getEquipConstId_v2("九四式爆雷投射機")

def getShipConstId_v2(name):
	return ShipConstUtility.Id([obj for obj in ShipConstUtility.All() if ShipConstUtility.Name(obj) == name][0])

MARUYU_CONST_ID = getShipConstId_v2("まるゆ")

MAX_LEVEL = 185 # 等级上限

#===================================================#
#                                                   #
#                        工具                       #
#                                                   #
#===================================================#
# 属性获取助手
def getConst_v2(shipObj):
	return ShipConstUtility.ShipConst(shipObj)

def getId_v2(shipObj):
	return ShipUtility.Id(shipObj)

def getLevel_v2(shipObj):
	return ShipUtility.Level(shipObj)

def getExperience_v2(shipObj):
	return ShipUtility.Experience(shipObj)

def getAllowedEquipIds_v2(shipConstObj):
	return ShipConstUtility.AllowedEquipmentConsts(shipConstObj, EquipmentSlot.Slot1)

def getBeforeUpgradeIds_v2(shipConstObj):
	return ShipConstUtility.BeforeIds(shipConstObj)

def getIds_v2(shipObjs):
	return [getId_v2(shipObj) for shipObj in shipObjs]

# 复杂过滤器（界面里没提供的）
def filterLocked_v2(shipObjs):
	return [shipObj for shipObj in shipObjs if ShipUtility.ShipLocked(shipObj)]

def filterEquiptable_v2(shipObjs, equip_const_id): # 可以带某装备的
	return [shipObj for shipObj in shipObjs if equip_const_id in getAllowedEquipIds_v2(getConst_v2(shipObj))]

def filterNotEquiptable_v2(shipObjs, equip_const_id): # 不可以带某装备的
	return [shipObj for shipObj in shipObjs if equip_const_id not in getAllowedEquipIds_v2(getConst_v2(shipObj))]

def filterLevelRange_v2(shipObjs, low, high): # 筛选等级在范围内的船
	return [shipObj for shipObj in shipObjs if low <= getLevel_v2(shipObj) and getLevel_v2(shipObj) <= high]

def filterUpgraded_v2(shipObjs): # 筛选至少一改过后的
	return [shipObj for shipObj in shipObjs if len([i for i in getBeforeUpgradeIds_v2(getConst_v2(shipObj))]) > 0]

def filterNotUpgraded_v2(shipObjs): # 筛选没有一改的
	return [shipObj for shipObj in shipObjs if len([i for i in getBeforeUpgradeIds_v2(getConst_v2(shipObj))]) == 0]

def filterLevelAt_v2(shipObjs, level): # 筛选对应等级
	return [shipObj for shipObj in shipObjs if getLevel_v2(shipObj) == level]

def filterLevelNotAt_v2(shipObjs, level): # 筛选非对应等级
	return [shipObj for shipObj in shipObjs if getLevel_v2(shipObj) != level]

def filterLevelNotAt99_v2(shipObjs): # 筛选非99级
	return filterLevelNotAt_v2(shipObjs, 99)

def filterLevelAbove_v2(shipObjs, level): # 筛选对应等级以上
	return [shipObj for shipObj in shipObjs if getLevel_v2(shipObj) > level]

def filterLevelBelow_v2(shipObjs, level): # 筛选对应等级以下
	return [shipObj for shipObj in shipObjs if getLevel_v2(shipObj) < level]

def filterFrontProportion_v2(shipObjs, proportion): # 保留前一定比例的船
	return shipObjs[:int(math.ceil(len(shipObjs) * proportion))]

def filterBackProportion_v2(shipObjs, proportion): # 保留后一定比例的船
	return shipObjs[-int(math.ceil(len(shipObjs) * proportion)):]

def filterPracticalness_v2(shipObjs): # 筛掉不实用的船
	global MARUYU_CONST_ID
	return [shipObj for shipObj in shipObjs if not (\
		getLevel_v2(shipObj) < 100 and ShipConstUtility.Id(ShipConstUtility.Base(getConst_v2(shipObj))) == MARUYU_CONST_ID \
	)]

# 排序
def sortByExperienceAsc_v2(shipObjs): # 经验由低到高排序
	return sorted(shipObjs, key=lambda x: getExperience_v2(x))

def sortByExperienceDesc_v2(shipObjs): # 经验由高到低排序
	return sorted(shipObjs, key=lambda x: getExperience_v2(x), reverse=True)

def sortByIdAsc_v2(shipObjs): # ID由低到高排序
	return sorted(shipObjs, key=lambda x: getId_v2(x))

def sortByLevelingPreference_v2(shipObjs): # 以提升整体等级为目的的排序[改后99级以下，改前99级以下，改后99级以上，改前99级以上，其他]（同类内等级升序）
	shipObjs = sortByExperienceAsc_v2(shipObjs)
	upgraded = filterUpgraded_v2(shipObjs)
	notUpgraded = [shipObj for shipObj in shipObjs if shipObj not in upgraded]
	upgraded_below = filterLevelBelow_v2(upgraded, 99)
	upgraded_above = filterLevelRange_v2(upgraded, 99 + 1, MAX_LEVEL - 1)
	upgraded_max = filterLevelAt_v2(notUpgraded, MAX_LEVEL)
	upgraded_99 = filterLevelAt_v2(upgraded, 99)
	notUpgraded_below = filterLevelBelow_v2(notUpgraded, 99)
	notUpgraded_above = filterLevelRange_v2(notUpgraded, 99 + 1, MAX_LEVEL - 1)
	notUpgraded_max = filterLevelAt_v2(notUpgraded, MAX_LEVEL)
	notUpgraded_99 = filterLevelAt_v2(notUpgraded, 99)
	return upgraded_below + notUpgraded_below + upgraded_above + notUpgraded_above + upgraded_99 + notUpgraded_99 + upgraded_max + notUpgraded_max

def sortByForcePreference_v2(shipObjs): # 强度排序[非99级， 满级， 99级]
	level_99 = filterLevelAt_v2(shipObjs, 99)
	level_max = filterLevelAt_v2(shipObjs, MAX_LEVEL)
	max_and_99 = level_max + level_99
	level_not_full = [shipObj for shipObj in shipObjs if shipObj not in max_and_99]
	return sortByExperienceDesc_v2(level_not_full) + max_and_99

# 舰船集合（只列出了普遍用得着的；返回的舰船之后还会依据界面中的设置过滤一遍）
shipsState = None # ShipUtility的一个参数，不提供也可以，但会每次都查询这个值，此处复用的话可以加速执行
lambdas = {}
lists = {}

def getList_v2(key):
	global lambdas
	global lists
	if key not in lists:
		lists[key] = lambdas[key]()
	return lists[key]

lambdas["all"] = lambda: sortByExperienceAsc_v2(filterPracticalness_v2(ShipUtility.All(shipsState))) # 所有舰船，经验升序
lambdas["de_cd"] = lambda: [shipObj for shipObj in getList_v2("all") if ShipUtility.Type(shipObj) == ShipType.Escort] # DE 和 CD
lambdas["de"] = lambda: filterEquiptable_v2(getList_v2("de_cd"), DCP_CONST_ID) # DE
lambdas["cd"] = lambda: filterNotEquiptable_v2(getList_v2("de_cd"), DCP_CONST_ID) # CD
lambdas["dd"] = lambda: [shipObj for shipObj in getList_v2("all") if ShipUtility.Type(shipObj) == ShipType.Destroyer] # DD
lambdas["cl"] = lambda: [shipObj for shipObj in getList_v2("all") if ShipUtility.Type(shipObj) == ShipType.LightCruiser] # CL
lambdas["av"] = lambda: [shipObj for shipObj in getList_v2("all") if ShipUtility.Type(shipObj) == ShipType.SeaplaneCarrier] # AV
lambdas["ca"] = lambda: [shipObj for shipObj in getList_v2("all") if ShipUtility.Type(shipObj) == ShipType.HeavyCruiser] # CA
lambdas["cav"] = lambda: [shipObj for shipObj in getList_v2("all") if ShipUtility.Type(shipObj) == ShipType.AircraftCruiser] # CAV
lambdas["ca_cav"] = lambda: sortByExperienceAsc_v2(itertools.chain(getList_v2("ca"), getList_v2("cav"))) # CA 和 CAV
lambdas["bbc"] = lambda: [shipObj for shipObj in getList_v2("all") if ShipUtility.Type(shipObj) == ShipType.BattleCruiser] # BB（高速）
lambdas["bb"] = lambda: [shipObj for shipObj in getList_v2("all") if ShipUtility.Type(shipObj) in (ShipType.Battleship, ShipType.SuperDreadnoughts)] # BB（低速）
lambdas["bbv"] = lambda: [shipObj for shipObj in getList_v2("all") if ShipUtility.Type(shipObj) == ShipType.AviationBattleship] # BBV
lambdas["bb_bbc_bbv"] = lambda: sortByExperienceAsc_v2(itertools.chain(getList_v2("bb"), getList_v2("bbc"), getList_v2("bbv"))) # BB 和 BBC 和 BBV
lambdas["cv"] = lambda: [shipObj for shipObj in getList_v2("all") if ShipUtility.Type(shipObj) == ShipType.AircraftCarrier] # CV
lambdas["cvb"] = lambda: [shipObj for shipObj in getList_v2("all") if ShipUtility.Type(shipObj) == ShipType.ArmouredAircraftCarrier] # CVB
lambdas["cv_cvb"] = lambda: sortByExperienceAsc_v2(itertools.chain(getList_v2("cv"), getList_v2("cvb"))) # CV 和 CVB
lambdas["cvl"] = lambda: [shipObj for shipObj in getList_v2("all") if ShipUtility.Type(shipObj) == ShipType.LightAircraftCarrier] # CVL
lambdas["cv_cvb_cvl"] = lambda: sortByExperienceAsc_v2(itertools.chain(getList_v2("cv"), getList_v2("cvb"), getList_v2("cvl"))) # CV 和 CVB 和 CVL
lambdas["ss"] = lambda: [shipObj for shipObj in getList_v2("all") if ShipUtility.Type(shipObj) == ShipType.Submarine] # SS
lambdas["ssv"] = lambda: [shipObj for shipObj in getList_v2("all") if ShipUtility.Type(shipObj) == ShipType.AircraftCarryingSubmarine] # SSV
lambdas["ss_ssv"] = lambda: sortByExperienceAsc_v2(itertools.chain(getList_v2("ss"), getList_v2("ssv"))) # SS 和 SSV
lambdas["as"] = lambda: [shipObj for shipObj in getList_v2("all") if ShipUtility.Type(shipObj) == ShipType.SubmarineTender] # AS
lambdas["ar"] = lambda: [shipObj for shipObj in getList_v2("all") if ShipUtility.Type(shipObj) == ShipType.RepairShip] # AR
lambdas["ao"] = lambda: [shipObj for shipObj in getList_v2("all") if ShipUtility.Type(shipObj) == ShipType.FleetOiler] # AO
lambdas["ct"] = lambda: [shipObj for shipObj in getList_v2("all") if ShipUtility.Type(shipObj) == ShipType.TrainingCruiser] # CT
lambdas["clt"] = lambda: [shipObj for shipObj in getList_v2("all") if ShipUtility.Type(shipObj) == ShipType.TorpedoCruiser] # CLT

lambdas["cvl_upgraded"] = lambda: filterUpgraded_v2(getList_v2("cvl")) # 至少一改之后的CVL
lambdas["av_upgraded"] = lambda: filterUpgraded_v2(getList_v2("av")) # 至少一改之后的AV
lambdas["cl_upgraded"] = lambda: filterUpgraded_v2(getList_v2("cl")) # 至少一改之后的CL
lambdas["dd_upgraded"] = lambda: filterUpgraded_v2(getList_v2("dd")) # 至少一改之后的DD
lambdas["de_upgraded"] = lambda: filterUpgraded_v2(getList_v2("de")) # 至少一改之后的DE
lambdas["ss_upgraded"] = lambda: filterUpgraded_v2(getList_v2("ss")) # 至少一改之后的SS
lambdas["ssv_upgraded"] = lambda: filterUpgraded_v2(getList_v2("ssv")) # 至少一改之后的SSV
lambdas["ss_ssv_upgraded"] = lambda: filterUpgraded_v2(getList_v2("ss_ssv")) # 至少一改之后的SS和SSV

lambdas["cl_dlc"] = lambda: filterEquiptable_v2(getList_v2("cl_upgraded"), DLC_CONST_ID) # 可以带大发的CL
lambdas["dd_dlc"] = lambda: filterEquiptable_v2(getList_v2("dd_upgraded"), DLC_CONST_ID) # 可以带大发的DD
lambdas["cl_no_dlc"] = lambda: filterNotEquiptable_v2(getList_v2("cl_upgraded"), DLC_CONST_ID) # 不可以带大发的CL
lambdas["dd_no_dlc"] = lambda: filterNotEquiptable_v2(getList_v2("dd_upgraded"), DLC_CONST_ID) # 不可以带大发的DD
lambdas["cl_kht"] = lambda: filterEquiptable_v2(getList_v2("cl_upgraded"), KHT_CONST_ID) # 可以带甲标的CL
lambdas["dd_tnn"] = lambda: filterEquiptable_v2(getList_v2("dd_upgraded"), TNN_CONST_ID) # 可以带内火艇的DD
lambdas["dd_dlc_tnn"] = lambda: filterEquiptable_v2(filterEquiptable_v2(getList_v2("dd_upgraded"), DLC_CONST_ID), TNN_CONST_ID) # 可以带大发和内火艇的DD
lambdas["dd_sbc"] = lambda: filterEquiptable_v2(getList_v2("dd_upgraded"), SBC_CONST_ID) # 可以带甲板的DD

lambdas["cl_expedition"] = lambda: filterFrontProportion_v2(sortByLevelingPreference_v2(getList_v2("cl_no_dlc")), 0.8) # 需要靠远征练级的CL
lambdas["dd_expedition"] = lambda: filterFrontProportion_v2(sortByLevelingPreference_v2(getList_v2("dd_no_dlc")), 0.8) # 需要靠远征练级的DD
lambdas["cvl_expedition"] = lambda: filterFrontProportion_v2(sortByLevelingPreference_v2(getList_v2("cvl_upgraded")), 0.8) # 需要靠远征练级的CVL
lambdas["av_expedition"] = lambda: filterFrontProportion_v2(sortByLevelingPreference_v2(getList_v2("av_upgraded")), 0.8) # 需要靠远征练级的AV
lambdas["de_expedition"] = lambda: filterFrontProportion_v2(sortByLevelingPreference_v2(getList_v2("de_upgraded")), 0.8) # 需要靠远征练级的DE
lambdas["ss_ssv_expedition"] = lambda: filterFrontProportion_v2(sortByLevelingPreference_v2(getList_v2("ss_ssv_upgraded")), 0.8) # 需要靠远征练级的SS和SSV

lambdas["expedition"] = lambda: getList_v2("cl_dlc") + getList_v2("dd_dlc") + getList_v2("cl_expedition") + getList_v2("dd_expedition") + getList_v2("cvl_expedition") + getList_v2("av_expedition") + getList_v2("de_expedition") + getList_v2("ss_ssv_expedition") # 被用作全自动远征的船
lambdas["disposable_v2"] = lambda: sortByIdAsc_v2(filterLevelRange_v2(getList_v2("dd"), 1, 5)) # 狗粮

lambdas["bb_asc"] = lambda: sortByLevelingPreference_v2(filterLocked_v2(getList_v2("bb"))) # BB练级排序
lambdas["bbc_asc"] = lambda: sortByLevelingPreference_v2(filterLocked_v2(getList_v2("bbc"))) # BBC练级排序
lambdas["bbv_asc"] = lambda: sortByLevelingPreference_v2(filterLocked_v2(getList_v2("bbv"))) # BBV练级排序
lambdas["bb_bbc_bbv_asc"] = lambda: sortByLevelingPreference_v2(filterLocked_v2(getList_v2("bb_bbc_bbv"))) # BB和BBC和BBV练级排序
lambdas["cv_asc"] = lambda: sortByLevelingPreference_v2(filterLocked_v2(getList_v2("cv"))) # CV练级排序
lambdas["cvb_asc"] = lambda: sortByLevelingPreference_v2(filterLocked_v2(getList_v2("cvb"))) # CVB练级排序
lambdas["cv_cvb_asc"] = lambda: sortByLevelingPreference_v2(filterLocked_v2(getList_v2("cv_cvb"))) # CV和CVB练级排序
lambdas["cvl_asc"] = lambda: sortByLevelingPreference_v2(filterLocked_v2(getList_v2("cvl"))) # CVL练级排序
lambdas["cv_cvb_cvl_asc"] = lambda: sortByLevelingPreference_v2(filterLocked_v2(getList_v2("cv_cvb_cvl"))) # CV和CVB和CVL练级排序
lambdas["ca_asc"] = lambda: sortByLevelingPreference_v2(filterLocked_v2(getList_v2("ca"))) # CA练级排序
lambdas["cav_asc"] = lambda: sortByLevelingPreference_v2(filterLocked_v2(getList_v2("cav"))) # CAV练级排序
lambdas["ca_cav_asc"] = lambda: sortByLevelingPreference_v2(filterLocked_v2(getList_v2("ca_cav"))) # CA 和 CAV练级排序
lambdas["av_asc"] = lambda: sortByLevelingPreference_v2(filterLocked_v2(getList_v2("av"))) # AV练级排序
lambdas["cl_asc"] = lambda: sortByLevelingPreference_v2(filterLocked_v2(getList_v2("cl"))) # CL练级排序
lambdas["clt_asc"] = lambda: sortByLevelingPreference_v2(filterLocked_v2(getList_v2("clt"))) # CLT练级排序
lambdas["ct_asc"] = lambda: sortByLevelingPreference_v2(filterLocked_v2(getList_v2("ct"))) # CT练级排序
lambdas["dd_asc"] = lambda: sortByLevelingPreference_v2(filterLocked_v2(getList_v2("dd"))) # DD练级排序
lambdas["de_asc"] = lambda: sortByLevelingPreference_v2(filterLocked_v2(getList_v2("de"))) # DE练级排序
lambdas["ss_asc"] = lambda: sortByLevelingPreference_v2(filterLocked_v2(getList_v2("ss"))) # SS练级排序
lambdas["ssv_asc"] = lambda: sortByLevelingPreference_v2(filterLocked_v2(getList_v2("ssv"))) # SSV练级排序
lambdas["ss_ssv_asc"] = lambda: sortByLevelingPreference_v2(filterLocked_v2(getList_v2("ss_ssv"))) # SS和SSV练级排序
lambdas["ao_asc"] = lambda: sortByLevelingPreference_v2(filterLocked_v2(getList_v2("ao"))) # AO练级排序
lambdas["as_asc"] = lambda: sortByLevelingPreference_v2(filterLocked_v2(getList_v2("as"))) # AS练级排序

lambdas["bb_desc"] = lambda: sortByForcePreference_v2(filterLocked_v2(getList_v2("bb"))) # BB强度排序
lambdas["bbc_desc"] = lambda: sortByForcePreference_v2(filterLocked_v2(getList_v2("bbc"))) # BBC强度排序
lambdas["bbv_desc"] = lambda: sortByForcePreference_v2(filterLocked_v2(getList_v2("bbv"))) # BBV强度排序
lambdas["bb_bbc_bbv_desc"] = lambda: sortByForcePreference_v2(filterLocked_v2(getList_v2("bb_bbc_bbv"))) # BB和BBC和BBV强度排序
lambdas["cv_desc"] = lambda: sortByForcePreference_v2(filterLocked_v2(getList_v2("cv"))) # CV强度排序
lambdas["cvb_desc"] = lambda: sortByForcePreference_v2(filterLocked_v2(getList_v2("cvb"))) # CVB强度排序
lambdas["cv_cvb_desc"] = lambda: sortByForcePreference_v2(filterLocked_v2(getList_v2("cv_cvb"))) # CV和CVB强度排序
lambdas["cvl_desc"] = lambda: sortByForcePreference_v2(filterLocked_v2(getList_v2("cvl"))) # CVL强度排序
lambdas["cv_cvb_cvl_desc"] = lambda: sortByForcePreference_v2(filterLocked_v2(getList_v2("cv_cvb_cvl"))) # CV和CVB和CVL强度排序
lambdas["cav_desc"] = lambda: sortByForcePreference_v2(filterLocked_v2(getList_v2("cav"))) # CAV强度排序
lambdas["ca_desc"] = lambda: sortByForcePreference_v2(filterLocked_v2(getList_v2("ca"))) # CA强度排序
lambdas["ca_cav_desc"] = lambda: sortByForcePreference_v2(filterLocked_v2(getList_v2("ca_cav"))) # CA和CAV强度排序
lambdas["av_desc"] = lambda: sortByForcePreference_v2(filterLocked_v2(getList_v2("av"))) # AV强度排序
lambdas["cl_desc"] = lambda: sortByForcePreference_v2(filterLocked_v2(getList_v2("cl"))) # CL强度排序
lambdas["clt_desc"] = lambda: sortByForcePreference_v2(filterLocked_v2(getList_v2("clt"))) # CLT强度排序
lambdas["ct_desc"] = lambda: sortByForcePreference_v2(filterLocked_v2(getList_v2("ct"))) # CT强度排序
lambdas["cl_kht_desc"] = lambda: sortByForcePreference_v2(filterLocked_v2(getList_v2("cl_kht"))) # 可以带甲标的CL强度排序
lambdas["dd_desc"] = lambda: sortByForcePreference_v2(filterLocked_v2(getList_v2("dd"))) # DD强度排序
lambdas["dd_dlc_desc"] = lambda: sortByForcePreference_v2(filterLocked_v2(getList_v2("dd_dlc"))) # 可以带大发的DD强度排序
lambdas["dd_tnn_desc"] = lambda: sortByForcePreference_v2(filterLocked_v2(getList_v2("dd_tnn"))) # 可以带内火艇的DD强度排序
lambdas["dd_dlc_tnn_desc"] = lambda: sortByForcePreference_v2(filterLocked_v2(getList_v2("dd_dlc_tnn"))) # 可以带大发和内火艇的DD强度排序
lambdas["dd_sbc_desc"] = lambda: sortByForcePreference_v2(filterLocked_v2(getList_v2("dd_sbc"))) # 可以带甲板的DD强度排序
lambdas["de_desc"] = lambda: sortByForcePreference_v2(filterLocked_v2(getList_v2("de"))) # DE强度排序
lambdas["ss_desc"] = lambda: sortByForcePreference_v2(filterLocked_v2(getList_v2("ss"))) # SS强度排序
lambdas["ssv_desc"] = lambda: sortByForcePreference_v2(filterLocked_v2(getList_v2("ssv"))) # SSV强度排序
lambdas["ss_ssv_desc"] = lambda: sortByForcePreference_v2(filterLocked_v2(getList_v2("ss_ssv"))) # SS和SSV强度排序
lambdas["ao_desc"] = lambda: sortByForcePreference_v2(filterLocked_v2(getList_v2("ao"))) # AO强度排序
lambdas["as_desc"] = lambda: sortByForcePreference_v2(filterLocked_v2(getList_v2("as"))) # AS强度排序

# 迭代器
iters = {}
def reset_v2():
	global shipsState
	global lists
	global iters
	shipsState = GameState.Ships()
	lists.clear()
	iters.clear()

def getIter_v2(key):
	global iters
	if key not in iters: # 创建迭代器
		iters[key] = iter(getIds_v2(getList_v2(key)))
	return iters[key]

def getOne_v2(key):
	try:
		return next(getIter_v2(key))
	except StopIteration:
		iters.pop(key)
		return None # 返回-1也行

#===================================================#
#                                                   #
#                        导出                       #
#                                                   #
#===================================================#
# 入渠
def dock_expedition_v2(id): # 用于刷闪修理防止入渠不用于远征的船
	# 每次都查询就太慢了，但这个确实需要更新，但又不需要更新得太频
	from random import random
	if random() <= 0.05:
		reset_v2()
	return id in getIds_v2(getList_v2("expedition"))

# 编成舰队
def OnCandidate_v2(): # 编成计算时会调用
	reset_v2()

def disposable_v2(): # 因为狗粮受拆船影响大，所以需要经常更新候选
	key = "disposable_v2"
	id = getOne_v2(key)
	iterEnd = id is None
	isInvalidId = not iterEnd and ShipUtility.Ship(id) is None # 查找不到船了，就说明解体过一次
	if iterEnd or isInvalidId:
		reset_v2()
		id = getOne_v2(key)
	return id

def grantByLevel_65_v2(ship): # 取自远征38的旗舰等级要求
	global shipsState
	return ShipUtility.Level(ship, shipsState) >= 65

def grantByLevel_50_v2(ship): # 取自远征37、45的旗舰等级要求
	global shipsState
	return ShipUtility.Level(ship, shipsState) >= 50

def grantByLevel_40_v2(ship): # 取自远征B1的旗舰等级要求
	global shipsState
	return ShipUtility.Level(ship, shipsState) >= 40

def grantByLevel_30_v2(ship): # 取自远征41的旗舰等级要求
	global shipsState
	return ShipUtility.Level(ship, shipsState) >= 30

def grantByLevel_20_v2(ship): # 取自远征A2的旗舰等级要求
	global shipsState
	return ShipUtility.Level(ship, shipsState) >= 20

dd_dlc = lambda : getOne_v2("dd_dlc")
cl_dlc = lambda : getOne_v2("cl_dlc")
cl_kht = lambda : getOne_v2("cl_kht")

cvl_expedition = lambda : getOne_v2("cvl_expedition")
av_expedition = lambda : getOne_v2("av_expedition")
cl_expedition = lambda : getOne_v2("cl_expedition")
dd_expedition = lambda : getOne_v2("dd_expedition")
de_expedition = lambda : getOne_v2("de_expedition")
ss_ssv_expedition = lambda : getOne_v2("ss_ssv_expedition")

bb_asc = lambda : getOne_v2("bb_asc")
bbc_asc = lambda : getOne_v2("bbc_asc")
bbv_asc = lambda : getOne_v2("bbv_asc")
bb_bbc_bbv_asc = lambda : getOne_v2("bb_bbc_bbv_asc")
cv_asc = lambda : getOne_v2("cv_asc")
cvb_asc = lambda : getOne_v2("cvb_asc")
cv_cvb_asc = lambda : getOne_v2("cv_cvb_asc")
cvl_asc = lambda : getOne_v2("cvl_asc")
cv_cvb_cvl_asc = lambda : getOne_v2("cv_cvb_cvl_asc")
ca_asc = lambda : getOne_v2("ca_asc")
cav_asc = lambda : getOne_v2("cav_asc")
ca_cav_asc = lambda : getOne_v2("ca_cav_asc")
av_asc = lambda : getOne_v2("av_asc")
cl_asc = lambda : getOne_v2("cl_asc")
clt_asc = lambda : getOne_v2("clt_asc")
ct_asc = lambda : getOne_v2("ct_asc")
dd_asc = lambda : getOne_v2("dd_asc")
de_asc = lambda : getOne_v2("de_asc")
ss_asc = lambda : getOne_v2("ss_asc")
ssv_asc = lambda : getOne_v2("ssv_asc")
ss_ssv_asc = lambda : getOne_v2("ss_ssv_asc")
ao_asc = lambda : getOne_v2("ao_asc")
as_asc = lambda : getOne_v2("as_asc")

bb_desc = lambda : getOne_v2("bb_desc")
bbc_desc = lambda : getOne_v2("bbc_desc")
bbv_desc = lambda : getOne_v2("bbv_desc")
bb_bbc_bbv_desc = lambda : getOne_v2("bb_bbc_bbv_desc")
cv_desc = lambda : getOne_v2("cv_desc")
cvb_desc = lambda : getOne_v2("cvb_desc")
cv_cvb_desc = lambda : getOne_v2("cv_cvb_desc")
cvl_desc = lambda : getOne_v2("cvl_desc")
cv_cvb_cvl_desc = lambda : getOne_v2("cv_cvb_cvl_desc")
cav_desc = lambda : getOne_v2("cav_desc")
ca_desc = lambda : getOne_v2("ca_desc")
ca_cav_desc = lambda : getOne_v2("ca_cav_desc")
av_desc = lambda : getOne_v2("av_desc")
cl_desc = lambda : getOne_v2("cl_desc")
clt_desc = lambda : getOne_v2("clt_desc")
ct_desc = lambda : getOne_v2("ct_desc")
cl_kht_desc = lambda : getOne_v2("cl_kht_desc")
dd_desc = lambda : getOne_v2("dd_desc")
dd_dlc_desc = lambda : getOne_v2("dd_dlc_desc")
dd_tnn_desc = lambda : getOne_v2("dd_tnn_desc")
dd_dlc_tnn_desc = lambda : getOne_v2("dd_dlc_tnn_desc")
dd_sbc_desc = lambda : getOne_v2("dd_sbc_desc")
de_desc = lambda : getOne_v2("de_desc")
ss_desc = lambda : getOne_v2("ss_desc")
ssv_desc = lambda : getOne_v2("ssv_desc")
ss_ssv_desc = lambda : getOne_v2("ss_ssv_desc")
ao_desc = lambda : getOne_v2("ao_desc")
as_desc = lambda : getOne_v2("as_desc")
