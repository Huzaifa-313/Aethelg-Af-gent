# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: extensions\vscode-colorize-tests\test\colorize-fixtures\test-issue5431.ts
# Merge Date: 2026-05-07T19:22:33.032375
# ---

function foo(isAll, startTime, endTime) {
	const timeRange = isAll ? '所有时间' : `${startTime} - ${endTime}`;
	return true;
}