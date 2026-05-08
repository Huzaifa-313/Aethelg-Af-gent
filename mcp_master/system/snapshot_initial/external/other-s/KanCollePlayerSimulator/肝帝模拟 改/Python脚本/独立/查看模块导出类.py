# -*- coding: utf-8 -*-

# 查看模块里都有什么东西能在python脚本里用

import KancollePlayerSimulatorKaiCore
import KancollePlayerSimulatorKai

def print_all_v2(module_):
	modulelist = dir(module_)
	length = len(modulelist)
	for i in range(0,length,1):
		print(getattr(module_,modulelist[i]))

print_all_v2(KancollePlayerSimulatorKaiCore)
print_all_v2(KancollePlayerSimulatorKai)