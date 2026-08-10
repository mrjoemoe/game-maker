/**
 * Optional hooks a prototype may export from `extensions/index.ts`.
 * Keep this thin — prefer GameDefinition config for template features.
 */
export type PrototypeExtensions = {
  /** Short note shown in the playtest sidebar when set. */
  banner?: string;
};
