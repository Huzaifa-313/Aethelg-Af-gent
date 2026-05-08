# AETHELGARD MERGED FILE
# Origin Repository: G-Labs-Automation-v2.0.9-win
# Original Path: playwright\driver\package\cli.js
# Merge Date: 2026-05-07T19:25:26.634462
# ---

#!/usr/bin/env node
/**
 * Copyright (c) Microsoft Corporation.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const { program } = require('./lib/cli/programWithTestStub');
program.parse(process.argv);
