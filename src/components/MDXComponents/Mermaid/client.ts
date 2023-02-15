// from https://github.com/facebook/docusaurus/blob/6b618bc9e5fcc9d52d3aa49a9d447f4d7ea76d41/packages/docusaurus-theme-mermaid/src/client/index.ts
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useMemo} from 'react';
import useTheme from '@/hooks/useTheme';
import type { MermaidConfig } from 'mermaid';
import mermaid from 'mermaid';

// Stable className to allow users to easily target with CSS
export const MermaidContainerClassName = 'mermaid-container';


export function useMermaidSvg(
  txt: string,
  mermaidConfigParam?: MermaidConfig,
): string {
  const {colorMode} = useTheme();
  const defaultMermaidConfig: MermaidConfig = {
    startOnLoad: false, 
    theme: colorMode === 'dark' ? 'dark' : 'default',
  };
  const mermaidConfig = mermaidConfigParam ?? defaultMermaidConfig;

  return useMemo(() => {
    /*
    Mermaid API is really weird :s
    It is a big mutable singleton with multiple config levels
    Note: most recent API type definitions are missing
    There are 2 kind of configs:
    - siteConfig: some kind of global/protected shared config
      you can only set with "initialize"
    - config/currentConfig
      the config the renderer will use
      it is reset to siteConfig before each render
      but it can be altered by the mermaid txt content itself through directives
    To use a new mermaid config (on colorMode change for example) we should
    update siteConfig, and it can only be done with initialize()
     */
    mermaid.mermaidAPI.initialize(mermaidConfig);

    /*
    Random client-only id, we don't care much about it
    But mermaid want an id so...
    */
    const mermaidId = `mermaid-svg-${Math.round(Math.random() * 10000000)}`;

    /*
    Not even documented: mermaid.render returns the svg string
    Using the documented form is un-necessary
     */
    return mermaid.mermaidAPI.render(mermaidId, txt);
  }, [txt, mermaidConfig]);
}