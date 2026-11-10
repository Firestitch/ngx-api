export interface IModuleConfig {
  maxFileConnections?: number;

  /**
   * Part of every saved answer's signature (apiCacheSignature()), so answers
   * saved for one scope are never handed back in another. An app with
   * sign-in returns the signed-in account here. Unset, every answer shares one
   * scope.
   */
  cacheScope?: () => string;

  /**
   * How long a StaleWhileRevalidate answer is kept after it was last saved, in
   * milliseconds. 7 days when unset.
   */
  cacheLifetime?: number;

  /**
   * The most StaleWhileRevalidate answers kept; past it, the ones saved
   * longest ago go first. 500 when unset.
   */
  cacheMaxRows?: number;
}
