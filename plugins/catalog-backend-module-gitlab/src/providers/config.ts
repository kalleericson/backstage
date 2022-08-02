/*
 * Copyright 2022 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Config } from '@backstage/config';
import { GitlabProviderConfig } from '../lib';

/**
 * Extracts the gitlab config from a config object
 *
 * @public
 *
 * @param id - The provider key
 * @param config - The config object to extract from
 */
function readGitlabConfig(id: string, config: Config): GitlabProviderConfig {
  const group = config.getOptionalString('group') ?? '';
  const host = config.getString('host');
  const branch = config.getOptionalString('branch') ?? 'master';
  const catalogFile =
    config.getOptionalString('entityFilename') ?? 'catalog-info.yaml';
  const projectPattern = new RegExp(
    config.getString('projectPattern') ?? /[\s\S]*/,
  );

  return {
    id,
    group,
    branch,
    host,
    catalogFile,
    projectPattern,
  };
}

/**
 * Extracts the gitlab config from a config object array
 *
 * @public
 *
 * @param config - The config object to extract from
 */
export function readGitlabConfigs(config: Config): GitlabProviderConfig[] {
  const configs: GitlabProviderConfig[] = [];

  const providerConfigs = config.getOptionalConfig('catalog.providers.gitlab');

  if (!providerConfigs) {
    return configs;
  }

  for (const id of providerConfigs.keys()) {
    configs.push(readGitlabConfig(id, providerConfigs.getConfig(id)));
  }

  return configs;
}
