# AETHELGARD MERGED FILE
# Origin Repository: other s
# Original Path: KanCollePlayerSimulator-master\肝帝模拟 改\Python脚本\独立\列出内外部装备类型不同的装备.py
# Merge Date: 2026-05-07T19:29:40.481175
# ---

from KancollePlayerSimulatorKaiCore import *
for equipConst in EquipmentConstUtility.All():
	external = EquipmentConstUtility.Type(equipConst)
	ingame = EquipmentConstUtility.TypeInGame(equipConst)
	if external != ingame:
		print("{0} => ex: {1}, in: {2}".format(EquipmentConstUtility.Name(equipConst), external, ingame))
print("all good")