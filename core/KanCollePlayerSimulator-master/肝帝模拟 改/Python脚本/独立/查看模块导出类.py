# AETHELGARD MERGED FILE
# Origin Repository: other s
# Original Path: KanCollePlayerSimulator-master\肝帝模拟 改\Python脚本\独立\查看模块导出类.py
# Merge Date: 2026-05-07T19:29:40.812176
# ---

# -*- coding: utf-8 -*-

# 查看模块里都有什么东西能在python脚本里用

import KancollePlayerSimulatorKaiCore
import KancollePlayerSimulatorKai

def print_all(module_):
	modulelist = dir(module_)
	length = len(modulelist)
	for i in range(0,length,1):
		print(getattr(module_,modulelist[i]))

print_all(KancollePlayerSimulatorKaiCore)
print_all(KancollePlayerSimulatorKai)