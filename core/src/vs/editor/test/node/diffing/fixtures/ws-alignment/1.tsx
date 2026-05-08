# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\editor\test\node\diffing\fixtures\ws-alignment\1.tsx
# Merge Date: 2026-05-07T19:23:25.456945
# ---

import { Stack, Text } from '@fluentui/react';
import { View } from '../../layout/layout';

export const WelcomeView = () => {
	return (
		<View title='VS Code Tools'>
			<Stack grow={true} verticalFill={true}>
				<Stack.Item>
					<Text>
						Welcome to the VS Code Tools application.
					</Text>
				</Stack.Item>
			</Stack>
		</View>
	);
}
