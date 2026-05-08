# AETHELGARD MERGED FILE
# Origin Repository: claude-code5
# Original Path: vendor\sdk\src\resource.ts
# Merge Date: 2026-05-07T19:17:49.835125
# ---

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import * as Core from "./core.js";

export class APIResource {
  protected _client: Core.APIClient;

  constructor(client: Core.APIClient) {
    this._client = client;
  }
}
